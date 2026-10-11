import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { CALL_SCRIPTS, LEAD_CONTEXT, FILLERS, buildSystemPrompt, buildCoachPrompt, buildAutoStyleHint, COACHING_CONFIG, BUYER_CLARIFYING, SELLER_CLARIFYING, BUYER_SCRIPT_KEYS, SELLER_SCRIPT_KEYS, STYLE_SCRIPTS } from './scripts.js';
import { IconMic, IconSparkle, IconCheck, IconClipboard, IconMore, IconGear, IconClose, IconWaveform, IconRefresh, IconSun, IconMoon, IconLayoutFloating, IconLayoutColumn } from './icons.jsx';
import { ColumnLayout } from './panels.jsx';

const PROXY  = 'http://localhost:8765/proxy';
const OLLAMA = 'http://localhost:8765/ollama';

// ── LPMAMA items ──────────────────────────────────────────────────────────────
const LPMAMA_ITEMS = [
  { key: 'L',  label: 'Location',    hint: 'Where are they looking?' },
  { key: 'P',  label: 'Price',       hint: 'Budget / affordability?' },
  { key: 'M',  label: 'Motivation',  hint: 'Why are they moving?' },
  { key: 'A',  label: 'Agent',       hint: 'Working with anyone?' },
  { key: 'Ma', label: 'Mortgage',    hint: 'Pre-approved?' },
  { key: 'Ap', label: 'Appointment', hint: 'Can we meet?' },
];

