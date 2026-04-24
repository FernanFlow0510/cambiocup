// Theme tokens + icons + chart primitives for Cambio CUP
// Emerald accent, cool neutrals. Based on OKLCH harmonious palette.

const THEMES = {
  dark: {
    bg: '#0b0f0e',
    surface: '#141a18',
    surface2: '#1c2421',
    border: 'rgba(255,255,255,0.06)',
    borderStrong: 'rgba(255,255,255,0.10)',
    text: '#e8efec',
    textDim: '#8a9692',
    textFaint: '#5b6662',
    accent: '#10b981',
    accentSoft: 'rgba(16,185,129,0.12)',
    accentStrong: '#34d399',
    up: '#10b981',
    down: '#f43f5e',
    upSoft: 'rgba(16,185,129,0.10)',
    downSoft: 'rgba(244,63,94,0.10)',
    chip: '#1c2421',
    chipActive: '#10b981',
    chipActiveText: '#0b0f0e',
    skeleton: '#1c2421',
    statusBarFg: '#ffffff',
    navFg: '#ffffff',
  },
  light: {
    bg: '#f7f9f8',
    surface: '#ffffff',
    surface2: '#eef2f0',
    border: 'rgba(10,20,18,0.06)',
    borderStrong: 'rgba(10,20,18,0.10)',
    text: '#0b1513',
    textDim: '#556661',
    textFaint: '#8a9692',
    accent: '#059669',
    accentSoft: 'rgba(5,150,105,0.10)',
    accentStrong: '#047857',
    up: '#059669',
    down: '#e11d48',
    upSoft: 'rgba(5,150,105,0.08)',
    downSoft: 'rgba(225,29,72,0.08)',
    chip: '#eef2f0',
    chipActive: '#059669',
    chipActiveText: '#ffffff',
    skeleton: '#eef2f0',
    statusBarFg: '#0b1513',
    navFg: '#0b1513',
  },
};

const FONT = `'Inter', -apple-system, 'Segoe UI', Roboto, system-ui, sans-serif`;
const FONT_MONO = `'JetBrains Mono', 'SF Mono', Menlo, monospace`;

// ---------------- ICONS ----------------
function Icon({ name, size = 20, color = 'currentColor', strokeWidth = 2 }) {
  const s = { width: size, height: size, stroke: color, fill: 'none', strokeWidth, strokeLinecap: 'round', strokeLinejoin: 'round' };
  const paths = {
    home: <><path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/></>,
    compare: <><path d="M7 3v14M7 17l-3-3M7 17l3-3"/><path d="M17 21V7M17 7l3 3M17 7l-3 3"/></>,
    bell: <><path d="M18 16v-5a6 6 0 10-12 0v5l-2 3h16l-2-3z"/><path d="M10 20a2 2 0 004 0"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z"/></>,
    search: <><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></>,
    back: <><path d="M15 18l-6-6 6-6"/></>,
    arrowUp: <><path d="M12 19V5M5 12l7-7 7 7"/></>,
    arrowDown: <><path d="M12 5v14M19 12l-7 7-7-7"/></>,
    plus: <><path d="M12 5v14M5 12h14"/></>,
    close: <><path d="M18 6L6 18M6 6l12 12"/></>,
    check: <><path d="M20 6L9 17l-5-5"/></>,
    swap: <><path d="M7 10h14l-4-4M17 14H3l4 4"/></>,
    chart: <><path d="M3 17l6-6 4 4 8-8"/><path d="M14 7h7v7"/></>,
    chevronRight: <><path d="M9 18l6-6-6-6"/></>,
    chevronDown: <><path d="M6 9l6 6 6-6"/></>,
    dot: <><circle cx="12" cy="12" r="4" fill={color} stroke="none"/></>,
    star: <><path d="M12 2l3.09 6.26 6.91 1-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.13 2 9.26l6.91-1L12 2z"/></>,
    globe: <><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 010 20M12 2a15 15 0 000 20"/></>,
    moon: <><path d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z"/></>,
    sun: <><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></>,
    trash: <><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/></>,
    filter: <><path d="M3 6h18M6 12h12M10 18h4"/></>,
    info: <><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></>,
  };
  return <svg viewBox="0 0 24 24" style={s}>{paths[name]}</svg>;
}

// ---------------- CURRENCY BADGE ----------------
// A small colored roundel used instead of real flags (no copyrighted assets)
function CurrencyBadge({ code, size = 40, t }) {
  const colors = {
    USD: ['#059669', '#10b981'],
    EUR: ['#3b82f6', '#60a5fa'],
    MLC: ['#8b5cf6', '#a78bfa'],
    ZELLE: ['#a855f7', '#c084fc'],
    CAD: ['#ef4444', '#f87171'],
    BRL: ['#eab308', '#facc15'],
    MXN: ['#14b8a6', '#2dd4bf'],
    GBP: ['#6366f1', '#818cf8'],
    CHF: ['#dc2626', '#ef4444'],
    CLA: ['#0ea5e9', '#38bdf8'],
    TROP: ['#f59e0b', '#fbbf24'],
  };
  const [c1, c2] = colors[code] || ['#64748b', '#94a3b8'];
  const label = code === 'ZELLE' ? 'Z' : code === 'TROP' ? 'TP' : code.slice(0, 3);
  const fontSize = size * (label.length >= 3 ? 0.32 : 0.42);
  return (
    <div style={{
      width: size, height: size, borderRadius: size * 0.3,
      background: `linear-gradient(135deg, ${c1}, ${c2})`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#fff', fontWeight: 700, fontSize,
      fontFamily: FONT, letterSpacing: -0.5,
      flexShrink: 0,
    }}>{label}</div>
  );
}

