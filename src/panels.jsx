import { useState, useEffect, useRef, memo } from 'react';
import { CALL_SCRIPTS, STYLE_SCRIPTS, BUYER_CLARIFYING, SELLER_CLARIFYING, BUYER_SCRIPT_KEYS, SELLER_SCRIPT_KEYS, COACHING_CONFIG } from './scripts.js';
import { IconMic, IconCheck, IconZap, IconLoader, IconChat, IconCopy, IconChevronDown } from './icons.jsx';

// The panels below are the app's real content. Each takes a hub state snapshot and a
// dispatch function, so the same component renders inside a floating content window
// (state over IPC) or inside the hub window's one-piece column layout (state direct).

export const LPMAMA_ITEMS = [
  { key: 'L',  label: 'Location',    hint: 'Where are they looking?' },
  { key: 'P',  label: 'Price',       hint: 'Budget / affordability?' },
  { key: 'M',  label: 'Motivation',  hint: 'Why are they moving?' },
  { key: 'A',  label: 'Agent',       hint: 'Working with anyone?' },
  { key: 'Ma', label: 'Mortgage',    hint: 'Pre-approved?' },
  { key: 'Ap', label: 'Appointment', hint: 'Can we meet?' },
];

export const STYLE_LABELS = {
  nepq: 'NEPQ',
  reverse: 'Reverse Selling',
  straightline: 'Straight Line',
  condensed: 'Condensed',
};

// ── Shared pieces ─────────────────────────────────────────────────────────────

