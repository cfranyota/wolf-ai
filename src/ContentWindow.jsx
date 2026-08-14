import { useState, useEffect, useRef } from 'react';
import { CALL_SCRIPTS, STYLE_SCRIPTS, BUYER_CLARIFYING, SELLER_CLARIFYING, BUYER_SCRIPT_KEYS, SELLER_SCRIPT_KEYS, COACHING_CONFIG } from './scripts.js';
import { CoachCard, LevelMeter } from './App.jsx';
import { IconMic, IconSparkle, IconCheck, IconClipboard, IconZap, IconLoader, IconClose, IconChat, IconCopy } from './icons.jsx';

// Small, static — duplicated from App.jsx deliberately (separate renderer bundle,
// not worth cross-importing 6-15 line constants).
const LPMAMA_ITEMS = [
  { key: 'L',  label: 'Location',    hint: 'Where are they looking?' },
  { key: 'P',  label: 'Price',       hint: 'Budget / affordability?' },
  { key: 'M',  label: 'Motivation',  hint: 'Why are they moving?' },
  { key: 'A',  label: 'Agent',       hint: 'Working with anyone?' },
  { key: 'Ma', label: 'Mortgage',    hint: 'Pre-approved?' },
  { key: 'Ap', label: 'Appointment', hint: 'Can we meet?' },
];

const STYLE_LABELS = {
  nepq: 'NEPQ',
  reverse: 'Reverse Selling',
  straightline: 'Straight Line',
  condensed: 'Condensed',
};

