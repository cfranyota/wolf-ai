const { app, BrowserWindow, shell, session, ipcMain, systemPreferences, desktopCapturer, clipboard, screen } = require('electron');
const { spawn } = require('child_process');
const http  = require('http');
const https = require('https');
const path  = require('path');
const fs    = require('fs');

const MIME = {
  '.html':  'text/html; charset=utf-8',
  '.js':    'application/javascript',
  '.css':   'text/css',
  '.svg':   'image/svg+xml',
  '.png':   'image/png',
  '.ico':   'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff':  'font/woff',
  '.ttf':   'font/ttf',
};

const PORT  = 8765; // different from Call Coach's 8000
const isDev = !app.isPackaged;

// Reuse TLS connections to Anthropic across coaching calls in a session.
const claudeAgent = new https.Agent({ keepAlive: true });

// ─── Proxy helpers ────────────────────────────────────────────────────────────

function sendJSON(res, code, data) {
  const body = Buffer.isBuffer(data) ? data : Buffer.from(JSON.stringify(data));
  res.writeHead(code, {
    'Content-Type': 'application/json',
    'Content-Length': body.length,
    'Access-Control-Allow-Origin': '*',
  });
  res.end(body);
}

// The system prompt is a static ~3.5k-char block resent on every call — mark it
// cacheable so Anthropic can skip reprocessing it within the cache window.
function withPromptCache(body) {
  if (typeof body.system === 'string' && body.system) {
    body.system = [{ type: 'text', text: body.system, cache_control: { type: 'ephemeral' } }];
  }
  return body;
}

function handleClaude(body, apiKey, res) {
  body.stream = false;
  const payload = Buffer.from(JSON.stringify(withPromptCache(body)), 'utf8');
  const req = https.request({
    hostname: 'api.anthropic.com',
    path: '/v1/messages',
    method: 'POST',
    agent: claudeAgent,
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': payload.length,
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
  }, (up) => {
    const chunks = [];
    up.on('data', c => chunks.push(c));
    up.on('end', () => sendJSON(res, up.statusCode, Buffer.concat(chunks)));
  });
  req.on('error', e => sendJSON(res, 500, { error: { message: e.message } }));
  req.setTimeout(60000, () => { req.destroy(); sendJSON(res, 500, { error: { message: 'timeout' } }); });
  req.write(payload);
  req.end();
}

function handleClaudeStream(body, apiKey, res) {
  body.stream = true;
  const payload = Buffer.from(JSON.stringify(withPromptCache(body)), 'utf8');

  res.writeHead(200, {
    'Content-Type':  'text/event-stream',
    'Cache-Control': 'no-cache',
    'Access-Control-Allow-Origin': '*',
  });

  const req = https.request({
    hostname: 'api.anthropic.com',
    path: '/v1/messages',
    method: 'POST',
    agent: claudeAgent,
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': payload.length,
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
  }, (up) => {
    if (up.statusCode !== 200) {
      // Auth/rate-limit errors come back as a plain JSON body, not SSE framing.
      const chunks = [];
      up.on('data', c => chunks.push(c));
      up.on('end', () => {
        let msg = 'Claude error ' + up.statusCode;
        try { msg = JSON.parse(Buffer.concat(chunks)).error?.message || msg; } catch (_) {}
        res.write(`data: ${JSON.stringify({ error: msg })}\n\n`);
        res.write('data: [DONE]\n\n');
        res.end();
      });
      return;
    }

    let buf = '';
    up.on('data', chunk => {
      buf += chunk.toString('utf8');
      const lines = buf.split('\n');
      buf = lines.pop();
      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;
        const raw = line.slice(6);
        try {
          const evt = JSON.parse(raw);
          if (evt.type === 'content_block_delta' && evt.delta?.type === 'text_delta') {
            res.write(`data: ${JSON.stringify({ text: evt.delta.text })}\n\n`);
          } else if (evt.type === 'error') {
            res.write(`data: ${JSON.stringify({ error: evt.error?.message || 'stream error' })}\n\n`);
          } else if (evt.type === 'message_stop') {
            res.write('data: [DONE]\n\n');
          }
        } catch (_) {}
      }
    });
    up.on('end',   () => { res.write('data: [DONE]\n\n'); res.end(); });
    up.on('error', (e) => { res.write(`data: ${JSON.stringify({ error: e.message })}\n\n`); res.end(); });
  });
  req.on('error', (e) => { res.write(`data: ${JSON.stringify({ error: e.message })}\n\n`); res.end(); });
  req.setTimeout(60000, () => { req.destroy(); res.write(`data: ${JSON.stringify({ error: 'timeout' })}\n\n`); res.end(); });
  req.write(payload);
  req.end();
}

