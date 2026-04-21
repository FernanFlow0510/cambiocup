// Main App — Cambio CUP
// Bilingual (ES/PT) price monitor for Cuban fiat exchange rates.

const { useState, useEffect } = React;

function App() {
  const TWEAKS = /*EDITMODE-BEGIN*/{
    "theme": "dark",
    "lang": "es",
    "accent": "#10b981",
    "variant": "standard"
  }/*EDITMODE-END*/;

  const [themeName, setThemeName] = useState(() => localStorage.getItem('cc_theme') || TWEAKS.theme);
  const [lang, setLang] = useState(() => localStorage.getItem('cc_lang') || TWEAKS.lang);
  const [accent, setAccent] = useState(() => localStorage.getItem('cc_accent') || TWEAKS.accent);
  const [variant, setVariant] = useState(() => localStorage.getItem('cc_variant') || TWEAKS.variant);
  const [editMode, setEditMode] = useState(false);

  const [screen, setScreen] = useState(() => localStorage.getItem('cc_screen') || 'home');
  const [detailCode, setDetailCode] = useState(() => localStorage.getItem('cc_detail') || 'USD');
  const [dataStatus, setDataStatus] = useState('mock'); // 'mock' | 'loading' | 'live' | 'error'
  const [, forceRerender] = useState(0);

  // Load remote data on mount and every 60s
  useEffect(() => {
    if (typeof window.loadRemoteData !== 'function') return;
    let cancelled = false;
    const tick = async () => {
      if (!window.getDataUrl()) { setDataStatus('mock'); return; }
      setDataStatus('loading');
      const res = await window.loadRemoteData();
      if (cancelled) return;
      if (res.ok) { setDataStatus('live'); forceRerender(n => n + 1); }
      else setDataStatus(res.reason === 'no-url' ? 'mock' : 'error');
    };
    tick();
    const id = setInterval(tick, 60000);
    return () => { cancelled = true; clearInterval(id); };
  }, []);

  // Base theme, then override accent
  const baseTheme = THEMES[themeName] || THEMES.dark;
  const theme = React.useMemo(() => ({
    ...baseTheme,
    accent,
    accentSoft: hexToRgba(accent, 0.12),
    accentStrong: accent,
    up: accent,
    upSoft: hexToRgba(accent, 0.10),
    chipActive: accent,
  }), [baseTheme, accent]);

  const t = I18N[lang];

  // persist
  useEffect(() => localStorage.setItem('cc_theme', themeName), [themeName]);
  useEffect(() => localStorage.setItem('cc_lang', lang), [lang]);
  useEffect(() => localStorage.setItem('cc_accent', accent), [accent]);
  useEffect(() => localStorage.setItem('cc_variant', variant), [variant]);
  useEffect(() => localStorage.setItem('cc_screen', screen), [screen]);
  useEffect(() => localStorage.setItem('cc_detail', detailCode), [detailCode]);

  // Edit mode hookup
  useEffect(() => {
    const handler = (e) => {
      if (!e.data || !e.data.type) return;
      if (e.data.type === '__activate_edit_mode') setEditMode(true);
      if (e.data.type === '__deactivate_edit_mode') setEditMode(false);
    };
    window.addEventListener('message', handler);
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', handler);
  }, []);

  function persistTweak(edits) {
    window.parent.postMessage({ type: '__edit_mode_set_keys', edits }, '*');
  }

  // Render active screen
  let content;
  if (screen === 'home') {
    content = <HomeScreen theme={theme} t={t} lang={lang}
      onSelect={(code) => { setDetailCode(code); setScreen('detail'); }}
      onNav={setScreen}/>;
  } else if (screen === 'detail') {
    content = <DetailScreen code={detailCode} theme={theme} t={t} lang={lang}
      onBack={() => setScreen('home')}
      onCompare={() => setScreen('compare')}
      onAlert={() => setScreen('alerts')}/>;
  } else if (screen === 'compare') {
    content = <CompareScreen theme={theme} t={t} lang={lang}/>;
  } else if (screen === 'alerts') {
    content = <AlertsScreen theme={theme} t={t} lang={lang}/>;
  } else if (screen === 'settings') {
    content = <SettingsScreen theme={theme} themeName={themeName}
      setThemeName={(v) => { setThemeName(v); persistTweak({theme: v}); }}
      lang={lang} setLang={(v) => { setLang(v); persistTweak({lang: v}); }}
      accent={accent} setAccent={(v) => { setAccent(v); persistTweak({accent: v}); }}
      dataStatus={dataStatus}
      t={t}/>;
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#0a0a0a',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px', fontFamily: FONT,
      gap: 24,
    }}>
      <Phone theme={theme} themeName={themeName} screen={screen} setScreen={setScreen} t={t} lang={lang}>
        {content}
      </Phone>

      {editMode && (
        <TweaksPanel theme={theme}
          themeName={themeName} setThemeName={(v) => { setThemeName(v); persistTweak({theme: v}); }}
          lang={lang} setLang={(v) => { setLang(v); persistTweak({lang: v}); }}
          accent={accent} setAccent={(v) => { setAccent(v); persistTweak({accent: v}); }}
          variant={variant} setVariant={(v) => { setVariant(v); persistTweak({variant: v}); }}
        />
      )}
    </div>
  );
}