const VIEW_META = {
  transcript: { label: 'Transcript', icon: IconMic,       accent: '#60a5fa', accentDim: 'rgba(96,165,250,0.14)' },
  assist:     { label: 'Assist',     icon: IconSparkle,   accent: 'var(--purple)', accentDim: 'var(--purple-dim)' },
  checklist:  { label: 'Checklist',  icon: IconCheck,     accent: 'var(--green)',  accentDim: 'var(--green-dim)'  },
  script:     { label: 'Script',     icon: IconClipboard, accent: 'var(--blue)',   accentDim: 'var(--blue-dim)'   },
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

function TranscriptView() {
  const state = useHubState();
  const [manualText, setManualText] = useState('');
  const endRef = useRef(null);
  const finalLines = state.finalLines || [];

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [finalLines, state.leadInterim, state.agentInterim]);

  const submit = () => {
    const t = manualText.trim();
    if (!t) return;
    dispatch({ type: 'submitManual', text: t });
    setManualText('');
  };

  return (
    <WindowChrome view="transcript">
      <div className="flyout-tab-content">
        {(state.isListening || state.sysActive) && (
          <div className="meter-row">
            {state.isListening && (
              <>
                <span className="meter-label">Mic</span>
                <LevelMeter level={state.micLevel || 0} />
              </>
            )}
            {state.sysActive && (
              <>
                <span className="meter-label">Sys</span>
                <LevelMeter level={state.sysLevel || 0} color="var(--blue)" />
              </>
            )}
          </div>
        )}

        <div className="transcript-body">
          {finalLines.length === 0 && !state.leadInterim && !state.agentInterim && (
            <div className="transcript-empty">
              <div className="transcript-empty-icon"><IconMic size={24} /></div>
              <div>Start mic to begin transcribing</div>
            </div>
          )}
          {finalLines.map(line => (
            <div key={line.id} className={`t-line ${line.speaker}`}>
              <div className="t-meta">
                <span className="t-avatar" />
                <span className="t-speaker">{line.speaker === 'lead' ? 'LEAD' : 'YOU'}</span>
                <span className="t-time">{line.ts}</span>
              </div>
              <div className="t-text">{line.text}</div>
            </div>
          ))}
          {state.leadInterim && (
            <div className="t-line lead interim">
              <div className="t-meta"><span className="t-avatar" /><span className="t-speaker">LEAD</span></div>
              <div className="t-text">{state.leadInterim}</div>
            </div>
          )}
          {state.agentInterim && (
            <div className="t-line agent interim">
              <div className="t-meta"><span className="t-avatar" /><span className="t-speaker">YOU</span></div>
              <div className="t-text">{state.agentInterim}</div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        <div className="manual-row">
          <input
            className="manual-in"
            placeholder="Type lead's words…"
            value={manualText}
            onChange={e => setManualText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && submit()}
          />
          <button className="manual-send" onClick={submit}>↵</button>
        </div>
      </div>
    </WindowChrome>
  );
}

function AssistView() {
  const state = useHubState();
  const [chatQuestion, setChatQuestion] = useState('');
  const effectiveStyle = state.effectiveStyle;
  const promptMode = state.promptMode || 'full';
  const coachCards = state.coachCards || [];

  const sendChat = () => {
    const q = chatQuestion.trim();
    if (!q) return;
    dispatch({ type: 'triggerChat', question: q });
    setChatQuestion('');
  };

  return (
    <WindowChrome view="assist">
      <div className="flyout-tab-content assist-tab">
        {effectiveStyle && (
          <span className={`style-active-label ${effectiveStyle}`}>{STYLE_LABELS[effectiveStyle]}</span>
        )}
        <div className="mode-btn-row">
          <button
            className={`mode-btn${promptMode === 'full' ? ' active' : ''}`}
            onClick={() => dispatch({ type: 'setPromptMode', value: 'full' })}
            title="Full scripts"
          >
            Full
          </button>
          <button
            className={`mode-btn${promptMode === 'condensed' ? ' active' : ''}`}
            onClick={() => dispatch({ type: 'setPromptMode', value: 'condensed' })}
            title="Condensed ad-lib cues"
          >
            Condensed
          </button>
        </div>
        {promptMode === 'full' && (
          <div className="style-btn-row">
            <button
              className={`style-btn nepq${state.coachStyle === 'nepq' ? ' active' : ''}`}
              onClick={() => dispatch({ type: 'setCoachStyle', value: state.coachStyle === 'nepq' ? null : 'nepq' })}
              title="NEPQ"
            >
              NEPQ
            </button>
            <button
              className={`style-btn reverse${state.coachStyle === 'reverse' ? ' active' : ''}`}
              onClick={() => dispatch({ type: 'setCoachStyle', value: state.coachStyle === 'reverse' ? null : 'reverse' })}
              title="Reverse Selling"
            >
              Reverse Selling
            </button>
            <button
              className={`style-btn straightline${state.coachStyle === 'straightline' ? ' active' : ''}`}
              onClick={() => dispatch({ type: 'setCoachStyle', value: state.coachStyle === 'straightline' ? null : 'straightline' })}
              title="Straight Line"
            >
              Straight Line
            </button>
          </div>
        )}

        <div className="assist-body">
          {coachCards.length === 0 && (
            <div className="assist-empty">
              <div className="assist-empty-icon"><IconZap size={22} /></div>
              <div>Hit a coaching button when you need it</div>
            </div>
          )}
          {coachCards.map(card => (
            <CoachCard
              key={card.id}
              card={card}
              config={COACHING_CONFIG[card.mode] || { label: 'Chat', icon: IconChat, color: 'var(--t2)', colorDim: 'var(--s3)' }}
            />
          ))}
        </div>

        <div className="assist-footer">
          <div className="chat-row">
            <input
              className="chat-in"
              placeholder="Ask AI anything about this call…"
              value={chatQuestion}
              onChange={e => setChatQuestion(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendChat()}
            />
            <button className="chat-send" onClick={sendChat}>↑</button>
          </div>
          <div className="coach-row">
            <button
              className={`coach-btn auto-btn${state.autoMode ? ' auto-active' : ''}`}
              onClick={() => dispatch({ type: 'toggleAutoMode' })}
              title={state.autoMode ? 'Auto ON — click to disable' : 'Enable Auto mode'}
            >
              <span className="coach-icon"><IconZap size={13} /></span>
              <span className="coach-label">Auto</span>
            </button>
            {Object.entries(COACHING_CONFIG).map(([mode, cfg]) => (
              <button
                key={mode}
                className={`coach-btn ${mode}${state.loadingMode === mode ? ' loading' : ''}`}
                onClick={() => dispatch({ type: 'triggerCoach', mode })}
                disabled={!!state.loadingMode}
                title={cfg.label}
              >
                <span className="coach-icon">
                  {state.loadingMode === mode
                    ? <IconLoader size={13} />
                    : cfg.icon ? <cfg.icon size={13} /> : '3A'}
                </span>
                <span className="coach-label">{cfg.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </WindowChrome>
  );
}

function ChecklistView() {
  const state = useHubState();
  const lpmamaChecked = state.lpmamaChecked || {};
  const isBuyer = !state.currentScript || BUYER_SCRIPT_KEYS.includes(state.currentScript);

  return (
    <WindowChrome view="checklist">
      <div className="flyout-tab-content">
        {isBuyer ? (
          <div className="lpmama-row">
            {LPMAMA_ITEMS.map(item => (
              <div
                key={item.key}
                className={`lpmama-pill lpmama-${item.key}${lpmamaChecked[item.key] ? ' checked' : ''}`}
                onClick={() => dispatch({ type: 'toggleLpmama', key: item.key })}
                title={`${item.label} — ${item.hint}`}
              >
                {item.key.charAt(0)}
              </div>
            ))}
            <button
              className={`lpmama-copy-btn${state.lpmamaCopied ? ' copied' : ''}`}
              onClick={() => dispatch({ type: 'copyLpmama' })}
              title="Copy LPMAMA summary to clipboard"
            >
              {state.lpmamaCopied ? <IconCheck size={12} /> : <IconCopy size={12} />}
            </button>
          </div>
        ) : (
          <div className="script-empty">The LPMAMA checklist applies to buyer leads.</div>
        )}
      </div>
    </WindowChrome>
  );
}

function ScriptView() {
  const state = useHubState();
  const currentScript = state.currentScript;
  const effectiveStyle = state.effectiveStyle;
  const script = CALL_SCRIPTS[currentScript];
  const activeStyleScript = effectiveStyle && currentScript ? STYLE_SCRIPTS[effectiveStyle]?.[currentScript] : null;
  const clarifyingQuestions = !activeStyleScript && BUYER_SCRIPT_KEYS.includes(currentScript)
    ? { label: 'Buyer Clarifying Questions', items: BUYER_CLARIFYING }
    : SELLER_SCRIPT_KEYS.includes(currentScript)
    ? { label: 'Seller Clarifying Questions', items: SELLER_CLARIFYING }
    : null;

  return (
    <WindowChrome view="script">
      <div className="flyout-tab-content">
        {activeStyleScript ? (
          <>
            <div className="script-goal">{activeStyleScript.goal}</div>
            {activeStyleScript.sections.map((sec, i) => (
              <div key={i}>
                <div className="script-section-label">{sec.label}</div>
                {sec.items.map((line, j) => (
                  <div key={j} className="script-q style-script-line">{line}</div>
                ))}
              </div>
            ))}
          </>
        ) : script ? (
          <>
            <div className="script-goal">Goal: {script.goal}</div>
            {script.sections ? (
              script.sections.map((sec, i) => (
                <div key={i}>
                  <div className="script-section-label">{sec.label}</div>
                  {sec.items.map((line, j) => (
                    <div key={j} className="script-q">{line}</div>
                  ))}
                </div>
              ))
            ) : (
              <>
                <div className="script-section-label">Opening</div>
                {script.opening.map((o, i) => (
                  <div key={i} className="script-opening">{o}</div>
                ))}
                <div className="script-section-label">Questions</div>
                {script.questions.map((q, i) => (
                  <div key={i} className="script-q">{q}</div>
                ))}
                <div className="script-section-label">Objections</div>
                {script.objections.map((obj, i) => (
                  <div key={i} className="script-obj">
                    <div className="script-obj-q">{obj.q}</div>
                    <div className="script-obj-a">{obj.a}</div>
                  </div>
                ))}
              </>
            )}
            {clarifyingQuestions && (
              <>
                <div className="script-section-label">{clarifyingQuestions.label}</div>
                {clarifyingQuestions.items.map((q, i) => (
                  <div key={i} className="script-clarify">{q}</div>
                ))}
              </>
            )}
          </>
        ) : (
          <div className="script-empty">Select a lead type to see the script</div>
        )}
      </div>
    </WindowChrome>
  );
}

export default function ContentWindow({ view }) {
  if (view === 'transcript') return <TranscriptView />;
  if (view === 'assist') return <AssistView />;
  if (view === 'checklist') return <ChecklistView />;
  if (view === 'script') return <ScriptView />;
  return null;
}