function handleOllama(body, res) {
  const model     = body.model     || 'llama3.2:3b';
  const baseUrl   = body.baseUrl   || 'http://localhost:11434';
  const authToken = body.authToken || '';
  const isLocal   = baseUrl.includes('localhost') || baseUrl.includes('127.0.0.1');
  // Use OpenAI-compatible format for cloud providers; Ollama format for local
  const useOpenAI = body.openaiCompat || !isLocal;

  const messages = [];
  if (body.system) messages.push({ role: 'system', content: body.system });
  messages.push({ role: 'user', content: body.userMsg || '' });

  let apiPath, payload;
  if (useOpenAI) {
    apiPath = '/v1/chat/completions';
    payload = Buffer.from(JSON.stringify({ model, messages, stream: false, max_tokens: body.max_tokens || 600 }), 'utf8');
  } else {
    apiPath = '/api/chat';
    payload = Buffer.from(JSON.stringify({
      model, messages, stream: false, think: 'low',
      options: { num_predict: body.max_tokens || 280, num_ctx: 2048, keep_alive: '10m' },
    }), 'utf8');
  }

  const parsedUrl = new URL(baseUrl + apiPath);
  const headers   = { 'Content-Type': 'application/json', 'Content-Length': payload.length };
  if (authToken) headers['Authorization'] = 'Bearer ' + authToken;

  const transport = parsedUrl.protocol === 'https:' ? https : http;
  const req = transport.request({
    hostname: parsedUrl.hostname,
    port: parsedUrl.port || (parsedUrl.protocol === 'https:' ? 443 : 80),
    path: parsedUrl.pathname + (parsedUrl.search || ''),
    method: 'POST',
    headers,
  }, (up) => {
    const chunks = [];
    up.on('data', c => chunks.push(c));
    up.on('end', () => {
      try {
        const data = JSON.parse(Buffer.concat(chunks).toString());
        if (up.statusCode !== 200) {
          sendJSON(res, up.statusCode, { error: data.error?.message || data.message || JSON.stringify(data) });
          return;
        }
        // OpenAI-compatible: choices[0].message.content; Ollama: message.content
        const text = useOpenAI
          ? (data.choices?.[0]?.message?.content || '')
          : ((data.message || {}).content || '');
        sendJSON(res, 200, { text });
      } catch (e) {
        sendJSON(res, 500, { error: 'Parse error: ' + e.message });
      }
    });
  });
  req.on('error', e => sendJSON(res, 500, { error: e.message }));
  req.setTimeout(isLocal ? 300000 : 60000, () => { req.destroy(); sendJSON(res, 500, { error: 'timeout' }); });
  req.write(payload);
  req.end();
}

