import { useState, useEffect, useRef, useMemo, memo } from 'react';
import { CALL_SCRIPTS } from './scripts.js';
import { ScriptPanel, LevelMeter, STYLE_LABELS } from './panels.jsx';
import {
  IconMic, IconGear, IconClose, IconWaveform, IconRefresh, IconSun, IconMoon,
  IconChevronDown, IconUser, IconFile, IconSearch, IconLoader, IconStar4,
} from './icons.jsx';

// Eco: the whole app as one compact bar that shows a single line to say.
// Everything else (lead type, script, audio, menu) opens as one panel under the bar.

const STYLE_OPTIONS = [
  { value: '',             label: 'Mixed' },
  { value: 'nepq',         label: STYLE_LABELS.nepq },
  { value: 'reverse',      label: STYLE_LABELS.reverse },
  { value: 'straightline', label: STYLE_LABELS.straightline },
  { value: 'condensed',    label: STYLE_LABELS.condensed },
];

// The 10Hz snapshot isn't needed here: the script only depends on these two values,
// so a memoized panel skips the hub's per-frame level-meter re-renders.
const MemoScriptPanel = memo(ScriptPanel);

// The model marks the key words with **double asterisks**; they render in the accent.
function HighlightedLine({ text }) {
  return text.split('**').map((part, i) => (
    i % 2 ? <span key={i} className="eco-hl">{part}</span> : part
  ));
}

function EcoSwitch({ on, onClick, title }) {
  return (
    <button
      className={`eco-switch${on ? ' on' : ''}`}
      role="switch"
      aria-checked={on}
      onClick={onClick}
      title={title}
    >
      <span className="eco-switch-knob" />
    </button>
  );
}

// Four bars that sit still when quiet and ride the live audio level when there is one.
const BAR_SHAPE = [0.35, 1, 0.7, 0.3];
function EcoBars({ level }) {
  return (
    <span className="eco-bars" aria-hidden="true">
      {BAR_SHAPE.map((shape, i) => (
        <span key={i} style={{ height: `${3 + shape * (4 + Math.min(1, level) * 8)}px` }} />
      ))}
    </span>
  );
}

