// Screens for Cambio CUP — Home, Detail, Compare, Stats, Alerts, Settings

// ============ HOME / DASHBOARD ============
function HomeScreen({ theme, t, lang, onSelect, onNav }) {
  const [search, setSearch] = React.useState('');
  const [convFrom, setConvFrom] = React.useState('USD');
  const [convAmount, setConvAmount] = React.useState(100);
  const [sort, setSort] = React.useState('default'); // default | change | alpha

  const filtered = CURRENCIES.filter(c =>
    !search || c.code.toLowerCase().includes(search.toLowerCase()) ||
    (lang === 'es' ? c.name_es : c.name_pt).toLowerCase().includes(search.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) => {
    if (sort === 'change') {
      return Math.abs(pctChange(b.venda, b.prev_venda)) - Math.abs(pctChange(a.venda, a.prev_venda));
    }
    if (sort === 'alpha') return a.code.localeCompare(b.code);
    return 0;
  });

  const convCurrency = CURRENCIES.find(c => c.code === convFrom);
  const convResult = convAmount * ((convCurrency.compra + convCurrency.venda) / 2);

  const activeCount = CURRENCIES.filter(c => c.active).length;

  const globalLastRaw = CURRENCIES.reduce((best, c) => {
    if (!c.lastDatetimeRaw) return best;
    return (!best || c.lastDatetimeRaw > best) ? c.lastDatetimeRaw : best;
  }, null);
  const globalLastDisplay = globalLastRaw ? formatDatetimeShort(globalLastRaw) : '–';

  return (
    <div style={{ padding: '8px 0 120px', background: theme.bg }}>
      {/* Greeting + live pill */}
      <div style={{ padding: '12px 20px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 13, color: theme.textDim, fontWeight: 500, letterSpacing: 0.2 }}>
            {lang === 'es' ? 'Mercado informal Cuba' : 'Mercado informal Cuba'}
          </div>
          <div style={{ fontSize: 26, fontWeight: 700, color: theme.text, letterSpacing: -0.6, marginTop: 2 }}>
            {t.app_name}
          </div>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '6px 10px 6px 8px', borderRadius: 999,
          background: theme.accentSoft, border: `1px solid ${theme.accentSoft}`,
        }}>
          <PulseDot color={theme.accent} size={7}/>
          <span style={{ fontSize: 11, color: theme.accent, fontWeight: 600, letterSpacing: 0.4, textTransform: 'uppercase' }}>
            {t.live}
          </span>
        </div>
      </div>

      {/* Stat strip */}
      <div style={{ padding: '0 20px 16px', display: 'flex', gap: 10 }}>
        <StatPill theme={theme} label={t.total_tracked} value={`${activeCount}/${CURRENCIES.length}`} mono/>
        <StatPill theme={theme} label={lang === 'es' ? 'última señal' : 'último sinal'} value={globalLastDisplay} accent/>
      </div>

      {/* Quick converter card */}
      <div style={{ padding: '0 20px 20px' }}>
        <div style={{
          background: theme.surface, borderRadius: 20, padding: 16,
          border: `1px solid ${theme.border}`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div style={{ fontSize: 12, color: theme.textDim, fontWeight: 600, letterSpacing: 0.4, textTransform: 'uppercase' }}>
              {t.converter}
            </div>
            <Icon name="swap" size={16} color={theme.textDim}/>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: theme.textFaint, marginBottom: 4 }}>{t.amount}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input
                  type="number" value={convAmount}
                  onChange={(e) => setConvAmount(parseFloat(e.target.value) || 0)}
                  style={{
                    flex: 1, minWidth: 0, background: 'transparent', border: 'none', outline: 'none',
                    fontSize: 28, fontWeight: 700, color: theme.text, fontFamily: FONT_MONO,
                    letterSpacing: -1, padding: 0,
                  }}
                />
                <CurrencySelector theme={theme} value={convFrom} onChange={setConvFrom}/>
              </div>
            </div>
          </div>
          <div style={{ height: 1, background: theme.border, margin: '14px 0' }}/>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 11, color: theme.textFaint, marginBottom: 4 }}>{t.you_get}</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: theme.accent, fontFamily: FONT_MONO, letterSpacing: -1 }}>
                {formatCUP(convResult, 0)}
              </div>
              <div style={{ fontSize: 11, color: theme.textDim, marginTop: 2 }}>CUP · Cuban Peso</div>
            </div>
            <div style={{
              fontSize: 11, color: theme.textDim, fontFamily: FONT_MONO,
              textAlign: 'right', lineHeight: 1.5,
            }}>
              1 {convFrom} ≈<br/>
              <span style={{ color: theme.text, fontSize: 14, fontWeight: 600 }}>
                {formatCUP((convCurrency.compra + convCurrency.venda) / 2, 2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Search + sort */}
      <div style={{ padding: '0 20px 12px', display: 'flex', gap: 8 }}>
        <div style={{
          flex: 1, display: 'flex', alignItems: 'center', gap: 8,
          padding: '10px 14px', borderRadius: 12, background: theme.surface,
          border: `1px solid ${theme.border}`,
        }}>
          <Icon name="search" size={16} color={theme.textDim}/>
          <input
            value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder={t.search}
            style={{
              flex: 1, background: 'transparent', border: 'none', outline: 'none',
              fontSize: 14, color: theme.text, fontFamily: FONT,
            }}
          />
        </div>
        <button onClick={() => {
          const next = { default: 'change', change: 'alpha', alpha: 'default' }[sort];
          setSort(next);
        }} style={{
          width: 44, height: 44, borderRadius: 12, background: theme.surface,
          border: `1px solid ${theme.border}`, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: sort !== 'default' ? theme.accent : theme.textDim,
        }}>
          <Icon name="filter" size={18}/>
        </button>
      </div>

      {/* All currencies list header */}
      <div style={{
        padding: '8px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ fontSize: 12, color: theme.textDim, fontWeight: 600, letterSpacing: 0.4, textTransform: 'uppercase' }}>
          {t.all_currencies} · {sorted.length}
        </div>
      </div>

      {/* Currency cards */}
      <div style={{ padding: '0 16px' }}>
        {sorted.map((c, i) => (
          <CurrencyCard key={c.code} c={c} theme={theme} t={t} lang={lang} onClick={() => onSelect(c.code)}/>
        ))}
      </div>
    </div>
  );
}

function StatPill({ theme, label, value, accent, mono }) {
  return (
    <div style={{
      flex: 1, padding: '10px 14px', borderRadius: 12,
      background: theme.surface, border: `1px solid ${theme.border}`,
    }}>
      <div style={{ fontSize: 10, color: theme.textFaint, fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase' }}>
        {label}
      </div>
      <div style={{
        fontSize: 16, fontWeight: 700, color: accent ? theme.accent : theme.text,
        fontFamily: mono ? FONT_MONO : FONT, marginTop: 2, letterSpacing: -0.3,
      }}>{value}</div>
    </div>
  );
}

function CurrencySelector({ theme, value, onChange }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div style={{ position: 'relative' }}>
      <button onClick={() => setOpen(!open)} style={{
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '8px 10px', borderRadius: 10,
        background: theme.surface2, border: `1px solid ${theme.border}`, cursor: 'pointer',
      }}>
        <CurrencyBadge code={value} size={22}/>
        <span style={{ fontSize: 14, fontWeight: 600, color: theme.text }}>{value}</span>
        <Icon name="chevronDown" size={14} color={theme.textDim}/>
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)', right: 0, zIndex: 10,
          background: theme.surface, border: `1px solid ${theme.borderStrong}`,
          borderRadius: 12, padding: 6, minWidth: 180,
          boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
          maxHeight: 280, overflowY: 'auto',
        }}>
          {CURRENCIES.map(c => (
            <button key={c.code} onClick={() => { onChange(c.code); setOpen(false); }}
              style={{
                display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                padding: '8px 10px', borderRadius: 8, border: 'none',
                background: value === c.code ? theme.accentSoft : 'transparent',
                color: theme.text, cursor: 'pointer', textAlign: 'left',
              }}>
              <CurrencyBadge code={c.code} size={22}/>
              <span style={{ fontSize: 13, fontWeight: 600 }}>{c.code}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function CurrencyCard({ c, theme, t, lang, onClick, compact = false }) {
  const pct = pctChange(c.venda, c.prev_venda);
  const up = pct >= 0;
  const isToday = c.lastDatetimeRaw
    ? c.lastDatetimeRaw.slice(0, 10) === new Date().toISOString().slice(0, 10)
    : false;
  const dateLabel = c.lastDatetimeRaw ? formatDatetimeShort(c.lastDatetimeRaw) : null;
  return (
    <div onClick={onClick} style={{
      background: theme.surface, borderRadius: 16, padding: 14, marginBottom: 8,
      border: `1px solid ${theme.border}`,
      display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer',
      transition: 'transform 0.1s',
    }}>
      <CurrencyBadge code={c.code} size={44}/>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: theme.text, letterSpacing: -0.2 }}>{c.code}</span>
          {c.active && <PulseDot color={theme.accent} size={5}/>}
        </div>
        <div style={{ fontSize: 12, color: theme.textDim, marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {lang === 'es' ? c.name_es : c.name_pt}
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
          <PriceBlock theme={theme} label={t.buy} value={c.compra} size="sm"/>
          <PriceBlock theme={theme} label={t.sell} value={c.venda} size="sm"/>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
        <Sparkline data={c.history.slice(-30)} width={60} height={24}
          color={up ? theme.up : theme.down}
          fill={up ? theme.upSoft : theme.downSoft}/>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 2,
          padding: '3px 7px', borderRadius: 6,
          background: up ? theme.upSoft : theme.downSoft,
          color: up ? theme.up : theme.down,
          fontSize: 11, fontWeight: 700, fontFamily: FONT_MONO,
        }}>
          <Icon name={up ? 'arrowUp' : 'arrowDown'} size={10} strokeWidth={2.5}/>
          {formatPct(Math.abs(pct))}
        </div>
        {dateLabel && (
          <div style={{
            fontSize: 9, fontFamily: FONT_MONO, letterSpacing: 0.2,
            color: isToday ? theme.textFaint : theme.down,
            fontWeight: isToday ? 500 : 700,
          }}>
            {dateLabel}
          </div>
        )}
      </div>
    </div>
  );
}

function PriceBlock({ theme, label, value, size = 'md' }) {
  const fs = size === 'sm' ? 13 : size === 'lg' ? 24 : 16;
  return (
    <div>
      <div style={{ fontSize: 9, color: theme.textFaint, fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase' }}>
        {label}
      </div>
      <div style={{ fontSize: fs, fontWeight: 700, color: theme.text, fontFamily: FONT_MONO, letterSpacing: -0.3 }}>
        {formatCUP(value, 2)}
      </div>
    </div>
  );
}

// ============ DETAIL SCREEN ============
function DetailScreen({ code, theme, t, lang, onBack, onCompare, onAlert }) {
  const c = CURRENCIES.find(x => x.code === code);
  const [period, setPeriod] = React.useState('1M');
  const [side, setSide] = React.useState('venda'); // compra | venda | both
  const [hover, setHover] = React.useState(null);

  const days = { '7D': 7, '1M': 30, '3M': 60, '6M': 90, '1A': 90 }[period] || 30;
  const data = c.history.slice(-days);
  const vals = data.map(d => d[side === 'both' ? 'venda' : side]);
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
  const first = vals[0];
  const last = vals[vals.length - 1];
  const change = ((last - first) / first) * 100;
  const volatility = Math.sqrt(vals.reduce((a, v) => a + Math.pow(v - avg, 2), 0) / vals.length);

  const pct = pctChange(c.venda, c.prev_venda);
  const up = pct >= 0;

  const hoverVal = hover !== null ? vals[hover] : null;
  const hoverDate = hover !== null ? data[hover].d : null;

  return (
    <div style={{ background: theme.bg, padding: '0 0 120px' }}>
      {/* App bar */}
      <div style={{
        display: 'flex', alignItems: 'center', padding: '12px 16px',
        position: 'sticky', top: 0, background: theme.bg, zIndex: 5,
      }}>
        <button onClick={onBack} style={{
          width: 40, height: 40, borderRadius: 20, background: theme.surface,
          border: `1px solid ${theme.border}`, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: theme.text,
        }}>
          <Icon name="back" size={18}/>
        </button>
        <div style={{ flex: 1 }}/>
        <button style={{
          width: 40, height: 40, borderRadius: 20, background: theme.surface,
          border: `1px solid ${theme.border}`, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: theme.text,
        }}>
          <Icon name="star" size={18}/>
        </button>
      </div>

      {/* Header */}
      <div style={{ padding: '8px 20px 20px', display: 'flex', gap: 14, alignItems: 'center' }}>
        <CurrencyBadge code={c.code} size={56}/>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: theme.text, letterSpacing: -0.5 }}>{c.code}</div>
          <div style={{ fontSize: 13, color: theme.textDim, marginTop: 2 }}>
            {lang === 'es' ? c.name_es : c.name_pt}
          </div>
        </div>
      </div>

      {/* Big price */}
      <div style={{ padding: '0 20px 18px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span style={{ fontSize: 11, color: theme.textFaint, fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase' }}>
            {side === 'compra' ? t.buy : side === 'venda' ? t.sell : t.avg}
          </span>
          {c.active && <PulseDot color={theme.accent} size={6}/>}
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 2 }}>
          <span style={{
            fontSize: 42, fontWeight: 700, color: theme.text, fontFamily: FONT_MONO,
            letterSpacing: -1.5,
          }}>
            {formatCUP(hoverVal ?? (side === 'both' ? (c.compra + c.venda)/2 : c[side]), 2)}
          </span>
          <span style={{ fontSize: 16, color: theme.textDim, fontWeight: 500 }}>CUP</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 6 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 3,
            padding: '3px 8px', borderRadius: 6,
            background: up ? theme.upSoft : theme.downSoft,
            color: up ? theme.up : theme.down,
            fontSize: 12, fontWeight: 700, fontFamily: FONT_MONO,
          }}>
            <Icon name={up ? 'arrowUp' : 'arrowDown'} size={11} strokeWidth={2.5}/>
            {formatPct(Math.abs(pct))} {t.vs_yesterday}
          </div>
          {hoverDate && (
            <span style={{ fontSize: 11, color: theme.textDim, fontFamily: FONT_MONO }}>
              {hoverDate}
            </span>
          )}
        </div>
      </div>

      {/* Chart */}
      <div style={{ padding: '0 4px 12px' }}>
        <AreaChart data={data} width={380} height={200} theme={theme} side={side === 'both' ? 'venda' : side}
          hover={hover} onHover={setHover}/>
      </div>

      {/* Side switcher */}
      <div style={{ padding: '0 20px 12px', display: 'flex', gap: 6 }}>
        {[['compra', t.buy], ['venda', t.sell], ['both', t.avg]].map(([k, l]) => (
          <button key={k} onClick={() => setSide(k)} style={{
            flex: 1, padding: '8px 10px', borderRadius: 10,
            background: side === k ? theme.accentSoft : theme.surface,
            border: `1px solid ${side === k ? theme.accent : theme.border}`,
            color: side === k ? theme.accent : theme.text,
            fontSize: 12, fontWeight: 600, cursor: 'pointer',
          }}>{l}</button>
        ))}
      </div>

      {/* Period selector */}
      <div style={{ padding: '0 20px 20px', display: 'flex', gap: 6, justifyContent: 'space-between' }}>
        {['7D', '1M', '3M', '6M', '1A'].map(p => (
          <button key={p} onClick={() => setPeriod(p)} style={{
            flex: 1, padding: '8px 0', borderRadius: 8,
            background: period === p ? theme.chipActive : 'transparent',
            border: 'none',
            color: period === p ? theme.chipActiveText : theme.textDim,
            fontSize: 12, fontWeight: 700, cursor: 'pointer',
            fontFamily: FONT_MONO,
          }}>{p}</button>
        ))}
      </div>

      {/* Preço principal (mediana EWMA) + contexto do dia */}
      <div style={{ padding: '0 20px 16px' }}>
        <BigPriceCard theme={theme} label={t.buy} value={c.compra} prev={c.prev_compra} color={theme.accent}/>
        {(() => {
          const last = c.history?.[c.history.length - 1];
          if (!last) return null;
          const hasRange = last.day_min != null && last.day_max != null;
          const n = last.n ?? 0;
          return (
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              {hasRange && (
                <InfoTile theme={theme}
                  label={lang === 'es' ? 'Rango hoy' : 'Intervalo hoje'}
                  value={`${formatCUP(last.day_min, 0)} – ${formatCUP(last.day_max, 0)}`}/>
              )}
              <InfoTile theme={theme}
                label={lang === 'es' ? 'Reportes' : 'Reportes'}
                value={n > 0 ? String(n) : '—'}/>
            </div>
          );
        })()}
      </div>

      {/* Statistics section */}
      <SectionHeader theme={theme} title={`${t.statistics} · ${period}`}/>
      <div style={{ padding: '0 20px 16px' }}>
        <div style={{
          background: theme.surface, borderRadius: 16, padding: 4,
          border: `1px solid ${theme.border}`,
          display: 'grid', gridTemplateColumns: '1fr 1fr',
        }}>
          <StatRow theme={theme} label={t.min} value={formatCUP(min, 2)} border="right-bottom"/>
          <StatRow theme={theme} label={t.max} value={formatCUP(max, 2)} border="bottom"/>
          <StatRow theme={theme} label={t.avg} value={formatCUP(avg, 2)} border="right-bottom"/>
          <StatRow theme={theme} label={t.range} value={formatCUP(max - min, 2)} border="bottom"/>
          <StatRow theme={theme} label={t.change_30d} value={formatPct(change)}
            valueColor={change >= 0 ? theme.up : theme.down} border="right"/>
          <StatRow theme={theme} label={t.volatility} value={`±${volatility.toFixed(2)}`}/>
        </div>
      </div>

      {/* Intervalo de confiança do último dia */}
      {(() => {
        const last = c.history[c.history.length - 1];
        if (!last || last.ci_low == null || last.ci_high == null) return null;
        const n = last.n ?? 0;
        const width = last.ci_high - last.ci_low;
        return (
          <div style={{ padding: '0 20px 16px' }}>
            <div style={{
              background: theme.surface, borderRadius: 16, padding: '12px 16px',
              border: `1px solid ${theme.border}`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ color: theme.textDim, fontSize: 12, fontWeight: 600 }}>
                  {t.confidence}
                </span>
                <span style={{ color: theme.textDim, fontSize: 12 }}>
                  {t.observations}: {n}
                </span>
              </div>
              {/* Barra CI */}
              <div style={{ position: 'relative', height: 8, borderRadius: 4, background: theme.border }}>
                <div style={{
                  position: 'absolute',
                  left: 0, right: 0, top: 0, bottom: 0,
                  borderRadius: 4,
                  background: `linear-gradient(90deg, ${theme.accentSoft}, ${theme.accent}88, ${theme.accentSoft})`,
                }}/>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                <span style={{ color: theme.text, fontSize: 12, fontFamily: 'JetBrains Mono, monospace' }}>
                  {formatCUP(last.ci_low, 0)}
                </span>
                <span style={{ color: theme.textDim, fontSize: 11 }}>±{(width / 2).toFixed(0)}</span>
                <span style={{ color: theme.text, fontSize: 12, fontFamily: 'JetBrains Mono, monospace' }}>
                  {formatCUP(last.ci_high, 0)}
                </span>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Spread + sources */}
      <div style={{ padding: '0 20px 16px', display: 'flex', gap: 10 }}>
        <InfoTile theme={theme} label={t.spread} value={`${(c.venda - c.compra).toFixed(2)} CUP`}/>
        <InfoTile theme={theme} label={t.sources} value={`${c.sources}/4`}/>
        <InfoTile theme={theme} label={t.last_updated} value={c.lastUpdate}/>
      </div>

      {/* History feed */}
      <SectionHeader theme={theme} title={t.history}/>
      <div style={{ padding: '0 20px 20px' }}>
        <div style={{
          background: theme.surface, borderRadius: 16,
          border: `1px solid ${theme.border}`, overflow: 'hidden',
        }}>
          {data.slice(-6).reverse().map((d, i) => {
            const prev = data[data.length - 1 - i - 1];
            const delta = prev ? ((d.venda - prev.venda) / prev.venda) * 100 : 0;
            return (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', padding: '12px 14px',
                borderBottom: i < 5 ? `1px solid ${theme.border}` : 'none',
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: theme.text, fontWeight: 500, fontFamily: FONT_MONO }}>
                    {d.d}
                  </div>
                  <div style={{ fontSize: 11, color: theme.textFaint, marginTop: 2 }}>
                    {t.buy} {formatCUP(d.compra, 2)} · {t.sell} {formatCUP(d.venda, 2)}
                  </div>
                </div>
                <div style={{
                  fontSize: 12, fontWeight: 700, fontFamily: FONT_MONO,
                  color: delta >= 0 ? theme.up : theme.down,
                }}>
                  {formatPct(delta)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div style={{ padding: '0 20px 20px', display: 'flex', gap: 10 }}>
        <button onClick={onAlert} style={{
          flex: 1, padding: '14px', borderRadius: 14, cursor: 'pointer',
          background: theme.accent, color: '#fff', border: 'none',
          fontSize: 14, fontWeight: 700, display: 'flex',
          alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>
          <Icon name="bell" size={16} color="#fff"/>
          {t.set_alert}
        </button>
        <button onClick={onCompare} style={{
          flex: 1, padding: '14px', borderRadius: 14, cursor: 'pointer',
          background: theme.surface, color: theme.text,
          border: `1px solid ${theme.borderStrong}`,
          fontSize: 14, fontWeight: 700, display: 'flex',
          alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>
          <Icon name="compare" size={16}/>
          {t.add_compare}
        </button>
      </div>
    </div>
  );
}

function BigPriceCard({ theme, label, value, prev, color }) {
  const pct = pctChange(value, prev);
  const up = pct >= 0;
  return (
    <div style={{
      flex: 1, padding: 14, borderRadius: 14,
      background: theme.surface, border: `1px solid ${theme.border}`,
    }}>
      <div style={{ fontSize: 11, color: theme.textFaint, fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase' }}>
        {label}
      </div>
      <div style={{
        fontSize: 24, fontWeight: 700, color: theme.text, fontFamily: FONT_MONO,
        marginTop: 4, letterSpacing: -0.5,
      }}>
        {formatCUP(value, 2)}
      </div>
      <div style={{
        fontSize: 11, color: up ? theme.up : theme.down,
        fontFamily: FONT_MONO, fontWeight: 600, marginTop: 2,
      }}>
        {formatPct(pct)}
      </div>
    </div>
  );
}

function StatRow({ theme, label, value, valueColor, border = '' }) {
  const borders = {};
  if (border.includes('right')) borders.borderRight = `1px solid ${theme.border}`;
  if (border.includes('bottom')) borders.borderBottom = `1px solid ${theme.border}`;
  return (
    <div style={{ padding: '14px 14px', ...borders }}>
      <div style={{ fontSize: 10, color: theme.textFaint, fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase' }}>
        {label}
      </div>
      <div style={{ fontSize: 16, fontWeight: 700, color: valueColor || theme.text, fontFamily: FONT_MONO, marginTop: 3, letterSpacing: -0.3 }}>
        {value}
      </div>
    </div>
  );
}

function InfoTile({ theme, label, value }) {
  return (
    <div style={{
      flex: 1, padding: '10px 12px', borderRadius: 10,
      background: theme.surface, border: `1px solid ${theme.border}`,
    }}>
      <div style={{ fontSize: 9, color: theme.textFaint, fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase' }}>
        {label}
      </div>
      <div style={{ fontSize: 12, fontWeight: 600, color: theme.text, marginTop: 3, fontFamily: FONT_MONO }}>
        {value}
      </div>
    </div>
  );
}

function SectionHeader({ theme, title }) {
  return (
    <div style={{ padding: '6px 20px 10px' }}>
      <div style={{ fontSize: 12, color: theme.textDim, fontWeight: 600, letterSpacing: 0.4, textTransform: 'uppercase' }}>
        {title}
      </div>
    </div>
  );
}

// ============ COMPARE SCREEN ============
function CompareScreen({ theme, t, lang }) {
  const [selected, setSelected] = React.useState(['USD', 'EUR', 'MLC']);
  const [adding, setAdding] = React.useState(false);
  const [period, setPeriod] = React.useState('1M');

  const days = { '7D': 7, '1M': 30, '3M': 60, '6M': 90 }[period] || 30;

  // Normalize series to percent change from start for comparison
  const series = selected.map(code => {
    const c = CURRENCIES.find(x => x.code === code);
    const hist = c.history.slice(-days);
    const base = hist[0].venda;
    return {
      code, c,
      points: hist.map(d => ({ d: d.d, v: ((d.venda - base) / base) * 100 })),
    };
  });

  const all = series.flatMap(s => s.points.map(p => p.v));
  const vMin = Math.min(...all, 0);
  const vMax = Math.max(...all, 0);

  const W = 380, H = 220, padX = 10, padY = 20;
  const innerW = W - padX * 2, innerH = H - padY * 2;
  const colors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#a855f7'];

  return (
    <div style={{ background: theme.bg, padding: '0 0 120px' }}>
      <div style={{ padding: '20px 20px 10px' }}>
        <div style={{ fontSize: 26, fontWeight: 700, color: theme.text, letterSpacing: -0.5 }}>
          {t.compare_title}
        </div>
        <div style={{ fontSize: 13, color: theme.textDim, marginTop: 4 }}>
          {lang === 'es' ? 'Cambio porcentual desde el inicio del período' : 'Mudança percentual desde o início do período'}
        </div>
      </div>

      {/* Period chips */}
      <div style={{ padding: '10px 20px 14px', display: 'flex', gap: 6 }}>
        {['7D', '1M', '3M', '6M'].map(p => (
          <button key={p} onClick={() => setPeriod(p)} style={{
            flex: 1, padding: '8px 0', borderRadius: 8,
            background: period === p ? theme.chipActive : theme.surface,
            border: `1px solid ${period === p ? theme.chipActive : theme.border}`,
            color: period === p ? theme.chipActiveText : theme.text,
            fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: FONT_MONO,
          }}>{p}</button>
        ))}
      </div>

      {/* Multi-line chart */}
      <div style={{ padding: '0 12px 16px' }}>
        <div style={{
          background: theme.surface, borderRadius: 18, padding: 8,
          border: `1px solid ${theme.border}`,
        }}>
          <svg width={W} height={H}>
            {[0.25, 0.5, 0.75].map(r => (
              <line key={r} x1={padX} x2={W - padX} y1={padY + innerH * r} y2={padY + innerH * r}
                stroke={theme.border} strokeDasharray="2 4"/>
            ))}
            {/* zero line */}
            <line x1={padX} x2={W - padX}
              y1={padY + innerH - ((0 - vMin) / (vMax - vMin || 1)) * innerH}
              y2={padY + innerH - ((0 - vMin) / (vMax - vMin || 1)) * innerH}
              stroke={theme.textDim} strokeDasharray="4 4" strokeWidth={1} opacity={0.5}/>
            {series.map((s, si) => {
              const pts = s.points.map((p, i) => {
                const x = padX + (i / (s.points.length - 1)) * innerW;
                const y = padY + innerH - ((p.v - vMin) / (vMax - vMin || 1)) * innerH;
                return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
              }).join(' ');
              return (
                <path key={s.code} d={pts} stroke={colors[si % colors.length]}
                  strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round"/>
              );
            })}
          </svg>
          {/* Y-axis labels */}
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 12px', fontSize: 10, color: theme.textFaint, fontFamily: FONT_MONO }}>
            <span>{formatPct(vMin)}</span>
            <span>{formatPct((vMin + vMax)/2)}</span>
            <span>{formatPct(vMax)}</span>
          </div>
        </div>
      </div>

      {/* Legend / selected list */}
      <div style={{ padding: '0 20px' }}>
        {series.map((s, si) => {
          const last = s.points[s.points.length - 1].v;
          const up = last >= 0;
          return (
            <div key={s.code} style={{
              background: theme.surface, borderRadius: 14, padding: '12px 14px',
              marginBottom: 8, border: `1px solid ${theme.border}`,
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <div style={{ width: 4, height: 32, borderRadius: 2, background: colors[si % colors.length] }}/>
              <CurrencyBadge code={s.code} size={36}/>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: theme.text }}>{s.code}</div>
                <div style={{ fontSize: 11, color: theme.textDim, fontFamily: FONT_MONO }}>
                  {formatCUP(s.c.venda, 2)} CUP
                </div>
              </div>
              <div style={{
                fontSize: 14, fontWeight: 700, fontFamily: FONT_MONO,
                color: up ? theme.up : theme.down,
              }}>
                {formatPct(last)}
              </div>
              <button onClick={() => setSelected(selected.filter(x => x !== s.code))}
                style={{
                  width: 28, height: 28, borderRadius: 14, border: 'none',
                  background: theme.surface2, color: theme.textDim, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                <Icon name="close" size={14}/>
              </button>
            </div>
          );
        })}
      </div>

      {/* Add button */}
      <div style={{ padding: '10px 20px' }}>
        <button onClick={() => setAdding(!adding)} style={{
          width: '100%', padding: 14, borderRadius: 14,
          background: 'transparent', border: `1.5px dashed ${theme.borderStrong}`,
          color: theme.textDim, cursor: 'pointer', fontSize: 13, fontWeight: 600,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>
          <Icon name="plus" size={16}/>
          {t.add_currency}
        </button>
      </div>

      {adding && (
        <div style={{ padding: '8px 20px' }}>
          <div style={{
            background: theme.surface, borderRadius: 14, padding: 8,
            border: `1px solid ${theme.border}`,
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6,
          }}>
            {CURRENCIES.filter(c => !selected.includes(c.code)).map(c => (
              <button key={c.code} onClick={() => { setSelected([...selected, c.code]); setAdding(false); }}
                style={{
                  padding: 10, borderRadius: 10, border: `1px solid ${theme.border}`,
                  background: theme.surface2, cursor: 'pointer',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                }}>
                <CurrencyBadge code={c.code} size={28}/>
                <span style={{ fontSize: 10, color: theme.text, fontWeight: 600 }}>{c.code}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ============ ALERTS SCREEN ============
function AlertsScreen({ theme, t, lang }) {
  const [alerts, setAlerts] = React.useState(ALERTS);
  const [creating, setCreating] = React.useState(false);
  const [newAlert, setNewAlert] = React.useState({ code: 'USD', type: 'above', threshold: 520, side: 'venda' });

  const typeLabel = (type) => type === 'above' ? t.above : type === 'below' ? t.below : t.change;

  return (
    <div style={{ background: theme.bg, padding: '0 0 120px' }}>
      <div style={{ padding: '20px 20px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: 26, fontWeight: 700, color: theme.text, letterSpacing: -0.5 }}>
            {t.alerts_title}
          </div>
          <div style={{ fontSize: 13, color: theme.textDim, marginTop: 4 }}>
            {alerts.filter(a => a.active).length} {lang === 'es' ? 'activas' : 'ativas'} · {alerts.length} {lang === 'es' ? 'totales' : 'totais'}
          </div>
        </div>
        <button onClick={() => setCreating(true)} style={{
          width: 44, height: 44, borderRadius: 22,
          background: theme.accent, border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff',
        }}>
          <Icon name="plus" size={20} color="#fff"/>
        </button>
      </div>

      {/* Alerts list */}
      <div style={{ padding: '14px 20px 0' }}>
        {alerts.map(a => {
          const c = CURRENCIES.find(x => x.code === a.code);
          const curr = a.side === 'compra' ? c.compra : c.venda;
          const distance = a.type === 'above' ? a.threshold - curr : curr - a.threshold;
          const triggered = a.type === 'above' ? curr >= a.threshold : curr <= a.threshold;
          return (
            <div key={a.id} style={{
              background: theme.surface, borderRadius: 16, padding: 14, marginBottom: 10,
              border: `1px solid ${a.active && triggered ? theme.accent : theme.border}`,
              opacity: a.active ? 1 : 0.55,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <CurrencyBadge code={a.code} size={40}/>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 15, fontWeight: 700, color: theme.text }}>{a.code}</span>
                    <span style={{
                      fontSize: 9, padding: '2px 6px', borderRadius: 4,
                      background: theme.surface2, color: theme.textDim,
                      fontWeight: 700, letterSpacing: 0.3, textTransform: 'uppercase',
                    }}>{a.side}</span>
                  </div>
                  <div style={{ fontSize: 12, color: theme.textDim, marginTop: 2 }}>
                    {t.when} {typeLabel(a.type)} <span style={{ color: theme.text, fontWeight: 600, fontFamily: FONT_MONO }}>{a.threshold}</span> CUP
                  </div>
                </div>
                <Toggle theme={theme} value={a.active} onChange={(v) => {
                  setAlerts(alerts.map(x => x.id === a.id ? {...x, active: v} : x));
                }}/>
              </div>
              {/* Progress */}
              <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ flex: 1, height: 6, borderRadius: 3, background: theme.surface2, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: `${Math.min(100, Math.max(0, (curr / a.threshold) * 100))}%`,
                    background: triggered ? theme.accent : theme.textDim,
                    borderRadius: 3,
                  }}/>
                </div>
                <div style={{ fontSize: 11, color: theme.textDim, fontFamily: FONT_MONO, minWidth: 90, textAlign: 'right' }}>
                  <span style={{ color: theme.text, fontWeight: 600 }}>{formatCUP(curr, 2)}</span>
                  {' / '}
                  {a.threshold}
                </div>
              </div>
              {triggered && a.active && (
                <div style={{
                  marginTop: 10, padding: '6px 10px', borderRadius: 8,
                  background: theme.accentSoft, color: theme.accent,
                  fontSize: 11, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6,
                }}>
                  <Icon name="check" size={12}/>
                  {lang === 'es' ? '¡Alerta disparada!' : 'Alerta disparado!'}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {creating && (
        <CreateAlertModal theme={theme} t={t} lang={lang}
          newAlert={newAlert} setNewAlert={setNewAlert}
          onCancel={() => setCreating(false)}
          onSave={() => {
            setAlerts([...alerts, { ...newAlert, id: Date.now(), active: true }]);
            setCreating(false);
          }}
        />
      )}
    </div>
  );
}

function CreateAlertModal({ theme, t, lang, newAlert, setNewAlert, onCancel, onSave }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'flex-end', zIndex: 50,
    }} onClick={onCancel}>
      <div onClick={(e) => e.stopPropagation()} style={{
        width: '100%', background: theme.surface,
        borderTopLeftRadius: 24, borderTopRightRadius: 24,
        padding: '20px 20px 28px',
        border: `1px solid ${theme.border}`, borderBottom: 'none',
      }}>
        <div style={{ width: 40, height: 4, borderRadius: 2, background: theme.borderStrong, margin: '0 auto 16px' }}/>
        <div style={{ fontSize: 20, fontWeight: 700, color: theme.text, marginBottom: 16 }}>
          {t.new_alert}
        </div>

        <div style={{ fontSize: 11, color: theme.textDim, fontWeight: 600, letterSpacing: 0.4, textTransform: 'uppercase', marginBottom: 8 }}>
          {lang === 'es' ? 'Moneda' : 'Moeda'}
        </div>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6, marginBottom: 18,
        }}>
          {CURRENCIES.slice(0, 8).map(c => (
            <button key={c.code} onClick={() => setNewAlert({...newAlert, code: c.code})}
              style={{
                padding: '10px 6px', borderRadius: 10,
                background: newAlert.code === c.code ? theme.accentSoft : theme.surface2,
                border: `1px solid ${newAlert.code === c.code ? theme.accent : theme.border}`,
                cursor: 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
              }}>
              <CurrencyBadge code={c.code} size={24}/>
              <span style={{ fontSize: 10, color: theme.text, fontWeight: 600 }}>{c.code}</span>
            </button>
          ))}
        </div>

        <div style={{ fontSize: 11, color: theme.textDim, fontWeight: 600, letterSpacing: 0.4, textTransform: 'uppercase', marginBottom: 8 }}>
          {t.when}
        </div>
        <div style={{ display: 'flex', gap: 6, marginBottom: 18 }}>
          {['above', 'below'].map(typ => (
            <button key={typ} onClick={() => setNewAlert({...newAlert, type: typ})} style={{
              flex: 1, padding: '10px', borderRadius: 10,
              background: newAlert.type === typ ? theme.accentSoft : theme.surface2,
              border: `1px solid ${newAlert.type === typ ? theme.accent : theme.border}`,
              color: newAlert.type === typ ? theme.accent : theme.text,
              fontSize: 12, fontWeight: 600, cursor: 'pointer',
            }}>
              <Icon name={typ === 'above' ? 'arrowUp' : 'arrowDown'} size={14}/>
              {' '}{typ === 'above' ? t.above : t.below}
            </button>
          ))}
        </div>

        <div style={{ fontSize: 11, color: theme.textDim, fontWeight: 600, letterSpacing: 0.4, textTransform: 'uppercase', marginBottom: 8 }}>
          {lang === 'es' ? 'Valor umbral' : 'Valor limiar'} (CUP)
        </div>
        <input type="number" value={newAlert.threshold}
          onChange={(e) => setNewAlert({...newAlert, threshold: parseFloat(e.target.value) || 0})}
          style={{
            width: '100%', padding: '14px 16px', borderRadius: 12,
            background: theme.surface2, border: `1px solid ${theme.border}`,
            color: theme.text, fontSize: 22, fontWeight: 700,
            fontFamily: FONT_MONO, outline: 'none', boxSizing: 'border-box',
            marginBottom: 20,
          }}
        />

        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onCancel} style={{
            flex: 1, padding: 14, borderRadius: 14,
            background: theme.surface2, color: theme.text,
            border: 'none', fontSize: 14, fontWeight: 600, cursor: 'pointer',
          }}>{t.cancel}</button>
          <button onClick={onSave} style={{
            flex: 2, padding: 14, borderRadius: 14,
            background: theme.accent, color: '#fff',
            border: 'none', fontSize: 14, fontWeight: 700, cursor: 'pointer',
          }}>{t.done}</button>
        </div>
      </div>
    </div>
  );
}

function Toggle({ theme, value, onChange }) {
  return (
    <button onClick={() => onChange(!value)} style={{
      width: 40, height: 24, borderRadius: 12,
      background: value ? theme.accent : theme.surface2,
      border: `1px solid ${value ? theme.accent : theme.border}`,
      cursor: 'pointer', position: 'relative', padding: 0,
      transition: 'all 0.15s',
    }}>
      <span style={{
        position: 'absolute', top: 2, left: value ? 18 : 2,
        width: 18, height: 18, borderRadius: '50%',
        background: '#fff', transition: 'left 0.15s',
      }}/>
    </button>
  );
}

// ============ SETTINGS SCREEN ============
function SettingsScreen({ theme, themeName, setThemeName, lang, setLang, t, accent, setAccent, dataStatus }) {
  const [url, setUrl] = React.useState(() => (typeof window.getDataUrl === 'function' ? window.getDataUrl() : ''));
  const saveUrl = () => {
    if (typeof window.setDataUrl === 'function') {
      window.setDataUrl(url.trim());
      location.reload();
    }
  };
  const statusColor = dataStatus === 'live' ? theme.accent
    : dataStatus === 'error' ? theme.down
    : dataStatus === 'loading' ? theme.textDim : theme.textDim;
  const statusLabel = {
    live: lang === 'es' ? 'Datos en vivo' : 'Dados ao vivo',
    loading: lang === 'es' ? 'Cargando…' : 'Carregando…',
    error: lang === 'es' ? 'Error de conexión' : 'Erro de conexão',
    mock: lang === 'es' ? 'Datos de ejemplo' : 'Dados de exemplo',
  }[dataStatus] || '';
  return (
    <div style={{ background: theme.bg, padding: '0 0 120px' }}>
      <div style={{ padding: '20px 20px 16px' }}>
        <div style={{ fontSize: 26, fontWeight: 700, color: theme.text, letterSpacing: -0.5 }}>
          {t.settings_title}
        </div>
      </div>

      {/* Appearance */}
      <SectionHeader theme={theme} title={t.theme}/>
      <div style={{ padding: '0 20px 20px' }}>
        <div style={{
          background: theme.surface, borderRadius: 16, padding: 6,
          border: `1px solid ${theme.border}`, display: 'flex', gap: 4,
        }}>
          {[
            { k: 'dark', l: t.dark, icon: 'moon' },
            { k: 'light', l: t.light, icon: 'sun' },
          ].map(o => (
            <button key={o.k} onClick={() => setThemeName(o.k)} style={{
              flex: 1, padding: '12px', borderRadius: 12,
              background: themeName === o.k ? theme.accentSoft : 'transparent',
              border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              color: themeName === o.k ? theme.accent : theme.text,
              fontSize: 14, fontWeight: 600,
            }}>
              <Icon name={o.icon} size={16}/> {o.l}
            </button>
          ))}
        </div>
      </div>

      {/* Language */}
      <SectionHeader theme={theme} title={t.language}/>
      <div style={{ padding: '0 20px 20px' }}>
        <div style={{
          background: theme.surface, borderRadius: 16, padding: 6,
          border: `1px solid ${theme.border}`, display: 'flex', gap: 4,
        }}>
          {[
            { k: 'es', l: 'Español', flag: 'ES' },
            { k: 'pt', l: 'Português', flag: 'PT' },
          ].map(o => (
            <button key={o.k} onClick={() => setLang(o.k)} style={{
              flex: 1, padding: '12px', borderRadius: 12,
              background: lang === o.k ? theme.accentSoft : 'transparent',
              border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              color: lang === o.k ? theme.accent : theme.text,
              fontSize: 14, fontWeight: 600,
            }}>
              <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 6px', borderRadius: 4, background: theme.surface2 }}>{o.flag}</span>
              {o.l}
            </button>
          ))}
        </div>
      </div>

      {/* Accent */}
      <SectionHeader theme={theme} title={lang === 'es' ? 'Color de acento' : 'Cor de destaque'}/>
      <div style={{ padding: '0 20px 20px' }}>
        <div style={{
          background: theme.surface, borderRadius: 16, padding: 14,
          border: `1px solid ${theme.border}`, display: 'flex', gap: 10, justifyContent: 'space-around',
        }}>
          {[
            ['#10b981', 'emerald'],
            ['#3b82f6', 'blue'],
            ['#f59e0b', 'amber'],
            ['#a855f7', 'violet'],
            ['#ef4444', 'red'],
          ].map(([col, name]) => (
            <button key={name} onClick={() => setAccent(col)} style={{
              width: 40, height: 40, borderRadius: 20,
              background: col, border: accent === col ? `3px solid ${theme.text}` : `3px solid transparent`,
              cursor: 'pointer', padding: 0,
              boxShadow: accent === col ? `0 0 0 2px ${theme.bg}` : 'none',
            }}/>
          ))}
        </div>
      </div>

      {/* Data source */}
      <SectionHeader theme={theme} title={lang === 'es' ? 'Fuente de datos' : 'Fonte de dados'}/>
      <div style={{ padding: '0 20px 20px' }}>
        <div style={{
          background: theme.surface, borderRadius: 16, padding: 14,
          border: `1px solid ${theme.border}`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <PulseDot color={statusColor} size={7}/>
            <span style={{ fontSize: 12, fontWeight: 700, color: statusColor, letterSpacing: 0.3, textTransform: 'uppercase' }}>
              {statusLabel}
            </span>
          </div>
          <div style={{ fontSize: 11, color: theme.textDim, marginBottom: 8 }}>
            {lang === 'es'
              ? 'URL del JSON exportado por tu bot (banco_dados_historicos_fiat.json)'
              : 'URL do JSON exportado pelo seu bot (banco_dados_historicos_fiat.json)'}
          </div>
          <input value={url} onChange={(e) => setUrl(e.target.value)}
            placeholder="https://…/banco_dados_historicos_fiat.json"
            style={{
              width: '100%', padding: '10px 12px', borderRadius: 10,
              background: theme.surface2, border: `1px solid ${theme.border}`,
              color: theme.text, fontSize: 12, fontFamily: FONT_MONO,
              outline: 'none', boxSizing: 'border-box', marginBottom: 10,
            }}/>
          <button onClick={saveUrl} style={{
            width: '100%', padding: '10px', borderRadius: 10,
            background: theme.accent, color: '#fff', border: 'none',
            fontSize: 13, fontWeight: 700, cursor: 'pointer',
          }}>
            {lang === 'es' ? 'Guardar y recargar' : 'Salvar e recarregar'}
          </button>
        </div>
      </div>

      {/* Other settings */}
      <SectionHeader theme={theme} title={lang === 'es' ? 'Preferencias' : 'Preferências'}/>
      <div style={{ padding: '0 20px 20px' }}>
        <div style={{
          background: theme.surface, borderRadius: 16,
          border: `1px solid ${theme.border}`, overflow: 'hidden',
        }}>
          <SettingRow theme={theme} icon="star" label={t.default_currency} value="USD"/>
          <SettingRow theme={theme} icon="bell" label={t.notifications} value={lang === 'es' ? 'Activadas' : 'Ativadas'}/>
          <SettingRow theme={theme} icon="globe" label={t.data_sources} value="4 Telegram"/>
          <SettingRow theme={theme} icon="info" label={t.about} value="v2.1.0" last/>
        </div>
      </div>

      {/* Bot status */}
      <div style={{ padding: '0 20px 24px' }}>
        <div style={{
          background: theme.surface, borderRadius: 16, padding: 16,
          border: `1px solid ${theme.border}`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <PulseDot color={theme.accent} size={8}/>
            <span style={{ fontSize: 13, fontWeight: 700, color: theme.text }}>
              {lang === 'es' ? 'Bot en línea' : 'Bot online'}
            </span>
          </div>
          <div style={{ fontSize: 11, color: theme.textDim, fontFamily: FONT_MONO, lineHeight: 1.6 }}>
            price_bot_fiat v2.0 · {lang === 'es' ? 'sincronizado' : 'sincronizado'}<br/>
            {lang === 'es' ? 'última señal' : 'último sinal'}: 1 min · 1,284 {lang === 'es' ? 'mensajes hoy' : 'mensagens hoje'}
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingRow({ theme, icon, label, value, last }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', padding: '14px 16px', gap: 14,
      borderBottom: last ? 'none' : `1px solid ${theme.border}`,
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: 10,
        background: theme.surface2,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: theme.textDim,
      }}>
        <Icon name={icon} size={18}/>
      </div>
      <div style={{ flex: 1, fontSize: 14, fontWeight: 500, color: theme.text }}>{label}</div>
      <div style={{ fontSize: 13, color: theme.textDim, fontFamily: FONT_MONO }}>{value}</div>
      <Icon name="chevronRight" size={16} color={theme.textFaint}/>
    </div>
  );
}

Object.assign(window, {
  HomeScreen, DetailScreen, CompareScreen, AlertsScreen, SettingsScreen,
  CurrencyCard, SectionHeader, Toggle,
});