function handleOllamaStream(body, res) {
  const model     = body.model     || 'llama3.2:3b';
  const baseUrl   = body.baseUrl   || 'http://localhost:11434';
  const authToken = body.authToken || '';
  const isLocal   = baseUrl.includes('localhost') || baseUrl.includes('127.0.0.1');
  const useOpenAI = body.openaiCompat || !isLocal;

  const messages = [];
  if (body.system) messages.push({ role: 'system', content: body.system });
  messages.push({ role: 'user', content: body.userMsg || '' });

  let apiPath, payload;
  if (useOpenAI) {
    apiPath = '/v1/chat/completions';
    payload = Buffer.from(JSON.stringify({ model, messages, stream: true, max_tokens: body.max_tokens || 280 }), 'utf8');
  } else {
    apiPath = '/api/chat';
    payload = Buffer.from(JSON.stringify({
      model, messages, stream: true, think: 'low',
      options: { num_predict: body.max_tokens || 280, num_ctx: 2048, keep_alive: '10m' },
    }), 'utf8');
  }

  const parsedUrl = new URL(baseUrl + apiPath);
  const headers   = { 'Content-Type': 'application/json', 'Content-Length': payload.length };
  if (authToken) headers['Authorization'] = 'Bearer ' + authToken;

  res.writeHead(200, {
    'Content-Type':  'text/event-stream',
    'Cache-Control': 'no-cache',
    'Access-Control-Allow-Origin': '*',
  });

  const transport = parsedUrl.protocol === 'https:' ? https : http;
  const upstream = transport.request({
    hostname: parsedUrl.hostname,
    port:     parsedUrl.port || (parsedUrl.protocol === 'https:' ? 443 : 80),
    path:     parsedUrl.pathname + (parsedUrl.search || ''),
    method:   'POST',
    headers,
  }, (up) => {
    let buf = '';
    up.on('data', chunk => {
      buf += chunk.toString('utf8');
      const lines = buf.split('\n');
      buf = lines.pop();
      for (const line of lines) {
        if (!line.trim()) continue;
        try {
          if (useOpenAI) {
            const raw = line.startsWith('data: ') ? line.slice(6) : line;
            if (raw === '[DONE]') { res.write('data: [DONE]\n\n'); return; }
            const evt = JSON.parse(raw);
            const text = evt.choices?.[0]?.delta?.content || '';
            if (text) res.write(`data: ${JSON.stringify({ text })}\n\n`);
          } else {
            const evt = JSON.parse(line);
            const text = evt.message?.content || '';
            if (text) res.write(`data: ${JSON.stringify({ text })}\n\n`);
            if (evt.done) { res.write('data: [DONE]\n\n'); }
          }
        } catch (_) {}
      }
    });
    up.on('end',   () => { res.write('data: [DONE]\n\n'); res.end(); });
    up.on('error', () => res.end());
  });
  upstream.on('error', () => res.end());
  upstream.setTimeout(isLocal ? 300000 : 60000, () => { upstream.destroy(); res.end(); });
  upstream.write(payload);
  upstream.end();
}

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-api-key, anthropic-version');

  if (req.method === 'OPTIONS') { res.writeHead(200); res.end(); return; }

  if (req.method === 'GET' && !isDev) {
    const distDir  = path.join(__dirname, '../dist/renderer');
    const urlPath  = req.url.split('?')[0];
    let   filePath = path.join(distDir, urlPath === '/' ? 'index.html' : urlPath);
    // prevent path traversal
    if (!filePath.startsWith(distDir)) { res.writeHead(403); res.end(); return; }
    if (!fs.existsSync(filePath)) filePath = path.join(distDir, 'index.html');
    const ct = MIME[path.extname(filePath)] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': ct });
    fs.createReadStream(filePath).pipe(res);
    return;
  }

  if (req.method === 'POST') {
    const chunks = [];
    req.on('data', c => chunks.push(c));
    req.on('end', () => {
      let body;
      try { body = JSON.parse(Buffer.concat(chunks).toString()); }
      catch { sendJSON(res, 400, { error: 'bad json' }); return; }

      if (req.url === '/proxy')  { handleClaude(body, req.headers['x-api-key'] || '', res); return; }
      if (req.url === '/proxy-stream') { handleClaudeStream(body, req.headers['x-api-key'] || '', res); return; }
      if (req.url === '/ollama') { handleOllama(body, res); return; }
      if (req.url === '/ollama-stream') { handleOllamaStream(body, res); return; }
      if (req.url === '/open-mic-settings') {
        shell.openExternal('x-apple.systempreferences:com.apple.preference.security?Privacy_Microphone');
        sendJSON(res, 200, { ok: true }); return;
      }
      res.writeHead(404); res.end();
    });
    return;
  }

  res.writeHead(404); res.end();
});

// ─── Audiotee IPC ─────────────────────────────────────────────────────────────

