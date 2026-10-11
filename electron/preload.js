const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  requestMicPermission:    () => ipcRenderer.invoke('request-mic-permission'),
  requestScreenPermission: () => ipcRenderer.invoke('request-screen-permission'),
  startSysAudio: () => ipcRenderer.invoke('start-sys-audio'),
  stopSysAudio:  () => ipcRenderer.invoke('stop-sys-audio'),
  onSysAudioChunk: (cb) => ipcRenderer.on('sys-audio-chunk', (_e, chunk) => cb(chunk)),
  onSysAudioError: (cb) => ipcRenderer.on('sys-audio-error', (_e, msg)   => cb(msg)),
  testSysAudio: () => ipcRenderer.invoke('test-sys-audio'),
  resizeWindow: (opts) => ipcRenderer.invoke('resize-window', opts),
  copyToClipboard: (text) => ipcRenderer.invoke('copy-to-clipboard', text),
  quitApp: () => ipcRenderer.invoke('quit-app'),
  removeSysAudioListeners: () => {
    ipcRenderer.removeAllListeners('sys-audio-chunk');
    ipcRenderer.removeAllListeners('sys-audio-error');
  },

  // ── Multi-window hub <-> content-window sync ──────────────────────────────
  broadcastState: (payload) => ipcRenderer.send('broadcast-state', payload),
  onState: (cb) => ipcRenderer.on('state', (_e, s) => cb(s)),
  dispatch: (action) => ipcRenderer.send('dispatch', action),
  onDispatch: (cb) => ipcRenderer.on('dispatch', (_e, a) => cb(a)),
  toggleWindow: (view) => ipcRenderer.invoke('toggle-window', view),
  setLayoutMode: (mode) => ipcRenderer.invoke('set-layout-mode', mode),
  onOpenWindows: (cb) => ipcRenderer.on('open-windows', (_e, open) => cb(open)),
});