export default function EcoLayout({
  ecoLine, onSuggest, onRetry, onDeeper,
  elapsed, isListening, toggleMic, sysActive, toggleSys, micLevel, sysLevel,
  autoMode, onToggleAuto,
  effectiveStyle, onStyleChange,
  currentScript, onScriptChange,
  clearCall, theme, setTheme, setShowSettings,
  layoutMode, layoutModes, onLayoutChange, onHeight,
}) {
  const [panel, setPanel] = useState(null); // 'lead' | 'script' | 'audio' | 'menu' | null
  const cardRef = useRef(null);

  // The hub window is sized to this card, so report its height whenever it changes
  // (a panel opening, the line wrapping onto a second row). 16 = the card's margins.
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const report = () => onHeight(Math.ceil(el.getBoundingClientRect().height) + 16);
    const observer = new ResizeObserver(report);
    observer.observe(el);
    report();
    return () => observer.disconnect();
  }, [onHeight]);

  const toggle = (name) => setPanel(cur => (cur === name ? null : name));
  const scriptState = useMemo(() => ({ currentScript, effectiveStyle }), [currentScript, effectiveStyle]);

  const busy = ecoLine.status === 'loading' || ecoLine.status === 'streaming';
  const live = isListening || sysActive;
  const leadLabel = CALL_SCRIPTS[currentScript]?.label || 'Lead';
  const styleLabel = STYLE_OPTIONS.find(o => o.value === (effectiveStyle || ''))?.label || 'Mixed';
  const hint = busy ? 'Thinking…'
    : autoMode && live ? 'Listening… a line appears when the lead speaks'
    : 'Press Suggest for a line to say';

  return (
    <div className="eco-shell" ref={cardRef}>
      <div className="eco-top">
        <span className={`eco-dot${live ? ' live' : ''}`} />
        <span className="eco-timer">{elapsed}</span>
        <label className="eco-pill eco-style" title="Coaching style">
          <IconFile size={13} className="eco-pill-icon" />
          <span>{styleLabel}</span>
          <IconChevronDown size={12} className="eco-pill-chev" />
          <select value={effectiveStyle || ''} onChange={e => onStyleChange(e.target.value)} aria-label="Coaching style">
            {STYLE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </label>
        <span className="eco-spacer" />
        <EcoSwitch
          on={autoMode}
          onClick={onToggleAuto}
          title={autoMode ? 'Auto-suggest is on — click to turn off' : 'Turn on auto-suggest'}
        />
        <button
          className={`eco-rec${isListening ? ' live' : ''}`}
          onClick={toggleMic}
          title={isListening ? 'Stop mic' : 'Start mic'}
        >
          <span className="eco-rec-glyph" />
        </button>
        <button
          className={`eco-round${panel === 'menu' ? ' open' : ''}`}
          onClick={() => toggle('menu')}
          title="Menu"
        >
          <IconGear size={14} />
        </button>
      </div>

      <div className={`eco-line ${ecoLine.status}`}>
        {ecoLine.text
          ? <HighlightedLine text={ecoLine.text} />
          : <span className="eco-line-hint">{hint}</span>}
      </div>

      <div className="eco-actions">
        <button className="eco-action" onClick={onRetry} disabled={!ecoLine.text || busy} title="Another line for the same moment">
          <IconRefresh size={13} /> Retry
        </button>
        <button className="eco-action" onClick={onDeeper} disabled={!ecoLine.text || busy} title="One deeper follow-up question">
          <IconSearch size={13} /> Dig deeper
        </button>
      </div>

      <div className="eco-row">
        <button className="eco-chip suggest" onClick={onSuggest} disabled={busy} title="Get a line to say now">
          {busy ? <IconLoader size={14} /> : <IconStar4 size={13} />}
          <span>Suggest</span>
        </button>
        <button className={`eco-chip${panel === 'lead' ? ' open' : ''}`} onClick={() => toggle('lead')} title="Lead type">
          <IconUser size={14} className="eco-chip-icon" />
          <span className="eco-chip-label">{leadLabel}</span>
          <IconChevronDown size={12} className="eco-chev" />
        </button>
        <button className={`eco-chip${panel === 'script' ? ' open' : ''}`} onClick={() => toggle('script')} title="Script">
          <IconFile size={14} className="eco-chip-icon" />
          <span>Script</span>
          <IconChevronDown size={12} className="eco-chev" />
        </button>
        <span className="eco-spacer" />
        <button className={`eco-chip audio${panel === 'audio' ? ' open' : ''}`} onClick={() => toggle('audio')} title="Audio">
          <EcoBars level={Math.max(micLevel, sysLevel)} />
          <IconChevronDown size={12} className="eco-chev" />
        </button>
      </div>

      {panel === 'lead' && (
        <div className="eco-panel">
          <div className="eco-lead-grid">
            {Object.entries(CALL_SCRIPTS).map(([key, script]) => (
              <button
                key={key}
                className={`eco-option${currentScript === key ? ' active' : ''}`}
                onClick={() => { onScriptChange(key); setPanel(null); }}
              >
                {script.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {panel === 'script' && (
        <div className="eco-panel eco-script">
          <MemoScriptPanel state={scriptState} />
        </div>
      )}

      {panel === 'audio' && (
        <div className="eco-panel eco-audio">
          <div className="eco-audio-row">
            <span className="eco-audio-label"><IconMic size={14} /> Mic</span>
            <LevelMeter level={micLevel} />
            <EcoSwitch on={isListening} onClick={toggleMic} title={isListening ? 'Stop mic' : 'Start mic'} />
          </div>
          <div className="eco-audio-row">
            <span className="eco-audio-label"><IconWaveform size={14} /> System audio</span>
            <LevelMeter level={sysLevel} color="var(--eco-accent)" />
            <EcoSwitch on={sysActive} onClick={toggleSys} title={sysActive ? 'Stop system audio' : 'Start system audio'} />
          </div>
        </div>
      )}

      {panel === 'menu' && (
        <div className="eco-panel eco-menu">
          <div className="pill-overflow-row">
            <button className="pill-overflow-chip" onClick={() => { setPanel(null); setShowSettings(true); }} title="Settings">
              <IconGear size={15} />
              <span className="pill-overflow-chip-label">Settings</span>
            </button>
            <button className="pill-overflow-chip" onClick={clearCall} title="Clear the line, transcript and call context to start a new call">
              <IconRefresh size={15} />
              <span className="pill-overflow-chip-label">Clear call</span>
            </button>
            <button
              className="pill-overflow-chip"
              onClick={() => setTheme(th => (th === 'dark' ? 'light' : 'dark'))}
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <IconSun size={15} /> : <IconMoon size={15} />}
              <span className="pill-overflow-chip-label">Theme</span>
            </button>
            <button
              className="pill-overflow-chip"
              onClick={() => (window.electronAPI ? window.electronAPI.quitApp() : window.close())}
              title="Quit"
            >
              <IconClose size={15} />
              <span className="pill-overflow-chip-label">Quit</span>
            </button>
          </div>
          <div className="pill-overflow-row">
            {layoutModes.map(m => {
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