let audioteeProcess = null;
let mainWindow = null;
const contentWindows = {}; // 'transcript' | 'assist' | 'checklist' | 'script' -> BrowserWindow
const CONTENT_VIEWS = ['transcript', 'assist', 'checklist', 'script'];
const LAYOUT_MODES = ['floating', 'column', 'eco'];
let layoutMode = 'floating';    // one of LAYOUT_MODES — mirrors the hub renderer's layoutMode
let viewsOpenInFloating = [];   // content windows to reopen when the hub returns to floating

function getAudioteeBinary() {
  if (app.isPackaged) {
    return path.join(process.resourcesPath, 'app.asar.unpacked/node_modules/audiotee/bin/audiotee');
  }
  return path.join(__dirname, '../node_modules/audiotee/bin/audiotee');
}

ipcMain.handle('request-screen-permission', async () => {
  if (process.platform !== 'darwin') return { granted: true };
  const status = systemPreferences.getMediaAccessStatus('screen');
  if (status === 'granted') return { granted: true };
  // Calling desktopCapturer.getSources() from the MAIN process attributes the
  // TCC Screen Recording entry to Wolf AI.app (our bundle ID), not the Electron
  // Framework — so System Settings shows "Wolf AI" not "Electron Helper".
  try { await desktopCapturer.getSources({ types: ['screen'] }); } catch (_) {}
  const newStatus = systemPreferences.getMediaAccessStatus('screen');
  if (newStatus !== 'granted') {
    shell.openExternal('x-apple.systempreferences:com.apple.preference.security?Privacy_ScreenCapture');
  }
  return { granted: newStatus === 'granted' };
});

ipcMain.handle('request-mic-permission', async () => {
  if (process.platform !== 'darwin') return { granted: true };
  const status = systemPreferences.getMediaAccessStatus('microphone');
  if (status === 'granted') return { granted: true };
  const granted = await systemPreferences.askForMediaAccess('microphone');
  return { granted };
});

ipcMain.handle('start-sys-audio', async () => {
  if (audioteeProcess) return { ok: false, error: 'Already running' };
  const bin = getAudioteeBinary();
  if (!fs.existsSync(bin)) return { ok: false, error: 'audiotee binary not found: ' + bin };
  try {
    audioteeProcess = spawn(bin, ['--sample-rate', '48000', '--chunk-duration', '0.04']);
    audioteeProcess.stdout.on('data', chunk => {
      if (mainWindow && !mainWindow.isDestroyed()) mainWindow.webContents.send('sys-audio-chunk', chunk);
    });
    audioteeProcess.stderr.on('data', d => {
      const text = d.toString('utf8');
      for (const line of text.split('\n').filter(l => l.trim())) {
        try {
          const msg = JSON.parse(line);
          if (msg.message_type === 'error') {
            const errMsg = (msg.data && msg.data.message) || JSON.stringify(msg.data);
            console.error('[audiotee] error:', errMsg);
            if (mainWindow && !mainWindow.isDestroyed()) mainWindow.webContents.send('sys-audio-error', errMsg);
          } else {
            console.log('[audiotee]', msg.message_type, msg.data || '');
          }
        } catch (_) {
          if (line.trim()) console.log('[audiotee]', line.trim());
        }
      }
    });
    audioteeProcess.on('error', err => {
      console.error('[audiotee] spawn error:', err.message);
      audioteeProcess = null;
      if (mainWindow && !mainWindow.isDestroyed()) mainWindow.webContents.send('sys-audio-error', err.message);
    });
    audioteeProcess.on('exit', (code) => {
      console.log('[audiotee] exit', code);
      audioteeProcess = null;
      if (code !== 0 && code !== null && mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send('sys-audio-error', `audiotee exited with code ${code}`);
      }
    });
    return { ok: true };
  } catch (e) {
    audioteeProcess = null;
    return { ok: false, error: e.message };
  }
});

ipcMain.handle('copy-to-clipboard', (_e, text) => {
  clipboard.writeText(text || '');
  return { ok: true };
});

// Where the user last put the hub's top-left corner. Every resize is laid out from
// here rather than from wherever an earlier resize had to nudge the window, so the hub
// goes back to its spot when it shrinks again (closing a menu, leaving Eco or Column).
let hubAnchor = null;
let hubPlacedAt = null;      // top-left of our own last setBounds
let hubSettledAfter = 0;     // its animation may still be moving the window until then

