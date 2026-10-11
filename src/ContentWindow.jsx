import { useState, useEffect } from 'react';
import { TranscriptPanel, AssistPanel, ChecklistPanel, ScriptPanel } from './panels.jsx';
import { IconMic, IconSparkle, IconCheck, IconClipboard, IconClose } from './icons.jsx';

const VIEW_META = {
  transcript: { label: 'Transcript', icon: IconMic,       accent: '#60a5fa', accentDim: 'rgba(96,165,250,0.14)', Panel: TranscriptPanel },
  assist:     { label: 'Assist',     icon: IconSparkle,   accent: 'var(--purple)', accentDim: 'var(--purple-dim)', Panel: AssistPanel },
  checklist:  { label: 'Checklist',  icon: IconCheck,     accent: 'var(--green)',  accentDim: 'var(--green-dim)',  Panel: ChecklistPanel },
  script:     { label: 'Script',     icon: IconClipboard, accent: 'var(--blue)',   accentDim: 'var(--blue-dim)',   Panel: ScriptPanel },
};

function dispatch(action) {
  window.electronAPI?.dispatch(action);
}

// Hydrates from state snapshots the hub broadcasts ~10x/sec, and keeps this
// window's own theme in sync (each BrowserWindow is a separate document).
function useHubState() {
  const [state, setState] = useState({});
  useEffect(() => {
    if (!window.electronAPI) return;
    window.electronAPI.onState(setState);
  }, []);
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', state.theme || 'dark');
  }, [state.theme]);
  return state;
}

function WindowChrome({ view, children }) {
  const meta = VIEW_META[view];
  const Icon = meta.icon;
  return (
    <div className="app">
      <div className="content-window">
        <div className="content-window-hdr">
          <span className="pill-drag" title="Drag to move">⠿</span>
          <span className="card-badge" style={{ '--accent': meta.accent, '--accent-dim': meta.accentDim }}><Icon size={14} /></span>
          <span className="content-window-label">{meta.label}</span>
          <button
            className="pill-icon-btn close"
            onClick={() => window.electronAPI?.toggleWindow(view)}
            title="Close"
          >
            <IconClose size={14} />
          </button>
        </div>
        <div className="content-window-body">{children}</div>
      </div>
    </div>
  );
}

// One floating window per view: the shared panel, fed by the hub over IPC.
export default function ContentWindow({ view }) {
  const state = useHubState();
  const meta = VIEW_META[view];
  if (!meta) return null;
  const Panel = meta.Panel;
  return (
    <WindowChrome view={view}>
      <Panel state={state} dispatch={dispatch} />
    </WindowChrome>
  );
}