function hexToRgba(hex, alpha) {
  const m = hex.replace('#', '');
  const n = m.length === 3
    ? m.split('').map(x => parseInt(x + x, 16))
    : [parseInt(m.slice(0,2),16), parseInt(m.slice(2,4),16), parseInt(m.slice(4,6),16)];
  return `rgba(${n[0]},${n[1]},${n[2]},${alpha})`;
}

// ============ PHONE SHELL ============
function Phone({ theme, themeName, screen, setScreen, t, lang, children }) {
  const dark = themeName === 'dark';
  return (
    <div style={{
      width: 412, height: 892, borderRadius: 44,
      background: theme.bg,
      border: `8px solid rgba(116,119,117,0.4)`,
      boxShadow: '0 40px 100px rgba(0,0,0,0.6), 0 0 0 2px rgba(255,255,255,0.03) inset',
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
      position: 'relative',
    }} data-screen-label={`Cambio CUP · ${screen}`}>
      {/* Status bar */}
      <div style={{
        height: 40, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 20px', color: theme.statusBarFg, flexShrink: 0,
        fontFamily: FONT, fontSize: 14, fontWeight: 600,
        position: 'relative', zIndex: 2, background: theme.bg,
      }}>
        <span style={{ fontVariantNumeric: 'tabular-nums' }}>9:41</span>
        <div style={{
          position: 'absolute', left: '50%', top: 8, transform: 'translateX(-50%)',
          width: 22, height: 22, borderRadius: 11, background: '#000',
        }}/>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          {/* signal */}
          <svg width="16" height="12" viewBox="0 0 16 12">
            <rect x="0" y="8" width="3" height="4" rx="0.5" fill={theme.statusBarFg}/>
            <rect x="4" y="5" width="3" height="7" rx="0.5" fill={theme.statusBarFg}/>
            <rect x="8" y="2" width="3" height="10" rx="0.5" fill={theme.statusBarFg}/>
            <rect x="12" y="0" width="3" height="12" rx="0.5" fill={theme.statusBarFg} opacity="0.4"/>
          </svg>
          {/* wifi */}
          <svg width="16" height="12" viewBox="0 0 16 12">
            <path d="M8 11a1 1 0 100-2 1 1 0 000 2zM2 5a10 10 0 0112 0M4.5 7.5a6 6 0 017 0" stroke={theme.statusBarFg} strokeWidth="1.3" fill="none" strokeLinecap="round"/>
          </svg>
          {/* battery */}
          <div style={{
            width: 24, height: 12, borderRadius: 3,
            border: `1.2px solid ${theme.statusBarFg}`, padding: 1, position: 'relative',
          }}>
            <div style={{ width: '75%', height: '100%', background: theme.statusBarFg, borderRadius: 1 }}/>
            <div style={{
              position: 'absolute', right: -3, top: 3, width: 2, height: 4,
              background: theme.statusBarFg, borderRadius: 1,
            }}/>
          </div>
        </div>
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, overflow: 'auto', position: 'relative' }}>
        {children}
      </div>

      {/* Bottom nav */}
      <BottomNav theme={theme} screen={screen} setScreen={setScreen} t={t}/>

      {/* Home indicator */}
      <div style={{
        height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: theme.bg, flexShrink: 0,
      }}>
        <div style={{
          width: 120, height: 4, borderRadius: 2,
          background: theme.navFg, opacity: 0.35,
        }}/>
      </div>
    </div>
  );
}