// If the hub is not where we last put it, the user has dragged it: that is the new anchor.
function getHubAnchor() {
  const [x, y] = mainWindow.getPosition();
  const settled = Date.now() > hubSettledAfter;
  if (!hubAnchor || !hubPlacedAt || (settled && (x !== hubPlacedAt.x || y !== hubPlacedAt.y))) {
    hubAnchor = { x, y };
    hubPlacedAt = { x, y };
  }
  return hubAnchor;
}

// Resize the hub window in place. Growing it must never let the window run off
// the bottom/right of the screen under the Dock/menu bar — keep the top-left
// corner fixed and only nudge the window back on-screen if it would.
function setHubSize(width, height) {
  const { x, y } = getHubAnchor();
  const work = screen.getDisplayNearestPoint({ x, y }).workArea;
  width  = Math.min(Math.round(width),  work.width);
  height = Math.min(Math.round(height), work.height);
  const newX = Math.min(x, work.x + work.width  - width);
  const newY = Math.min(y, work.y + work.height - height);

  hubPlacedAt = { x: Math.max(work.x, newX), y: Math.max(work.y, newY) };
  hubSettledAfter = Date.now() + 600;
  mainWindow.setBounds({ ...hubPlacedAt, width, height }, true);
}

ipcMain.handle('resize-window', (_e, { width, height }) => {
  if (!mainWindow || mainWindow.isDestroyed()) return;
  // In column mode the hub is user-sized; the pill's fit-to-menu resizes don't apply.
  if (layoutMode === 'column') return;
  setHubSize(width, height);
});

// Hub layout: 'floating' is the pill plus separate content windows; 'column' turns the
// hub itself into one resizable window holding every panel; 'eco' is one compact bar
// that the renderer keeps sized to its content through resize-window.
ipcMain.handle('set-layout-mode', (_e, mode) => {
  if (!mainWindow || mainWindow.isDestroyed()) return;
  if (!LAYOUT_MODES.includes(mode)) return;
  if (mode === layoutMode) return;
  const from = layoutMode;
  layoutMode = mode;

  // The separate content windows only belong to floating mode.
  if (from === 'floating') {
    viewsOpenInFloating = CONTENT_VIEWS.filter(v => contentWindows[v] && !contentWindows[v].isDestroyed());
    for (const view of viewsOpenInFloating) contentWindows[view].close();
  }

  if (mode === 'column') {
    const saved = loadAllBounds().column;
    const size = saved && Number.isFinite(saved.width) && Number.isFinite(saved.height) ? saved : COLUMN_DEFAULT_SIZE;
    mainWindow.setResizable(true);
    mainWindow.setMinimumSize(COLUMN_MIN_SIZE.width, COLUMN_MIN_SIZE.height);
    setHubSize(size.width, size.height);
  } else {
    const size = mode === 'eco' ? ECO_DEFAULT_SIZE : { width: PILL_W, height: PILL_H };
    mainWindow.setMinimumSize(0, 0);
    setHubSize(size.width, size.height);
    mainWindow.setResizable(false);
  }

  if (mode === 'floating') {
    saveBounds('pill', hubAnchor);
    for (const view of viewsOpenInFloating) createContentWindow(view);
    viewsOpenInFloating = [];
  }
});

ipcMain.handle('quit-app', () => { app.quit(); });

// Hub (pill) -> every open content window: live state snapshot.
ipcMain.on('broadcast-state', (_e, payload) => {
  for (const win of Object.values(contentWindows)) {
    if (win && !win.isDestroyed()) win.webContents.send('state', payload);
  }
});

// Content window -> hub: user action to execute (hub owns all real logic/state).
ipcMain.on('dispatch', (_e, action) => {
  if (mainWindow && !mainWindow.isDestroyed()) mainWindow.webContents.send('dispatch', action);
});

function sendOpenWindows() {
  if (!mainWindow || mainWindow.isDestroyed()) return;
  const open = {};
  for (const view of CONTENT_VIEWS) open[view] = !!(contentWindows[view] && !contentWindows[view].isDestroyed());
  mainWindow.webContents.send('open-windows', open);
}