// Keyword cues used to auto-check an LPMAMA box once that topic comes up in the transcript.
const LPMAMA_PATTERNS = {
  L:  /\b(area|neighborhood|neighbourhood|part of town|zip ?code|which city|what city|where (are you|would you|you'?d) (looking|moving|move|move to))\b/i,
  P:  /\bprice range\b|\bbudget|\bhow much (were you|are you|would you)|\bafford|\bpre-?qualify(ing)? for|\bcomfortable spending\b|\bprice point\b|\$[\d,]{3,}/i,
  M:  /\bwhy (are you|the move|are we|you'?re) (moving|selling|buying)\b|\bmotivat|\brelocat|\breason (for|to) (mov|sell|buy)|\bwhat'?s (driving|prompting)|\btimeline for moving\b|\bwhy now\b/i,
  A:  /\b(working with (an|another) agent|already have an agent|don'?t have an agent|not working with (an|any) agent|signed (a|an) (buyer|listing) agreement|another realtor|represented by (an|another) agent)\b/i,
  Ma: /\b(pre-?approved|pre-?qualified|mortgage|lender|financing|paying cash|cash buyer|down payment|loan officer)\b/i,
  Ap: /\b(set up (a )?(time|showing|meeting)|schedule a (showing|time|meeting|call)|can we meet|meet (in person|up)|come (see|take a look|walk through)|showing (this|tomorrow|today|weekend))\b/i,
};

// ── Coaching style labels ────────────────────────────────────────────────────
const STYLE_LABELS = {
  nepq: 'NEPQ',
  reverse: 'Reverse Selling',
  straightline: 'Straight Line',
  condensed: 'Condensed',
};

// ── AudioMixer ────────────────────────────────────────────────────────────────
class AudioMixer {
  constructor(ctx) {
    this.ctx    = ctx;
    this.merger = ctx.createChannelMerger(2);
    this.dest   = ctx.createMediaStreamDestination();
    this.dest.channelCount = 2;
    this.merger.connect(this.dest);
    this._nodes = [];
  }
  _src(stream, ch) {
    const src  = this.ctx.createMediaStreamSource(stream);
    const gain = this.ctx.createGain();
    src.connect(gain);
    gain.connect(this.merger, 0, ch);
    this._nodes.push(src, gain);
  }
  addSys(stream) { this._src(stream, 0); }
  addMic(stream) { this._src(stream, 1); }
  getStream()    { return this.dest.stream; }
  close()        { this._nodes.forEach(n => { try { n.disconnect(); } catch(_) {} }); this.merger.disconnect(); }
}

// ── Response parser ───────────────────────────────────────────────────────────
function parseResponse(text) {
  const clean = text.replace(/\*\*([^*]+)\*\*/g, '$1').replace(/\*([^*]+)\*/g, '$1').replace(/__([^_]+)__/g, '$1');
  const lines = clean.split('\n');
  const sections = [];
  let cur = null;

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;

    const optMatch  = line.match(/^OPTION\s+(\d+)\s*(?:\[([^\]]+)\])?[:\s]*/i);
    const noteMatch = line.match(/^COACH\s+NOTE[:\s\-]/i);
    const ctxMatch  = line.match(/^(OBJECTION DETECTED|REFRAME CONTEXT|CALL STAGE|CLOSE STRATEGY)[:\s\-]/i);

    if (optMatch) {
      cur = { type: 'option', num: optMatch[1], tag: optMatch[2] || '', lines: [] };
      sections.push(cur);
      const rest = line.slice(optMatch[0].length).trim();
      if (rest) cur.lines.push(rest);
    } else if (noteMatch) {
      const idx  = line.search(/[:\-]/);
      const note = idx >= 0 ? line.slice(idx + 1).trim() : line;
      sections.push({ type: 'note', text: note });
      cur = null;
    } else if (ctxMatch) {
      const content = line.slice(ctxMatch[0].length).trim();
      sections.push({ type: 'context', text: content || line });
      cur = null;
    } else if (cur && cur.type === 'option') {
      cur.lines.push(line);
    }
  }

  if (sections.length === 0 && text.trim()) {
    sections.push({ type: 'raw', text: text.trim() });
  }

  return sections;
}

// ── Filler helper ─────────────────────────────────────────────────────────────
function randomFiller(mode) {
  const list = FILLERS[mode] || FILLERS.question;
  return list[Math.floor(Math.random() * list.length)];
}

// ── Auto-coach pacing ────────────────────────────────────────────────────────
// autoSpeed ranges -5 (turtle, slowest) .. 5 (rabbit, fastest), 0 is default —
// matches the original hardcoded 4000ms cooldown / 1500ms debounce at 0.
function autoCooldownMs(autoSpeed) { return 4000 - (autoSpeed || 0) * 500; }
function autoDebounceMs(autoSpeed) { return 1500 - (autoSpeed || 0) * 150; }

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {

  // ── State ──────────────────────────────────────────────────────────────────
  const [finalLines,    setFinalLines]    = useState([]);
  const [leadInterim,   setLeadInterim]   = useState('');
  const [agentInterim,  setAgentInterim]  = useState('');
  const [currentScript, setCurrentScript] = useState('');
  const [coachCards,    setCoachCards]    = useState([]);
  const [isListening,   setIsListening]   = useState(false);
  const [sysActive,     setSysActive]     = useState(false);
  const [dgStatus,      setDgStatus]      = useState('idle');
  const [elapsed,       setElapsed]       = useState('00:00');
  const [showSettings,  setShowSettings]  = useState(false);
  const [showMenu,      setShowMenu]      = useState(false);
  const [loadingMode,   setLoadingMode]   = useState(null);
  const [errorMsg,      setErrorMsg]      = useState('');
  const [micLevel,      setMicLevel]      = useState(0);
  const [sysLevel,      setSysLevel]      = useState(0);
  const [lpmamaChecked, setLpmamaChecked] = useState({ L: false, P: false, M: false, A: false, Ma: false, Ap: false });
  const [lpmamaCopied,  setLpmamaCopied]  = useState(false);
  const [coachStyle,    setCoachStyle]    = useState(null);
  const [promptMode,    setPromptMode]    = useState('full');
  const [autoMode,      setAutoMode]      = useState(false);
  const [theme,         setTheme]         = useState(() => localStorage.getItem('wolf_theme') || 'dark');
  const [openWindows,   setOpenWindows]   = useState({ transcript: false, assist: false, checklist: false, script: false });
  // 'floating' = pill + separate content windows; 'column' = everything in this one window.
  // Deliberately not persisted: the app always opens in floating.
  const [layoutMode,    setLayoutMode]    = useState('floating');
  const [columnSnapshot, setColumnSnapshot] = useState({});
  const [settings,      setSettings]      = useState(() => ({
    deepgramKey : localStorage.getItem('wolf_dg_key')       || '',
    claudeKey   : localStorage.getItem('wolf_claude_key')   || '',
    aiEngine    : localStorage.getItem('wolf_ai_engine')    || 'claude',
    ollamaUrl   : localStorage.getItem('wolf_ollama_url')   || 'http://localhost:11434',
    ollamaModel : localStorage.getItem('wolf_ollama_model') || '',
    ollamaToken : localStorage.getItem('wolf_ollama_token') || '',
    autoSpeed   : Number(localStorage.getItem('wolf_auto_speed')) || 0,
  }));

  // Condensed is a standalone style; Full defers to the NEPQ/Reverse/Straight Line pick.
  const effectiveStyle = promptMode === 'condensed' ? 'condensed' : coachStyle;

  // ── Refs ───────────────────────────────────────────────────────────────────
  const dgSocketRef     = useRef(null);
  const dgAudioCtxRef   = useRef(null);
  const dgProcessorRef  = useRef(null);
  const dgSourceRef     = useRef(null);
  const dgMixerRef      = useRef(null);
  const dgActiveRef     = useRef(false);
  const dgKeepAliveRef  = useRef(null);
  const dgLastFinalRef  = useRef('');
  const dgSysBufRef     = useRef([]);
  const micStreamRef    = useRef(null);
  const callStartRef    = useRef(null);
  const timerRef        = useRef(null);
  const rafRef          = useRef(null);
  const micLevelRawRef  = useRef(0);
  const sysLevelRawRef  = useRef(0);
  const transcriptEndRef= useRef(null);
  const finalLinesRef   = useRef([]);
  const settingsRef     = useRef(settings);
  const currentScriptRef= useRef('');
  const autoModeRef     = useRef(false);
  const loadingModeRef  = useRef(null);
  const autoTimerRef    = useRef(null);
  const lastAutoRef     = useRef(0);
  const layoutModeRef   = useRef('floating');

  useEffect(() => { settingsRef.current = settings; }, [settings]);
  useEffect(() => { currentScriptRef.current = currentScript; }, [currentScript]);
  useEffect(() => { finalLinesRef.current = finalLines; }, [finalLines]);
  useEffect(() => { autoModeRef.current = autoMode; }, [autoMode]);
  useEffect(() => { loadingModeRef.current = loadingMode; }, [loadingMode]);

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [finalLines, leadInterim, agentInterim]);

  // Auto-check LPMAMA boxes as those topics come up in the live transcript.
  useEffect(() => {
    if (SELLER_SCRIPT_KEYS.includes(currentScript)) return;
    if (!finalLines.length) return;
    const text = finalLines.map(l => l.text).join(' ');
    setLpmamaChecked(prev => {
      let changed = false;
      const next = { ...prev };
      for (const { key } of LPMAMA_ITEMS) {
        if (!next[key] && LPMAMA_PATTERNS[key].test(text)) { next[key] = true; changed = true; }
      }
      return changed ? next : prev;
    });
  }, [finalLines, currentScript]);

  useEffect(() => {
    if (!errorMsg) return;
    const t = setTimeout(() => setErrorMsg(''), 4000);
    return () => clearTimeout(t);
  }, [errorMsg]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('wolf_theme', theme);
  }, [theme]);

  // Tell main which shape this window should take. Runs on mount too, so a renderer
  // reload (which resets layoutMode to floating) pulls the OS window back with it.
  useEffect(() => {
    layoutModeRef.current = layoutMode;
    window.electronAPI?.setLayoutMode(layoutMode);
  }, [layoutMode]);

  // Grow/shrink the pill's own OS window to fit the Settings modal or the overflow menu.
  // In column mode the window is already large and user-sized, so both render in place.
  useEffect(() => {
    if (!window.electronAPI) return;
    if (layoutMode === 'column') return;
    const height = showSettings ? 640 : showMenu ? 224 : 60;
    window.electronAPI.resizeWindow({ width: 560, height });
  }, [showSettings, showMenu, layoutMode]);

  // Track which content windows main process currently has open, for the pill's toggle icons.
  useEffect(() => {
    if (!window.electronAPI) return;
    window.electronAPI.onOpenWindows(setOpenWindows);
  }, []);

  // Broadcast a state snapshot to any open content windows at a fixed 10Hz rate
  // (not reactively on every change — micLevel/sysLevel update ~60x/sec and would flood IPC).
  // The same snapshot also feeds the one-piece column layout, on the same 10Hz tick, so
  // its panels re-render at the rate the floating windows do rather than on every frame.
  // Memoized so an unchanged snapshot keeps its identity and the tick is then a no-op.
  const hubState = useMemo(() => ({
    theme, currentScript, effectiveStyle, coachStyle, promptMode,
    finalLines, leadInterim, agentInterim, isListening, sysActive, micLevel, sysLevel,
    coachCards, autoMode, loadingMode, lpmamaChecked, lpmamaCopied,
  }), [
    theme, currentScript, effectiveStyle, coachStyle, promptMode,
    finalLines, leadInterim, agentInterim, isListening, sysActive, micLevel, sysLevel,
    coachCards, autoMode, loadingMode, lpmamaChecked, lpmamaCopied,
  ]);
  const broadcastRef = useRef(hubState);
  useEffect(() => { broadcastRef.current = hubState; }, [hubState]);
  useEffect(() => {
    const id = setInterval(() => {
      window.electronAPI?.broadcastState(broadcastRef.current);
      if (layoutModeRef.current === 'column') setColumnSnapshot(broadcastRef.current);
    }, 100);
    return () => clearInterval(id);
  }, []);

  // Actions from the panels land here and call the real hub handlers, whether they
  // arrive over IPC from a floating content window or directly from the column layout.
  // Handlers are read from a ref (kept fresh every render) so runAction stays stable
  // and the IPC listener never needs to resubscribe, same pattern as the refs above.
  const actionHandlersRef = useRef(null);
  useEffect(() => {
    actionHandlersRef.current = {
      submitManual, setPromptMode, setCoachStyle, triggerCoach, triggerChat,
      toggleAutoMode: () => setAutoMode(v => !v),
      toggleLpmama: (key) => setLpmamaChecked(prev => ({ ...prev, [key]: !prev[key] })),
      copyLpmama,
    };
  });
  const runAction = useCallback((action) => {
    const h = actionHandlersRef.current;
    if (!h) return;
    switch (action.type) {
      case 'submitManual':   h.submitManual(action.text); break;
      case 'setPromptMode':  h.setPromptMode(action.value); break;
      case 'setCoachStyle':  h.setCoachStyle(action.value); break;
      case 'triggerCoach':   h.triggerCoach(action.mode); break;
      case 'triggerChat':    h.triggerChat(action.question); break;
      case 'toggleAutoMode': h.toggleAutoMode(); break;
      case 'toggleLpmama':   h.toggleLpmama(action.key); break;
      case 'copyLpmama':     h.copyLpmama(); break;
      default: break;
    }
  }, []);
  useEffect(() => {
    if (!window.electronAPI) return;
    window.electronAPI.onDispatch(runAction);
  }, [runAction]);

  const changeLayout = useCallback((mode) => {
    setColumnSnapshot(broadcastRef.current);
    setLayoutMode(mode);
    setShowMenu(false);
  }, []);

  useEffect(() => () => { stopDgSession(); stopMic(); stopSysAudioCapture(); stopTimer(); }, []);

  // ── Timer ──────────────────────────────────────────────────────────────────
  const startTimer = useCallback(() => {
    if (timerRef.current) return;
    callStartRef.current = Date.now();
    timerRef.current = setInterval(() => {
      const s  = Math.floor((Date.now() - callStartRef.current) / 1000);
      const mm = String(Math.floor(s / 60)).padStart(2, '0');
      const ss = String(s % 60).padStart(2, '0');
      setElapsed(`${mm}:${ss}`);
    }, 1000);
  }, []);

  const stopTimer = useCallback(() => {
    clearInterval(timerRef.current);
    timerRef.current = null;
  }, []);

  // ── Clear call (reset transcript/context/cards for a new call) ─────────────
  const clearCall = useCallback(() => {
    setFinalLines([]);
    setLeadInterim('');
    setAgentInterim('');
    setCoachCards([]);
    setLpmamaChecked({ L: false, P: false, M: false, A: false, Ma: false, Ap: false });
    setErrorMsg('');
    setElapsed('00:00');
    finalLinesRef.current = [];
    dgLastFinalRef.current = '';
    lastAutoRef.current = 0;
    stopTimer();
    callStartRef.current = null;
  }, [stopTimer]);

  // ── LPMAMA copy ──────────────────────────────────────────────────────────
  const copyLpmama = useCallback(async () => {
    const summary = 'LPMAMA - ' + LPMAMA_ITEMS.map(item =>
      `${item.label}: ${lpmamaChecked[item.key] ? 'Yes' : 'No'}`
    ).join(' | ');
    try {
      if (window.electronAPI) await window.electronAPI.copyToClipboard(summary);
      else await navigator.clipboard.writeText(summary);
      setLpmamaCopied(true);
      setTimeout(() => setLpmamaCopied(false), 1500);
    } catch {
      setErrorMsg('Could not copy to clipboard');
    }
  }, [lpmamaChecked]);

  // ── Transcript helpers ─────────────────────────────────────────────────────
  const addFinalLine = useCallback((text, speaker) => {
    const line = { id: Date.now() + Math.random(), text, speaker, ts: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) };
    setFinalLines(prev => [...prev, line]);
    if (!callStartRef.current) startTimer();
  }, [startTimer]);

  // ── Deepgram duplicate check ───────────────────────────────────────────────
  const isDuplicate = useCallback((text) => {
    const last = dgLastFinalRef.current;
    if (!last) return false;
    const a = last.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();
    const b = text.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();
    if (a === b) return true;
    const [shorter, longer] = a.length < b.length ? [a, b] : [b, a];
    return shorter.length > 8 && longer.includes(shorter);
  }, []);

  // ── Deepgram result handler ────────────────────────────────────────────────
  const handleDgResult = useCallback((msg, channels) => {
    const alt = msg.channel?.alternatives?.[0];
    if (!alt?.transcript || alt.transcript.trim().length < 2) return;
    const chIdx   = msg.channel_index?.[0] ?? 0;
    const isLead  = channels === 2 ? chIdx === 0 : false;
    const speaker = isLead ? 'lead' : 'agent';
    const isFinal = !!msg.is_final;
    const text    = alt.transcript.trim();

    if (isFinal) {
      if (isDuplicate(text)) return;
      dgLastFinalRef.current = text;
      if (isLead) setLeadInterim('');
      else        setAgentInterim('');
      addFinalLine(text, speaker);
    } else {
      if (isLead) setLeadInterim(text);
      else        setAgentInterim(text);
    }
  }, [isDuplicate, addFinalLine]);

  // ── Connect Deepgram WebSocket ─────────────────────────────────────────────
  const connectDeepgram = useCallback((sampleRate, channels, onResult) => {
    const { deepgramKey } = settingsRef.current;
    let p = `model=nova-2&encoding=linear16&sample_rate=${sampleRate}&language=en-US&punctuate=true&smart_format=true&interim_results=true&endpointing=300`;
    if (channels === 2) p += '&multichannel=true&channels=2';
    const ws = new WebSocket(`wss://api.deepgram.com/v1/listen?${p}`, ['token', deepgramKey]);
    ws.binaryType = 'arraybuffer';
    ws.onopen = () => {
      setDgStatus('live');
      dgKeepAliveRef.current = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify({ type: 'KeepAlive' }));
      }, 8000);
    };
    ws.onmessage = (ev) => {
      if (typeof ev.data !== 'string') return;
      try { const m = JSON.parse(ev.data); if (m.type === 'Results') onResult(m); } catch (_) {}
    };
    ws.onerror  = () => setDgStatus('error');
    ws.onclose  = () => {
      clearInterval(dgKeepAliveRef.current);
      dgKeepAliveRef.current = null;
      if (dgActiveRef.current) setDgStatus('error');
    };
    return ws;
  }, []);

  // ── Start Deepgram session ─────────────────────────────────────────────────
  const startDgSession = useCallback(async (micStream, sysMode) => {
    stopDgSession();
    const { deepgramKey } = settingsRef.current;
    if (!deepgramKey) { setErrorMsg('Add your Deepgram API key in Settings ⚙'); setShowSettings(true); return; }

    const usingAudiotee = sysMode === 'audiotee';
    const channels = sysMode ? 2 : 1;
    const audioCtx = new AudioContext({ sampleRate: 48000 });
    await audioCtx.resume();

    const ws = connectDeepgram(audioCtx.sampleRate, channels, (msg) => handleDgResult(msg, channels));
    setDgStatus('connecting');

    await audioCtx.audioWorklet.addModule('/audio-worklet.js');

    let src, workletNode;

    // No mic stream (sys-audio-only): drive the worklet with a silent source so
    // it still ticks and we can send the buffered system audio to Deepgram.
    const silentSource = () => {
      const s = audioCtx.createConstantSource();
      s.offset.value = 0;
      s.start();
      return s;
    };

    if (usingAudiotee) {
      src        = micStream ? audioCtx.createMediaStreamSource(micStream) : silentSource();
      workletNode = new AudioWorkletNode(audioCtx, 'wolf-capture', {
        channelCount: 1, channelCountMode: 'explicit', channelInterpretation: 'discrete',
      });
      workletNode.port.onmessage = ({ data: [mic] }) => {
        const len   = mic.length;
        const avail = Math.min(len, dgSysBufRef.current.length);
        let micRms = 0, sysRms = 0;
        for (let i = 0; i < len; i++) {
          micRms += mic[i] * mic[i];
          const l = i < avail ? dgSysBufRef.current[i] : 0;
          sysRms += l * l;
        }
        micLevelRawRef.current = Math.sqrt(micRms / len);
        if (avail > 0) sysLevelRawRef.current = Math.sqrt(sysRms / avail);
        if (!ws || ws.readyState !== WebSocket.OPEN) {
          if (avail > 0) dgSysBufRef.current.splice(0, avail);
          return;
        }
        const out = new Int16Array(len * 2);
        for (let i = 0; i < len; i++) {
          const l = i < avail ? dgSysBufRef.current[i] : 0;
          out[i * 2]     = Math.max(-32768, Math.min(32767, l * 32768));
          out[i * 2 + 1] = Math.max(-32768, Math.min(32767, mic[i] * 32768));
        }
        if (avail > 0) dgSysBufRef.current.splice(0, avail);
        ws.send(out.buffer);
      };
    } else if (sysMode) {
      const mixer = new AudioMixer(audioCtx);
      mixer.addSys(sysMode);
      if (micStream) mixer.addMic(micStream);
      dgMixerRef.current = mixer;
      src        = audioCtx.createMediaStreamSource(mixer.getStream());
      workletNode = new AudioWorkletNode(audioCtx, 'wolf-capture', {
        channelCount: 2, channelCountMode: 'explicit', channelInterpretation: 'discrete',
      });
      workletNode.port.onmessage = ({ data: [sysCh, micCh] }) => {
        const len = sysCh.length;
        let sysRms = 0, micRms = 0;
        for (let i = 0; i < len; i++) {
          sysRms += sysCh[i] * sysCh[i]; micRms += micCh[i] * micCh[i];
        }
        sysLevelRawRef.current = Math.sqrt(sysRms / len);
        micLevelRawRef.current = Math.sqrt(micRms / len);
        if (!ws || ws.readyState !== WebSocket.OPEN) return;
        const out = new Int16Array(len * 2);
        for (let i = 0; i < len; i++) {
          out[i * 2]     = Math.max(-32768, Math.min(32767, sysCh[i] * 32768));
          out[i * 2 + 1] = Math.max(-32768, Math.min(32767, micCh[i] * 32768));
        }
        ws.send(out.buffer);
      };
    } else {
      src        = audioCtx.createMediaStreamSource(micStream);
      workletNode = new AudioWorkletNode(audioCtx, 'wolf-capture', {
        channelCount: 1, channelCountMode: 'explicit', channelInterpretation: 'discrete',
      });
      workletNode.port.onmessage = ({ data: [sCh] }) => {
        let rms = 0;
        for (let i = 0; i < sCh.length; i++) rms += sCh[i] * sCh[i];
        micLevelRawRef.current = Math.sqrt(rms / sCh.length);
        if (!ws || ws.readyState !== WebSocket.OPEN) return;
        const out = new Int16Array(sCh.length);
        for (let i = 0; i < sCh.length; i++) out[i] = Math.max(-32768, Math.min(32767, sCh[i] * 32768));
        ws.send(out.buffer);
      };
    }

    src.connect(workletNode);
    workletNode.connect(audioCtx.destination);
    dgAudioCtxRef.current  = audioCtx;
    dgProcessorRef.current = workletNode;
    dgSourceRef.current    = src;
    dgSocketRef.current    = ws;
    dgActiveRef.current    = true;

    cancelAnimationFrame(rafRef.current);
    let smoothMic = 0, smoothSys = 0;
    const tick = () => {
      smoothMic = smoothMic * 0.75 + micLevelRawRef.current * 0.25;
      smoothSys = smoothSys * 0.75 + sysLevelRawRef.current * 0.25;
      setMicLevel(Math.min(1, smoothMic * 6));
      setSysLevel(Math.min(1, smoothSys * 6));
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [connectDeepgram, handleDgResult]);

  // ── Stop Deepgram session ──────────────────────────────────────────────────
  const stopDgSession = useCallback(() => {
    dgActiveRef.current = false;
    clearInterval(dgKeepAliveRef.current); dgKeepAliveRef.current = null;
    cancelAnimationFrame(rafRef.current);  rafRef.current = null;
    micLevelRawRef.current = 0;
    sysLevelRawRef.current = 0;
    dgLastFinalRef.current = '';
    dgSysBufRef.current    = [];
    try { dgSocketRef.current?.close();        } catch (_) {} dgSocketRef.current    = null;
    try { dgProcessorRef.current?.disconnect(); } catch (_) {} dgProcessorRef.current = null;
    try { dgSourceRef.current?.disconnect();    } catch (_) {} dgSourceRef.current    = null;
    dgMixerRef.current?.close(); dgMixerRef.current = null;
    try { dgAudioCtxRef.current?.close();      } catch (_) {} dgAudioCtxRef.current  = null;
    setDgStatus('idle');
    setLeadInterim(''); setAgentInterim('');
    setMicLevel(0); setSysLevel(0);
  }, []);

  // ── Mic ────────────────────────────────────────────────────────────────────
  const startMic = useCallback(async () => {
    try {
      // Ask macOS for mic access from the main process first — this is what registers
      // the app in System Settings → Privacy & Security → Microphone and shows the dialog.
      if (window.electronAPI) {
        const { granted } = await window.electronAPI.requestMicPermission();
        if (!granted) {
          setErrorMsg('Microphone access denied — enable it in System Settings → Privacy & Security → Microphone');
          fetch('http://localhost:8765/open-mic-settings', { method: 'POST' }).catch(() => {});
          return;
        }
      }
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      micStreamRef.current = stream;
      setIsListening(true);
      if (!callStartRef.current) startTimer();
      const sysMode = sysActive ? (window.electronAPI ? 'audiotee' : null) : null;
      await startDgSession(stream, sysMode);
    } catch (err) {
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setErrorMsg('Microphone access denied — enable it in System Settings → Privacy & Security → Microphone');
        fetch('http://localhost:8765/open-mic-settings', { method: 'POST' }).catch(() => {});
      } else {
        setErrorMsg('Mic error: ' + err.message);
      }
    }
  }, [sysActive, startTimer, startDgSession]);

  const stopMic = useCallback(() => {
    setIsListening(false);
    micStreamRef.current?.getTracks().forEach(t => t.stop());
    micStreamRef.current = null;
    stopDgSession();
  }, [stopDgSession]);

  const toggleMic = useCallback(() => {
    if (isListening) stopMic(); else startMic();
  }, [isListening, startMic, stopMic]);

  // ── System audio ───────────────────────────────────────────────────────────
  const startSysAudioCapture = useCallback(async () => {
    if (!window.electronAPI) { setErrorMsg('System audio requires the desktop app.'); return; }
    try {
      const permResult = await window.electronAPI.requestScreenPermission();
      if (!permResult.granted) {
        setErrorMsg('Screen Recording denied — enable Wolf AI in System Settings → Privacy & Security → Screen Recording, then try again.');
        return;
      }
      const result = await window.electronAPI.startSysAudio();
      if (!result.ok) { setErrorMsg('System audio error: ' + result.error); return; }

      window.electronAPI.onSysAudioChunk((chunk) => {
        const u8   = new Uint8Array(chunk);
        const view = new Int16Array(u8.buffer, u8.byteOffset, Math.floor(u8.byteLength / 2));
        const f32  = new Float32Array(view.length);
        for (let i = 0; i < view.length; i++) f32[i] = view[i] / 32768;
        dgSysBufRef.current.push(...f32);
        if (dgSysBufRef.current.length > 96000) dgSysBufRef.current.splice(0, dgSysBufRef.current.length - 96000);
      });
      window.electronAPI.onSysAudioError((msg) => {
        setErrorMsg('System audio error: ' + msg);
        setSysActive(false);
      });

      setSysActive(true);
      await startDgSession(micStreamRef.current || null, 'audiotee');
    } catch (err) {
      setErrorMsg('System audio error: ' + err.message);
    }
  }, [stopDgSession, startDgSession]);

  const stopSysAudioCapture = useCallback(() => {
    setSysActive(false);
    dgSysBufRef.current = [];
    if (window.electronAPI) {
      window.electronAPI.stopSysAudio();
      window.electronAPI.removeSysAudioListeners();
    }
    if (micStreamRef._sysStream) {
      micStreamRef._sysStream.getTracks().forEach(t => t.stop());
      micStreamRef._sysStream = null;
    }
    if (micStreamRef.current) { stopDgSession(); startDgSession(micStreamRef.current, null); }
    else { stopDgSession(); }
  }, [stopDgSession, startDgSession]);

  const toggleSys = useCallback(() => {
    if (sysActive) stopSysAudioCapture(); else startSysAudioCapture();
  }, [sysActive, startSysAudioCapture, stopSysAudioCapture]);

  // ── AI call ────────────────────────────────────────────────────────────────
  const callAI = useCallback(async (system, user, maxTokens = 280) => {
    const { aiEngine, claudeKey, ollamaUrl, ollamaModel, ollamaToken } = settingsRef.current;
    if (aiEngine === 'claude') {
      const res  = await fetch(PROXY, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': claudeKey },
        body: JSON.stringify({ model: 'claude-haiku-4-5-20251001', max_tokens: maxTokens, system, messages: [{ role: 'user', content: user }] }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || 'Claude error ' + res.status);
      return data.content[0].text;
    } else {
      const isLocal      = ollamaUrl.includes('localhost') || ollamaUrl.includes('127.0.0.1');
      const openaiCompat = !isLocal;
      const res  = await fetch(OLLAMA, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: ollamaModel, system, userMsg: user, baseUrl: ollamaUrl, authToken: ollamaToken, openaiCompat, max_tokens: maxTokens }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Ollama error ' + res.status);
      return data.text;
    }
  }, []);

  const callAIStream = useCallback(async (system, user, maxTokens, onChunk) => {
    const { aiEngine, claudeKey, ollamaUrl, ollamaModel, ollamaToken } = settingsRef.current;
    const isLocal = ollamaUrl.includes('localhost') || ollamaUrl.includes('127.0.0.1');
    const url = aiEngine === 'claude' ? 'http://localhost:8765/proxy-stream' : 'http://localhost:8765/ollama-stream';
    const body = aiEngine === 'claude'
      ? { model: 'claude-haiku-4-5-20251001', max_tokens: maxTokens, system, messages: [{ role: 'user', content: user }] }
      : { model: ollamaModel, system, userMsg: user, baseUrl: ollamaUrl, authToken: ollamaToken, openaiCompat: !isLocal, max_tokens: maxTokens };
    const headers = { 'Content-Type': 'application/json' };
    if (aiEngine === 'claude') headers['x-api-key'] = claudeKey;

    const res = await fetch(url, { method: 'POST', headers, body: JSON.stringify(body) });
    if (!res.ok) throw new Error('Stream request failed: ' + res.status);
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let full = '';
    let buf = '';
    let streamError = null;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += decoder.decode(value, { stream: true });
      const lines = buf.split('\n');
      buf = lines.pop();
      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;
        const payload = line.slice(6);
        if (payload === '[DONE]') continue;
        let evt;
        try { evt = JSON.parse(payload); } catch (_) { continue; }
        if (evt.error) { streamError = evt.error; continue; }
        if (evt.text) { full += evt.text; onChunk(full); }
      }
    }
    if (streamError) throw new Error(streamError);
    return full;
  }, []);

  // ── Get transcript context ─────────────────────────────────────────────────
  const getLastLines = useCallback(() => {
    return finalLinesRef.current.slice(-6).map(l => (l.speaker === 'lead' ? 'Lead: ' : 'Agent: ') + l.text).join('\n');
  }, []);

  // ── Trigger coaching ───────────────────────────────────────────────────────
  const triggerCoach = useCallback(async (mode, isAuto = false) => {
    const { aiEngine, claudeKey } = settingsRef.current;
    if (aiEngine === 'claude' && !claudeKey) { setErrorMsg('Add your Claude API key in Settings ⚙'); setShowSettings(true); return; }

    const leadCtx  = LEAD_CONTEXT[currentScriptRef.current] || LEAD_CONTEXT[''];
    const lastLines = getLastLines();
    const system   = buildSystemPrompt(aiEngine);
    const scriptKey = currentScriptRef.current;
    const clarifyingList = promptMode === 'full' && coachStyle === 'nepq' && mode === 'question'
      ? (BUYER_SCRIPT_KEYS.includes(scriptKey) ? BUYER_CLARIFYING : SELLER_SCRIPT_KEYS.includes(scriptKey) ? SELLER_CLARIFYING : [...BUYER_CLARIFYING, ...SELLER_CLARIFYING])
      : null;
    const user     = buildCoachPrompt(mode, lastLines, leadCtx, effectiveStyle, clarifyingList);
    const filler   = randomFiller(mode);
    const time     = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const cardId = Date.now();
    setCoachCards(prev => [{ id: cardId, mode, time, status: 'streaming', filler, sections: [], streamText: '', auto: isAuto }, ...prev]);
    setLoadingMode(mode);

    try {
      const text = await callAIStream(system, user, 450, (partial) => {
        setCoachCards(prev => prev.map(c => c.id === cardId ? { ...c, streamText: partial } : c));
      });
      const sections = parseResponse(text);
      setCoachCards(prev => prev.map(c => c.id === cardId ? { ...c, status: 'done', sections, streamText: '' } : c));
    } catch (err) {
      setCoachCards(prev => prev.map(c => c.id === cardId ? { ...c, status: 'error', error: err.message } : c));
    } finally {
      setLoadingMode(null);
    }
  }, [callAIStream, getLastLines, coachStyle, promptMode, effectiveStyle]);

  // ── Auto coaching (single call: classify + respond) ───────────────────────
  const triggerAutoCoach = useCallback(async () => {
    if (loadingModeRef.current || Date.now() - lastAutoRef.current < autoCooldownMs(settingsRef.current.autoSpeed) || !autoModeRef.current) return;
    const lines = finalLinesRef.current.slice(-4).map(l => (l.speaker === 'lead' ? 'Lead: ' : 'Agent: ') + l.text).join('\n');
    if (!lines) return;
    const leadCtx = LEAD_CONTEXT[currentScriptRef.current] || LEAD_CONTEXT[''];
    const { aiEngine } = settingsRef.current;
    const system = buildSystemPrompt(aiEngine);
    const styleHint = buildAutoStyleHint(effectiveStyle);
    const user = `Lead context: ${leadCtx}\n\nRecent transcript:\n${lines}\n\nFirst, output exactly one word on its own line: objection | question | threea | none\nThen, if that word is NOT "none", immediately output the full coaching response in the standard format.${styleHint ? ' ' + styleHint : ''}`;
    const cardId = Date.now();
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    try {
      const text = await callAI(system, user, 300);
      const firstLine = text.trim().split('\n')[0].toLowerCase().replace(/[^a-z]/g, '');
      if (!['objection', 'question', 'threea'].includes(firstLine) || !autoModeRef.current || loadingModeRef.current) return;
      const rest = text.trim().split('\n').slice(1).join('\n').trim();
      if (!rest) return;
      lastAutoRef.current = Date.now();
      const sections = parseResponse(rest);
      setCoachCards(prev => [{ id: cardId, mode: firstLine, time, status: 'done', sections, auto: true }, ...prev]);
    } catch { /* ignore */ }
  }, [callAI, effectiveStyle]);

  useEffect(() => {
    if (!autoMode) { clearTimeout(autoTimerRef.current); return; }
    const last = finalLines[finalLines.length - 1];
    if (!last || last.speaker !== 'lead') return;
    clearTimeout(autoTimerRef.current);
    autoTimerRef.current = setTimeout(triggerAutoCoach, autoDebounceMs(settingsRef.current.autoSpeed));
    return () => clearTimeout(autoTimerRef.current);
  }, [finalLines, autoMode, triggerAutoCoach]);

  // ── Chat Q&A ───────────────────────────────────────────────────────────────
  const triggerChat = useCallback(async (question) => {
    if (!question.trim()) return;
    const { aiEngine, claudeKey } = settingsRef.current;
    if (aiEngine === 'claude' && !claudeKey) { setErrorMsg('Add your Claude API key in Settings ⚙'); return; }
    const transcript = finalLinesRef.current.slice(-20).map(l => `${l.speaker === 'lead' ? 'Lead' : 'You'}: ${l.text}`).join('\n');
    const leadCtx = LEAD_CONTEXT[currentScriptRef.current] || LEAD_CONTEXT[''];
    const system  = buildSystemPrompt(aiEngine);
    const user    = `CALL TRANSCRIPT:\n${transcript || '(no transcript yet)'}\n\nLEAD CONTEXT: ${leadCtx}\n\nAGENT QUESTION: ${question}`;
    const cardId  = Date.now();
    const time    = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setCoachCards(prev => [{ id: cardId, mode: 'question-chat', time, status: 'loading', filler: 'Thinking...', sections: [] }, ...prev]);
    try {
      const text     = await callAI(system, user, 400);
      const sections = parseResponse(text);
      setCoachCards(prev => prev.map(c => c.id === cardId ? { ...c, status: 'done', sections } : c));
    } catch (err) {
      setCoachCards(prev => prev.map(c => c.id === cardId ? { ...c, status: 'error', error: err.message } : c));
    }
  }, [callAI]);

  // ── Manual transcript add ──────────────────────────────────────────────────
  const submitManual = useCallback((text) => {
    const t = (text || '').trim();
    if (!t) return;
    addFinalLine(t, 'lead');
  }, [addFinalLine]);

  // ── Save settings ──────────────────────────────────────────────────────────
  const saveSettings = useCallback((newSettings) => {
    setSettings(newSettings);
    localStorage.setItem('wolf_dg_key',       newSettings.deepgramKey);
    localStorage.setItem('wolf_claude_key',   newSettings.claudeKey);
    localStorage.setItem('wolf_ai_engine',    newSettings.aiEngine);
    localStorage.setItem('wolf_ollama_url',   newSettings.ollamaUrl);
    localStorage.setItem('wolf_ollama_model', newSettings.ollamaModel);
    localStorage.setItem('wolf_ollama_token', newSettings.ollamaToken);
    localStorage.setItem('wolf_auto_speed',   newSettings.autoSpeed);
    setShowSettings(false);
  }, []);

  // ── Derived ────────────────────────────────────────────────────────────────
  const script = CALL_SCRIPTS[currentScript];
  const activeStyleScript = effectiveStyle && currentScript ? STYLE_SCRIPTS[effectiveStyle]?.[currentScript] : null;

  const clarifyingQuestions = !activeStyleScript && BUYER_SCRIPT_KEYS.includes(currentScript)
    ? { label: 'Buyer Clarifying Questions', items: BUYER_CLARIFYING }
    : SELLER_SCRIPT_KEYS.includes(currentScript)
    ? { label: 'Seller Clarifying Questions', items: SELLER_CLARIFYING }
    : null;

  // ── Render ─────────────────────────────────────────────────────────────────
  const pillBar = (
    <PillBar
      currentScript={currentScript}
      onScriptChange={v => { setCurrentScript(v); setAutoMode(false); }}
      isListening={isListening}
      toggleMic={toggleMic}
      sysActive={sysActive}
      toggleSys={toggleSys}
      elapsed={elapsed}
      running={!!callStartRef.current}
      clearCall={clearCall}
      openWindows={openWindows}
      onToggleWindow={view => window.electronAPI?.toggleWindow(view)}
      theme={theme}
      setTheme={setTheme}
      setShowSettings={setShowSettings}
      showMenu={showMenu}
      setShowMenu={setShowMenu}
      layoutMode={layoutMode}
      onLayoutChange={changeLayout}
    />
  );

  return (
    <div className={`app${layoutMode === 'column' ? ' layout-column' : ''}`}>
      {layoutMode === 'column' ? (
        <div className="column-shell">
          {pillBar}
          <ColumnLayout state={columnSnapshot} dispatch={runAction} />
        </div>
      ) : pillBar}


      {/* Settings modal */}
      {showSettings && (
        <SettingsModal settings={settings} onSave={saveSettings} onClose={() => setShowSettings(false)} />
      )}

      {/* Error toast */}
      {errorMsg && <div className="error-toast">{errorMsg}</div>}

    </div>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────────

// Shared with src/ContentWindow.jsx's VIEW_META (small, duplicated deliberately —
// each window is a separate renderer bundle, not worth cross-importing 4 entries).
const WINDOW_TOGGLES = [
  { key: 'transcript', label: 'Transcript', icon: IconMic,       accent: '#60a5fa', accentDim: 'rgba(96,165,250,0.14)' },
  { key: 'assist',     label: 'Assist',     icon: IconSparkle,   accent: 'var(--purple)', accentDim: 'var(--purple-dim)' },
  { key: 'checklist',  label: 'Checklist',  icon: IconCheck,     accent: 'var(--green)',  accentDim: 'var(--green-dim)'  },
  { key: 'script',     label: 'Script',     icon: IconClipboard, accent: 'var(--blue)',   accentDim: 'var(--blue-dim)'   },
];

const LAYOUT_MODES = [
  { key: 'floating', label: 'Floating', icon: IconLayoutFloating, title: 'Pill with separate floating windows' },
  { key: 'column',   label: 'Column',   icon: IconLayoutColumn,   title: 'Everything in one window' },
];

function PillBar({
  currentScript, onScriptChange,
  isListening, toggleMic, sysActive, toggleSys,
  elapsed, running,
  clearCall, openWindows, onToggleWindow, theme, setTheme, setShowSettings,
  showMenu, setShowMenu, layoutMode, onLayoutChange,
}) {
  const menuRef       = useRef(null);
  const menuToggleRef = useRef(null);

  useEffect(() => {
    if (!showMenu) return;
    const onClick = e => {
      if (menuRef.current?.contains(e.target)) return;
      if (menuToggleRef.current?.contains(e.target)) return;
      setShowMenu(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [showMenu, setShowMenu]);

  return (
    <div className="pill-wrap">
      <div className="pill-bar">
        <span className="pill-drag" title="Drag to move">⠿</span>
        <select
          className="pill-select"
          value={currentScript}
          onChange={e => onScriptChange(e.target.value)}
          title="Lead type"
        >
          <option value="">Select Lead Type</option>
          {Object.entries(CALL_SCRIPTS).map(([k, v]) => (
            <option key={k} value={k}>{v.label}</option>
          ))}
        </select>
        <div className="pill-spacer" />
        {(isListening || sysActive) && (
          <span className={`pill-timer${running ? ' running' : ''}`}>{elapsed}</span>
        )}
        <button
          className={`pill-icon-btn${isListening ? ' active' : ''}`}
          onClick={toggleMic}
          title={isListening ? 'Stop mic' : 'Start mic'}
        >
          <IconMic size={14} />
        </button>
        <button
          ref={menuToggleRef}
          className={`pill-icon-btn${showMenu ? ' active' : ''}`}
          onClick={() => setShowMenu(v => !v)}
          title="More"
        >
          <IconMore size={14} />
        </button>
        <button className="pill-icon-btn" onClick={() => setShowSettings(true)} title="Settings">
          <IconGear size={14} />
        </button>
        <button
          className="pill-icon-btn close"
          onClick={() => window.electronAPI ? window.electronAPI.quitApp() : window.close()}
          title="Quit"
        >
          <IconClose size={14} />
        </button>
      </div>

      {showMenu && (
        <div className="pill-overflow-menu" ref={menuRef}>
          <div className="pill-overflow-row">
            <button
              className={`pill-overflow-chip sys${sysActive ? ' active' : ''}`}
              onClick={toggleSys}
              title={sysActive ? 'Stop system audio' : 'Start system audio'}
            >
              <IconWaveform size={15} />
              <span className="pill-overflow-chip-label">System audio</span>
            </button>
            <button
              className="pill-overflow-chip"
              onClick={clearCall}
              title="Clear transcript, coaching cards, and call context to start a new call"
            >
              <IconRefresh size={15} />
              <span className="pill-overflow-chip-label">Clear call</span>
            </button>
            <button
              className="pill-overflow-chip"
              onClick={() => setTheme(th => th === 'dark' ? 'light' : 'dark')}
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <IconSun size={15} /> : <IconMoon size={15} />}
              <span className="pill-overflow-chip-label">Theme</span>
            </button>
          </div>
          {/* Window toggles only apply to floating mode; in column every panel is already here. */}
          {layoutMode !== 'column' && (
            <div className="pill-overflow-row">
              {WINDOW_TOGGLES.map(t => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.key}
                    className={`pill-overflow-chip${openWindows?.[t.key] ? ' active' : ''}`}
                    onClick={() => onToggleWindow(t.key)}
                    title={`${openWindows?.[t.key] ? 'Close' : 'Open'} ${t.label}`}
                  >
                    <Icon size={15} />
                    <span className="pill-overflow-chip-label">{t.label}</span>
                  </button>
                );
              })}
            </div>
          )}
          <div className="pill-overflow-row">
            {LAYOUT_MODES.map(m => {
              const Icon = m.icon;
              return (
                <button
                  key={m.key}
                  className={`pill-overflow-chip${layoutMode === m.key ? ' active' : ''}`}
                  onClick={() => onLayoutChange(m.key)}
                  title={m.title}
                >
                  <Icon size={15} />
                  <span className="pill-overflow-chip-label">{m.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function SettingsModal({ settings, onSave, onClose }) {
  const [form, setForm] = useState(settings);
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <span className="modal-title">⚙ Settings</span>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="settings-group">
            <div className="settings-label">Deepgram API Key</div>
            <input className="settings-input" type="password" placeholder="Your Deepgram key…" value={form.deepgramKey} onChange={e => set('deepgramKey', e.target.value)} />
          </div>
          <div className="settings-group">
            <div className="settings-label">AI Engine</div>
            <select className="settings-select" value={form.aiEngine} onChange={e => set('aiEngine', e.target.value)}>
              <option value="claude">Claude (Anthropic)</option>
              <option value="ollama">Ollama (Local / Cloud)</option>
            </select>
          </div>
          {form.aiEngine === 'claude' && (
            <div className="settings-group">
              <div className="settings-label">Claude API Key</div>
              <input className="settings-input" type="password" placeholder="sk-ant-…" value={form.claudeKey} onChange={e => set('claudeKey', e.target.value)} />
            </div>
          )}
          {form.aiEngine === 'ollama' && <>
            <div className="settings-group">
              <div className="settings-label">Model name</div>
              <input
                className="settings-input"
                list="ollama-models"
                placeholder="e.g. llama3.2:3b"
                value={form.ollamaModel}
                onChange={e => set('ollamaModel', e.target.value)}
              />
              <datalist id="ollama-models">
                <option value="llama3.2:3b" />
                <option value="llama3.1:8b-instruct-q4_K_M" />
                <option value="qwen2.5:7b" />
                <option value="qwen2.5:14b" />
                <option value="qwen3:8b" />
                <option value="nemotron-mini" />
                <option value="nemotron-mini:4b-instruct-q4_K_M" />
                <option value="mistral:7b" />
                <option value="gemma3:12b" />
              </datalist>
              <div className="settings-hint">Type any model name you have pulled in Ollama</div>
            </div>
            <div className="settings-group">
              <div className="settings-label">Ollama URL</div>
              <input className="settings-input" placeholder="http://localhost:11434" value={form.ollamaUrl} onChange={e => set('ollamaUrl', e.target.value)} />
            </div>
            <div className="settings-group">
              <div className="settings-label">Auth Token (remote Ollama only)</div>
              <input className="settings-input" type="password" placeholder="Leave blank for local Ollama" value={form.ollamaToken} onChange={e => set('ollamaToken', e.target.value)} />
            </div>
          </>}
          <div className="settings-group">
            <div className="settings-label">Auto response speed</div>
            <div className="speed-slider-row">
              <span className="speed-slider-icon" title="Slower">🐢</span>
              <div className="speed-slider-track">
                <input
                  className="speed-slider"
                  type="range"
                  min={-5}
                  max={5}
                  step={1}
                  value={form.autoSpeed ?? 0}
                  onChange={e => set('autoSpeed', Number(e.target.value))}
                  title="How quickly Auto mode cycles new coaching responses"
                />
                <span className="speed-slider-default-dot" />
              </div>
              <span className="speed-slider-icon" title="Faster">🐇</span>
            </div>
            <div className="settings-hint">
              {(form.autoSpeed ?? 0) === 0
                ? 'Default pace'
                : (form.autoSpeed ?? 0) < 0
                  ? `Slower — level ${form.autoSpeed}`
                  : `Faster — level +${form.autoSpeed}`}
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button className="btn-save" onClick={() => onSave(form)}>Save</button>
        </div>
      </div>
    </div>
  );
}