function BottomNav({ theme, screen, setScreen, t }) {
  const items = [
    { k: 'home', l: t.home, icon: 'home' },
    { k: 'compare', l: t.compare, icon: 'compare' },
    { k: 'alerts', l: t.alerts, icon: 'bell' },
    { k: 'settings', l: t.settings, icon: 'settings' },
  ];
  const isDetail = screen === 'detail';
  return (
    <div style={{
      borderTop: `1px solid ${theme.border}`,
      background: theme.bg,
      padding: '8px 8px 6px', flexShrink: 0,
      display: 'flex', justifyContent: 'space-around',
    }}>
      {items.map(it => {
        const active = screen === it.k || (it.k === 'home' && isDetail);
        return (
          <button key={it.k} onClick={() => setScreen(it.k)} style={{
            flex: 1, padding: '6px 4px', background: 'transparent', border: 'none',
            cursor: 'pointer', display: 'flex', flexDirection: 'column',
            alignItems: 'center', gap: 3,
          }}>
            <div style={{
              width: 56, height: 28, borderRadius: 14,
              background: active ? theme.accentSoft : 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: active ? theme.accent : theme.textDim,
              transition: 'all 0.15s',
            }}>
              <Icon name={it.icon} size={20} strokeWidth={active ? 2.4 : 2}/>
            </div>
            <span style={{
              fontSize: 10, fontWeight: active ? 700 : 500,
              color: active ? theme.accent : theme.textDim, letterSpacing: 0.2,
            }}>{it.l}</span>
          </button>
        );
      })}
    </div>
  );
}

// ============ TWEAKS PANEL ============
function TweaksPanel({ theme, themeName, setThemeName, lang, setLang, accent, setAccent, variant, setVariant }) {
  return (
    <div style={{
      width: 260, padding: 18, borderRadius: 20,
      background: '#141a18', border: '1px solid rgba(255,255,255,0.08)',
      color: '#e8efec', fontFamily: FONT,
      boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
      alignSelf: 'flex-start', marginTop: 20,
    }}>
      <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14, letterSpacing: -0.2 }}>Tweaks</div>

      <TweakLabel>Theme</TweakLabel>
      <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
        {['dark', 'light'].map(k => (
          <button key={k} onClick={() => setThemeName(k)} style={{
            flex: 1, padding: '8px', borderRadius: 8,
            background: themeName === k ? accent : 'rgba(255,255,255,0.05)',
            color: themeName === k ? '#000' : '#e8efec',
            border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600,
            textTransform: 'capitalize',
          }}>{k}</button>
        ))}
      </div>

      <TweakLabel>Language</TweakLabel>
      <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
        {[['es', 'Español'], ['pt', 'Português']].map(([k, l]) => (
          <button key={k} onClick={() => setLang(k)} style={{
            flex: 1, padding: '8px', borderRadius: 8,
            background: lang === k ? accent : 'rgba(255,255,255,0.05)',
            color: lang === k ? '#000' : '#e8efec',
            border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: 600,
          }}>{l}</button>
        ))}
      </div>

      <TweakLabel>Accent</TweakLabel>
      <div style={{ display: 'flex', gap: 8, marginBottom: 4, justifyContent: 'space-between' }}>
        {['#10b981', '#3b82f6', '#f59e0b', '#a855f7', '#ef4444'].map(col => (
          <button key={col} onClick={() => setAccent(col)} style={{
            width: 34, height: 34, borderRadius: 17, background: col,
            border: accent === col ? '3px solid #fff' : '3px solid transparent',
            cursor: 'pointer', padding: 0,
          }}/>
        ))}
      </div>
    </div>
  );
}

function TweakLabel({ children }) {
  return (
    <div style={{
      fontSize: 10, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase',
      color: 'rgba(255,255,255,0.5)', marginBottom: 8,
    }}>{children}</div>
  );
}

// Mount
ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