ipcMain.handle('toggle-window', (_e, view) => {
  if (!CONTENT_VIEWS.includes(view)) return;
  const existing = contentWindows[view];
  if (existing && !existing.isDestroyed()) {
    existing.close();
  } else {
    createContentWindow(view);
  }
});

ipcMain.handle('stop-sys-audio', async () => {
  if (audioteeProcess) { audioteeProcess.kill('SIGTERM'); audioteeProcess = null; }
  return { ok: true };
});

ipcMain.handle('test-sys-audio', async () => {
  const bin = getAudioteeBinary();
  if (!fs.existsSync(bin)) return { error: 'binary not found: ' + bin };
  return new Promise(resolve => {
    const proc = spawn(bin, ['--sample-rate', '48000', '--chunk-duration', '0.04']);
    const chunks = [];
    proc.stdout.on('data', c => chunks.push(c));
    proc.stderr.on('data', d => console.log('[test-audiotee]', d.toString().trim()));
    setTimeout(() => {
      proc.kill('SIGTERM');
      const all = Buffer.concat(chunks);
      let nonZero = 0;
      for (let i = 0; i < all.length; i++) if (all[i] !== 0) nonZero++;
      resolve({ bytes: all.length, nonZero, pct: (nonZero / all.length * 100).toFixed(1) });
    }, 2000);
  });
});

// ─── Window ───────────────────────────────────────────────────────────────────

const PILL_W = 560, PILL_H = 60;
const COLUMN_DEFAULT_SIZE = { width: 400, height: 820 };
const COLUMN_MIN_SIZE     = { width: 360, height: 420 };
const ECO_DEFAULT_SIZE    = { width: 620, height: 180 }; // the renderer refits the height at once
const BOUNDS_FILE = path.join(app.getPath('userData'), 'window-bounds.json');

const DEFAULT_CONTENT_SIZE = {
  transcript: { width: 380, height: 480 },
  assist:     { width: 380, height: 560 },
  checklist:  { width: 340, height: 140 },
  script:     { width: 360, height: 480 },
};

function loadAllBounds() {
  try { return JSON.parse(fs.readFileSync(BOUNDS_FILE, 'utf8')) || {}; }
  catch (_) { return {}; }
}

function saveBounds(key, bounds) {
  const all = loadAllBounds();
  all[key] = bounds;
  try { fs.writeFileSync(BOUNDS_FILE, JSON.stringify(all)); } catch (_) {}
}

function getSavedBounds(key) {
  const b = loadAllBounds()[key];
  if (b && Number.isFinite(b.x) && Number.isFinite(b.y)) return b;
  return null;
}

function pageURL(view) {
  const base = isDev ? 'http://localhost:5173' : 'http://localhost:' + PORT;
  return view ? base + '?view=' + view : base;
}

