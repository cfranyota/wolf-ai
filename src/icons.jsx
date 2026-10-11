// Lucide-style inline stroke icons — replaces emoji glyphs in badges/buttons.
// No npm dependency: each icon is a tiny functional component, colored via
// the parent's `color` (currentColor), sized via the `size` prop.

const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

export function IconMic({ size = 16, ...props }) {
  return (
    <svg width={size} height={size} {...base} {...props}>
      <rect x="9" y="2" width="6" height="11" rx="3" />
      <path d="M5 10a7 7 0 0 0 14 0" />
      <path d="M12 17v4" />
      <path d="M8 21h8" />
    </svg>
  );
}

export function IconSparkle({ size = 16, ...props }) {
  return (
    <svg width={size} height={size} {...base} {...props}>
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18" />
    </svg>
  );
}

export function IconCheck({ size = 16, ...props }) {
  return (
    <svg width={size} height={size} {...base} {...props}>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export function IconClipboard({ size = 16, ...props }) {
  return (
    <svg width={size} height={size} {...base} {...props}>
      <rect x="6" y="4" width="12" height="17" rx="2" />
      <path d="M9 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1" />
      <path d="M9 10h6M9 14h6M9 18h3" />
    </svg>
  );
}

export function IconShieldAlert({ size = 16, ...props }) {
  return (
    <svg width={size} height={size} {...base} {...props}>
      <path d="M12 2 4 5v6c0 5 3.4 8.5 8 10 4.6-1.5 8-5 8-10V5z" />
      <path d="M12 8v4" />
      <path d="M12 15h.01" />
    </svg>
  );
}

export function IconLightbulb({ size = 16, ...props }) {
  return (
    <svg width={size} height={size} {...base} {...props}>
      <path d="M9 18h6" />
      <path d="M10 22h4" />
      <path d="M12 2a6 6 0 0 0-4 10.5c.6.6 1 1.4 1 2.5h6c0-1.1.4-1.9 1-2.5A6 6 0 0 0 12 2Z" />
    </svg>
  );
}

export function IconTarget({ size = 16, ...props }) {
  return (
    <svg width={size} height={size} {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1" />
    </svg>
  );
}

export function IconCalendar({ size = 16, ...props }) {
  return (
    <svg width={size} height={size} {...base} {...props}>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M16 3v4M8 3v4M3 10h18" />
    </svg>
  );
}

export function IconZap({ size = 16, ...props }) {
  return (
    <svg width={size} height={size} {...base} {...props}>
      <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" />
    </svg>
  );
}

export function IconLoader({ size = 16, className = '', style, ...props }) {
  return (
    <svg
      width={size}
      height={size}
      {...base}
      className={`icon-spin ${className}`.trim()}
      style={style}
      {...props}
    >
      <path d="M12 3a9 9 0 1 0 9 9" />
    </svg>
  );
}

export function IconChat({ size = 16, ...props }) {
  return (
    <svg width={size} height={size} {...base} {...props}>
      <path d="M4 4h16v12H8l-4 4Z" />
    </svg>
  );
}

export function IconMore({ size = 16, ...props }) {
  return (
    <svg width={size} height={size} {...base} {...props}>
      <circle cx="5" cy="12" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="19" cy="12" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconGear({ size = 16, ...props }) {
  return (
    <svg width={size} height={size} {...base} {...props}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 13a7.4 7.4 0 0 0 0-2l2-1.5-2-3.4-2.3.9a7.4 7.4 0 0 0-1.8-1L15 3.5h-4l-.3 2.5a7.4 7.4 0 0 0-1.8 1l-2.3-.9-2 3.4L6.6 11a7.4 7.4 0 0 0 0 2l-2 1.5 2 3.4 2.3-.9a7.4 7.4 0 0 0 1.8 1l.3 2.5h4l.3-2.5a7.4 7.4 0 0 0 1.8-1l2.3.9 2-3.4Z" />
    </svg>
  );
}

export function IconCopy({ size = 16, ...props }) {
  return (
    <svg width={size} height={size} {...base} {...props}>
      <rect x="9" y="9" width="12" height="12" rx="2" />
      <path d="M5 15V5a2 2 0 0 1 2-2h10" />
    </svg>
  );
}

export function IconWaveform({ size = 16, ...props }) {
  return (
    <svg width={size} height={size} {...base} {...props}>
      <path d="M3 12h1M7 8v8M11 5v14M15 8v8M19 10v4M21 12h1" />
    </svg>
  );
}

export function IconRefresh({ size = 16, ...props }) {
  return (
    <svg width={size} height={size} {...base} {...props}>
      <path d="M20 11A8 8 0 0 0 6.3 6.3L4 8.6" />
      <path d="M4 4v4.6h4.6" />
      <path d="M4 13a8 8 0 0 0 13.7 4.7L20 15.4" />
      <path d="M20 20v-4.6h-4.6" />
    </svg>
  );
}

export function IconSun({ size = 16, ...props }) {
  return (
    <svg width={size} height={size} {...base} {...props}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  );
}

export function IconMoon({ size = 16, ...props }) {
  return (
    <svg width={size} height={size} {...base} {...props}>
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
    </svg>
  );
}

export function IconClose({ size = 16, ...props }) {
  return (
    <svg width={size} height={size} {...base} {...props}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

export function IconChevronDown({ size = 16, ...props }) {
  return (
    <svg width={size} height={size} {...base} {...props}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export function IconLayoutFloating({ size = 16, ...props }) {
  return (
    <svg width={size} height={size} {...base} {...props}>
      <rect x="3" y="3" width="11" height="9" rx="1.5" />
      <rect x="10" y="12" width="11" height="9" rx="1.5" />
    </svg>
  );
}

export function IconLayoutEco({ size = 16, ...props }) {
  return (
    <svg width={size} height={size} {...base} {...props}>
      <rect x="2.5" y="7" width="19" height="10" rx="5" />
      <path d="M7 12h6" />
    </svg>
  );
}

// Solid four-point star, used for Eco's Suggest button.
export function IconStar4({ size = 16, ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2.5c.5 4.9 2.1 6.5 9.5 9.5-7.4 3-9 4.6-9.5 9.5-.5-4.9-2.1-6.5-9.5-9.5 7.4-3 9-4.6 9.5-9.5Z" />
    </svg>
  );
}

export function IconUser({ size = 16, ...props }) {
  return (
    <svg width={size} height={size} {...base} {...props}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4.5 20.5a7.5 7.5 0 0 1 15 0" />
    </svg>
  );
}

export function IconFile({ size = 16, ...props }) {
  return (
    <svg width={size} height={size} {...base} {...props}>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z" />
      <path d="M14 3v5h5M9 13h6M9 17h4" />
    </svg>
  );
}

export function IconSearch({ size = 16, ...props }) {
  return (
    <svg width={size} height={size} {...base} {...props}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m20 20-4.2-4.2" />
    </svg>
  );
}

export function IconLayoutColumn({ size = 16, ...props }) {
  return (
    <svg width={size} height={size} {...base} {...props}>
      <rect x="6" y="3" width="12" height="18" rx="2" />
      <path d="M6 9h12M6 15h12" />
    </svg>
  );
}