export function CoachCard({ card, config }) {
  return (
    <div className="coach-card">
      <div className="coach-card-hdr">
        <span className="card-badge" style={{ '--accent': config.color, '--accent-dim': config.colorDim || 'var(--s3)' }}>
          {config.icon ? <config.icon size={14} /> : '3A'}
        </span>
        <span className="coach-card-hdr-label">{config.label}</span>
        {card.auto && <span className="auto-badge">auto</span>}
        <span className="coach-card-time">{card.time}</span>
      </div>
      <div className="coach-card-body">
        {card.status === 'streaming' && (
          card.streamText
            ? <div className="stream-text">{card.streamText}</div>
            : <div className="filler-text"><div className="spinner" style={{ color: config.color }} />{card.filler}</div>
        )}
        {card.status === 'loading' && (
          <div className="filler-text">
            <div className="spinner" style={{ color: config.color }} />
            {card.filler}
          </div>
        )}
        {card.status === 'error' && (
          <div style={{ color: 'var(--red)', fontSize: 12 }}>Error: {card.error}</div>
        )}
        {card.status === 'done' && card.sections.map((sec, i) => {
          if (sec.type === 'context') return <div key={i} className="coach-context">{sec.text}</div>;
          if (sec.type === 'option')  return (
            <div key={i} className="coach-option">
              <div className="coach-option-label">Option {sec.num}{sec.tag ? ` · ${sec.tag}` : ''}</div>
              <div className="coach-option-text">{sec.lines.join(' ')}</div>
            </div>
          );
          if (sec.type === 'note') return (
            <div key={i} className="coach-note">
              <strong>Coach:</strong> {sec.text}
            </div>
          );
          if (sec.type === 'raw') return (
            <div key={i} style={{ fontSize: 12.5, color: 'var(--t1)', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
              {sec.text}
            </div>
          );
          return null;
        })}
      </div>
    </div>
  );
}

export function LevelMeter({ level, bars = 7, color = 'var(--green)' }) {
  return (
    <div className="level-meter">
      {Array.from({ length: bars }, (_, i) => {
        const threshold = i / bars;
        const active    = level > threshold;
        const barColor  = i >= bars * 0.75 ? 'var(--red)' : i >= bars * 0.5 ? 'var(--yellow)' : color;
        return (
          <div
            key={i}
            className="level-bar"
            style={{
              height:     active ? `${4 + (i / bars) * 10}px` : '2px',
              background: active ? barColor : 'var(--b2)',
            }}
          />
        );
      })}
    </div>
  );
}

// ── Transcript ────────────────────────────────────────────────────────────────

export function TranscriptPanel({ state, dispatch }) {
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
    <div className="flyout-tab-content transcript-tab">
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
  );
}

// ── Assist ────────────────────────────────────────────────────────────────────

// Renders as a fragment so its rows stay direct flex children of whatever wraps it.
export function StylePicker({ state, dispatch, showLabel = true }) {
  const effectiveStyle = state.effectiveStyle;
  const promptMode = state.promptMode || 'full';

  return (
    <>
      {showLabel && effectiveStyle && (
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
    </>
  );
}

export function CoachCardList({ state }) {
  const coachCards = state.coachCards || [];
  return (
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
  );
}

export function AssistControls({ state, dispatch }) {
  const [chatQuestion, setChatQuestion] = useState('');

  const sendChat = () => {
    const q = chatQuestion.trim();
    if (!q) return;
    dispatch({ type: 'triggerChat', question: q });
    setChatQuestion('');
  };

  return (
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
  );
}

export function AssistPanel({ state, dispatch }) {
  return (
    <div className="flyout-tab-content assist-tab">
      <StylePicker state={state} dispatch={dispatch} />
      <CoachCardList state={state} />
      <AssistControls state={state} dispatch={dispatch} />
    </div>
  );
}

// ── Checklist ─────────────────────────────────────────────────────────────────

export function ChecklistPanel({ state, dispatch }) {
  const lpmamaChecked = state.lpmamaChecked || {};
  const isBuyer = !state.currentScript || BUYER_SCRIPT_KEYS.includes(state.currentScript);

  return (
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
  );
}

// ── Script ────────────────────────────────────────────────────────────────────

export function ScriptPanel({ state }) {
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
  );
}

// ── One-piece column layout ───────────────────────────────────────────────────

function ColumnSection({ label, open, onToggle, summary, summaryClass = '', grow = 1, children }) {
  return (
    <div className={`column-section${open ? ' open' : ''}`} style={open ? { flexGrow: grow } : undefined}>
      <button className="column-section-hdr" onClick={onToggle} aria-expanded={open}>
        <IconChevronDown size={12} className="column-chevron" />
        <span className="column-section-label">{label}</span>
        {summary && <span className={`column-section-summary ${summaryClass}`}>{summary}</span>}
      </button>
      {open && <div className="column-section-body">{children}</div>}
    </div>
  );
}

// Every panel stacked in the hub window. Memoized on the state snapshot, which the hub
// refreshes at the same 10Hz the floating windows get, so the 60Hz level-meter updates
// in the hub don't re-render the script, cards and transcript on every frame.
export const ColumnLayout = memo(function ColumnLayout({ state, dispatch }) {
  const [open, setOpen] = useState({ script: true, assist: true, transcript: false });
  const toggle = key => setOpen(o => ({ ...o, [key]: !o[key] }));

  const finalLines = state.finalLines || [];
  const lastLine = finalLines[finalLines.length - 1];
  const ticker = state.leadInterim ? `Lead: ${state.leadInterim}`
    : state.agentInterim ? `You: ${state.agentInterim}`
    : lastLine ? `${lastLine.speaker === 'lead' ? 'Lead' : 'You'}: ${lastLine.text}`
    : '';

  const cardCount = (state.coachCards || []).length;
  const effectiveStyle = state.effectiveStyle;

  return (
    <div className="column-body">
      <div className="column-checklist">
        <ChecklistPanel state={state} dispatch={dispatch} />
      </div>

      <ColumnSection
        label="Script"
        open={open.script}
        onToggle={() => toggle('script')}
        summary={effectiveStyle ? STYLE_LABELS[effectiveStyle] : ''}
        summaryClass={`style-active-label ${effectiveStyle || ''}`}
        grow={1.2}
      >
        <div className="column-style-picker">
          <StylePicker state={state} dispatch={dispatch} showLabel={false} />
        </div>
        <ScriptPanel state={state} />
      </ColumnSection>

      <ColumnSection
        label="Assist"
        open={open.assist}
        onToggle={() => toggle('assist')}
        summary={!open.assist && cardCount ? `${cardCount} card${cardCount === 1 ? '' : 's'}` : ''}
        grow={1.3}
      >
        <CoachCardList state={state} />
      </ColumnSection>

      <ColumnSection
        label="Transcript"
        open={open.transcript}
        onToggle={() => toggle('transcript')}
        summary={!open.transcript ? ticker : ''}
        grow={0.8}
      >
        <TranscriptPanel state={state} dispatch={dispatch} />
      </ColumnSection>

      <AssistControls state={state} dispatch={dispatch} />
    </div>
  );
});