// ---------------- SPARKLINE ----------------
function Sparkline({ data, width = 72, height = 28, color = '#10b981', fill = 'rgba(16,185,129,0.15)' }) {
  if (!data || data.length < 2) return null;
  const vals = data.map(d => (d.compra + d.venda) / 2);
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const range = max - min || 1;
  const pts = vals.map((v, i) => {
    const x = (i / (vals.length - 1)) * width;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return [x, y];
  });
  const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
  const area = `${line} L${width},${height} L0,${height} Z`;
  return (
    <svg width={width} height={height} style={{ display: 'block' }}>
      <path d={area} fill={fill} />
      <path d={line} stroke={color} strokeWidth={1.6} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ---------------- AREA CHART (big) ----------------
function AreaChart({ data, width = 360, height = 200, theme, showDots = false, side = 'venda', hover = null, onHover }) {
  if (!data || data.length < 2) return null;
  const vals = data.map(d => side === 'both' ? (d.compra + d.venda) / 2 : d[side]);
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const range = max - min || 1;
  const padY = 20;
  const padX = 8;
  const innerW = width - padX * 2;
  const innerH = height - padY * 2;

  const pts = vals.map((v, i) => {
    const x = padX + (i / (vals.length - 1)) * innerW;
    const y = padY + innerH - ((v - min) / range) * innerH;
    return [x, y];
  });
  const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(2)},${p[1].toFixed(2)}`).join(' ');
  const area = `${line} L${pts[pts.length-1][0]},${height} L${pts[0][0]},${height} Z`;
  const gradId = `grad-${Math.random().toString(36).slice(2, 9)}`;

  // horizontal gridlines
  const lines = [0.25, 0.5, 0.75].map(r => padY + innerH * r);

  return (
    <svg width={width} height={height} style={{ display: 'block', touchAction: 'none' }}
      onMouseMove={(e) => {
        if (!onHover) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const i = Math.max(0, Math.min(data.length - 1, Math.round(((x - padX) / innerW) * (data.length - 1))));
        onHover(i);
      }}
      onMouseLeave={() => onHover && onHover(null)}
    >
      <defs>
        <linearGradient id={gradId} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={theme.accent} stopOpacity="0.28"/>
          <stop offset="100%" stopColor={theme.accent} stopOpacity="0"/>
        </linearGradient>
      </defs>
      {lines.map((y, i) => (
        <line key={i} x1={padX} x2={width - padX} y1={y} y2={y} stroke={theme.border} strokeDasharray="2 4"/>
      ))}
      <path d={area} fill={`url(#${gradId})`} />
      <path d={line} stroke={theme.accent} strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      {hover !== null && pts[hover] && (
        <g>
          <line x1={pts[hover][0]} x2={pts[hover][0]} y1={padY} y2={height - padY}
            stroke={theme.textDim} strokeDasharray="2 3" strokeWidth={1}/>
          <circle cx={pts[hover][0]} cy={pts[hover][1]} r="6" fill={theme.bg} stroke={theme.accent} strokeWidth="2"/>
        </g>
      )}
    </svg>
  );
}

// ---------------- PULSE DOT ----------------
function PulseDot({ color = '#10b981', size = 8 }) {
  return (
    <span style={{
      position: 'relative', display: 'inline-block',
      width: size, height: size,
    }}>
      <span style={{
        position: 'absolute', inset: 0, borderRadius: '50%',
        background: color, animation: 'pulse 2s ease-out infinite',
      }}/>
      <span style={{
        position: 'absolute', inset: 0, borderRadius: '50%',
        background: color,
      }}/>
    </span>
  );
}

// ---------------- UTILITIES ----------------
function formatCUP(n, decimals = 2) {
  if (n == null || isNaN(n)) return '—';
  return new Intl.NumberFormat('es-ES', {
    minimumFractionDigits: decimals, maximumFractionDigits: decimals,
  }).format(n);
}

function pctChange(curr, prev) {
  if (!prev) return 0;
  return ((curr - prev) / prev) * 100;
}

function formatDatetimeShort(datetimeStr) {
  if (!datetimeStr) return '–';
  const d = new Date(datetimeStr.replace(' ', 'T'));
  if (isNaN(d)) return '–';
  const hh = d.getHours().toString().padStart(2, '0');
  const mm = d.getMinutes().toString().padStart(2, '0');
  const todayStr = new Date().toISOString().slice(0, 10);
  const entryStr = datetimeStr.slice(0, 10);
  if (entryStr === todayStr) return `${hh}:${mm}`;
  const months = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
  return `${d.getDate()} ${months[d.getMonth()]} ${hh}:${mm}`;
}

function formatPct(p) {
  const sign = p > 0 ? '+' : '';
  return `${sign}${p.toFixed(2)}%`;
}

Object.assign(window, {
  THEMES, FONT, FONT_MONO,
  Icon, CurrencyBadge, Sparkline, AreaChart, PulseDot,
  formatCUP, pctChange, formatPct, formatDatetimeShort,
});