function createWindow() {
  const savedPos = getSavedBounds('pill');
  mainWindow = new BrowserWindow({
    width: PILL_W,
    height: PILL_H,
    ...(savedPos ? { x: savedPos.x, y: savedPos.y } : {}),
    title: 'Wolf AI',
    frame: false,
    transparent: true,
    hasShadow: false,
    resizable: false,
    alwaysOnTop: true,
    backgroundColor: '#00000000',
    icon: path.join(__dirname, 'assets', 'icon.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  mainWindow.setMenuBarVisibility(false);
  mainWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  // Some combination of frame:false + transparent + alwaysOnTop makes macOS
  // default this window to kCGWindowSharingState "none," which silently hides
  // it from screenshots, screen recording, and remote-viewing tools even
  // though it renders fine on the physical display. Force sharing back on.
  mainWindow.setContentProtection(false);
  mainWindow.webContents.on('before-input-event', (e, input) => {
    if (input.meta && input.alt && input.key === 'I') mainWindow.webContents.openDevTools();
  });

  mainWindow.loadURL(pageURL());

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  // The pill remembers where it sits; the column remembers the size it was dragged to.
  // Kept under separate keys so a column parked at a screen edge never becomes the
  // launch position of the (wider) pill.
  let saveTimer = null;
  const scheduleSave = () => {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      if (!mainWindow || mainWindow.isDestroyed()) return;
      if (layoutMode === 'column') {
        saveBounds('column', mainWindow.getBounds());
      } else if (layoutMode === 'floating') {
        saveBounds('pill', getHubAnchor());
      }
    }, 300);
  };
  mainWindow.on('moved', scheduleSave);
  // 'resize', not 'resized': the latter only fires for some user-driven resizes on macOS,
  // and the debounce above already collapses the stream of events into one save.
  mainWindow.on('resize', scheduleSave);

  mainWindow.on('closed', () => { mainWindow = null; });
}

function createContentWindow(view) {
  const saved = getSavedBounds(view);
  let bounds;
  if (saved && Number.isFinite(saved.width) && Number.isFinite(saved.height)) {
    bounds = saved;
  } else {
    const [px, py] = mainWindow ? mainWindow.getPosition() : [100, 100];
    const idx = CONTENT_VIEWS.indexOf(view);
    bounds = { x: px + 20 * idx, y: py + 80 + 20 * idx, ...DEFAULT_CONTENT_SIZE[view] };
  }

  const win = new BrowserWindow({
    ...bounds,
    minWidth: 260,
    minHeight: 120,
    title: 'Wolf AI',
    frame: false,
    transparent: true,
    hasShadow: false,
    resizable: true,
    alwaysOnTop: true,
    backgroundColor: '#00000000',
    icon: path.join(__dirname, 'assets', 'icon.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  win.setMenuBarVisibility(false);
  win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  win.setContentProtection(false);
  win.loadURL(pageURL(view));
  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  let saveTimer = null;
  const scheduleSave = () => {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => { if (!win.isDestroyed()) saveBounds(view, win.getBounds()); }, 300);
  };
  win.on('moved', scheduleSave);
  win.on('resized', scheduleSave);

  win.on('closed', () => {
    delete contentWindows[view];
    sendOpenWindows();
  });

  contentWindows[view] = win;
  sendOpenWindows();
  return win;
}

app.whenReady().then(() => {
  // When the renderer calls getUserMedia, Chromium fires a 'media' permission request.
  // We intercept it here and call the macOS TCC dialog ourselves so the system prompt appears.
  session.defaultSession.setPermissionRequestHandler(async (wc, permission, cb, details) => {
    if (process.platform === 'darwin' &&
        (permission === 'media' || permission === 'microphone' || permission === 'audioCapture') &&
        details?.mediaTypes?.includes('audio')) {
      const status = systemPreferences.getMediaAccessStatus('microphone');
      if (status === 'granted') { cb(true); return; }
      try {
        const granted = await systemPreferences.askForMediaAccess('microphone');
        cb(granted);
        if (!granted) shell.openExternal('x-apple.systempreferences:com.apple.preference.security?Privacy_Microphone');
      } catch (e) {
        console.error('[mic-perm] askForMediaAccess error:', e.message);
        cb(false);
      }
      return;
    }
    const allowed = ['media', 'microphone', 'audioCapture', 'display-capture'];
    cb(allowed.includes(permission));
  });
  session.defaultSession.setPermissionCheckHandler((wc, permission) => {
    // For mic/media: only block when macOS has explicitly denied or restricted.
    // 'not-determined' must return true so Chromium fires the request handler,
    // which calls askForMediaAccess and shows the macOS permission dialog.
    if (process.platform === 'darwin' &&
        (permission === 'media' || permission === 'microphone' || permission === 'audioCapture')) {
      const status = systemPreferences.getMediaAccessStatus('microphone');
      return status !== 'denied' && status !== 'restricted';
    }
    return ['display-capture'].includes(permission);
  });

  server.listen(PORT, '127.0.0.1', createWindow);
  server.on('error', err => {
    if (err.code === 'EADDRINUSE') {
      console.error('Port', PORT, 'in use');
      app.quit();
    }
  });
});

app.on('window-all-closed', () => {
  if (audioteeProcess) { audioteeProcess.kill('SIGTERM'); audioteeProcess = null; }
  server.close();
  app.quit();
});

app.on('activate', () => { if (!mainWindow) createWindow(); });
