// Remote data loader — fetches live JSON from the bot's exported files.
// Supports the new per-currency format (historico_USD.json, etc.)
// Falls back to the legacy single-file format (banco_dados_historicos_fiat.json).
//
// Configure the base URL by editing DEFAULT_DATA_URL below
// OR by calling setDataUrl('https://...') in the browser console.
//
// New format: base URL is a directory — the app fetches historico_{CUR}.json for each currency.
// Legacy format: base URL points directly to banco_dados_historicos_fiat.json.

const DEFAULT_DATA_URL = ''; // e.g. 'https://my-bucket.r2.dev/data'

// Currency code → filename (new format)
const CUR_FILE = {
  USD:   'historico_USD.json',
  EUR:   'historico_EUR.json',
  MLC:   'historico_MLC.json',
  ZELLE: 'historico_ZELLE.json',
  CAD:   'historico_CAD.json',
  BRL:   'historico_BRL.json',
  MXN:   'historico_MXN.json',
  GBP:   'historico_GBP.json',
  CHF:   'historico_CHF.json',
  CLA:   'historico_CLA.json',
  TROP:  'historico_TROP.json',
};

// Currency code → bot key (legacy single-file format)
const OLD_KEY_MAP = {
  USD:   'PRECO_USD_CUP',
  EUR:   'PRECO_EUR_CUP',
  MLC:   'PRECO_MLC_CUP',
  ZELLE: 'PRECO_ZELLE_CUP',
  CAD:   'PRECO_CAD_CUP',
  BRL:   'PRECO_BRL_CUP',
  MXN:   'PRECO_MXN_CUP',
  GBP:   'PRECO_GBP_CUP',
  CHF:   'PRECO_CHF_CUP',
  CLA:   'PRECO_CLA_CUP',
  TROP:  'PRECO_BANDEC_PREPAGO_CUP',
};

function getDataUrl() {
  const raw = localStorage.getItem('cc_data_url') || DEFAULT_DATA_URL;
  return raw.replace(/\/+$/, ''); // strip trailing slash
}

// ── New format ──────────────────────────────────────────────────────────────
// Each file is an array of:
//   { _id, avg, min, max, median, count_values, first, last, cur, offer, trmi }
// Since offer is "General" (no separate buy/sell), avg is used for both compra/venda.

function transformNewFormat(entries) {
  if (!Array.isArray(entries) || !entries.length) return null;
  const sorted = entries
    .filter(e => e._id && e.avg != null)
    .sort((a, b) => a._id.localeCompare(b._id));
  if (!sorted.length) return null;
  return sorted.map(e => {
    // Pipeline: mediana → EWMA → preço principal
    const price = Number(e.ema ?? e.median ?? e.avg_bayes ?? e.avg);
    return {
      d:         e._id,
      compra:    price,
      venda:     price,
      ema:       e.ema     != null ? Number(e.ema)     : undefined,
      ci_low:    e.ci_low  != null ? Number(e.ci_low)  : undefined,
      ci_high:   e.ci_high != null ? Number(e.ci_high) : undefined,
      day_min:   e.min     != null ? Number(e.min)     : undefined,
      day_max:   e.max     != null ? Number(e.max)     : undefined,
      n:         e.count_values ?? 0,
      estimated: e.trmi === 'estimated',
    };
  });
}

// ── Legacy format ────────────────────────────────────────────────────────────
// Single object: { "YYYY-MM-DD": { "PRECO_USD_CUP": { media_compra, media_venda, ... } } }

function transformLegacyFormat(code, banco) {
  const botKey = OLD_KEY_MAP[code];
  if (!botKey) return null;
  const dates = Object.keys(banco).filter(k => /^\d{4}-\d{2}-\d{2}$/.test(k)).sort();
  const history = [];
  for (const d of dates) {
    const blk = banco[d]?.[botKey];
    if (!blk || typeof blk !== 'object') continue;
    const compra = blk.media_compra ?? blk.media_compra_venda ?? blk.media_venda;
    const venda  = blk.media_venda  ?? blk.media_compra_venda ?? blk.media_compra;
    if (compra == null && venda == null) continue;
    history.push({ d, compra: Number(compra ?? venda), venda: Number(venda ?? compra) });
  }
  return history.length ? history : null;
}

// ── Shared helpers ────────────────────────────────────────────────────────────

function applyHistory(cfg, history, lastDatetime) {
  if (!history || !history.length) return cfg;
  const last = history[history.length - 1];
  const prev = history[history.length - 2] || last;
  return {
    ...cfg,
    compra:      last.compra,
    venda:       last.venda,
    prev_compra: prev.compra,
    prev_venda:  prev.venda,
    history,
    lastUpdate:  lastDatetime ? timeAgoDatetime(lastDatetime) : timeAgo(last.d),
    active:      isRecent(last.d),
  };
}

function isRecent(isoDate) {
  return (Date.now() - new Date(isoDate + 'T00:00:00').getTime()) < 48 * 3600 * 1000;
}

function timeAgo(isoDate) {
  const diff = Date.now() - new Date(isoDate + 'T00:00:00').getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1)  return '< 1 h';
  if (h < 24) return `${h} h`;
  return `${Math.floor(h / 24)} d`;
}

function timeAgoDatetime(datetimeStr) {
  // "2026-04-22 14:35:00" → relative time
  const d = new Date(datetimeStr.replace(' ', 'T'));
  if (isNaN(d)) return timeAgo(datetimeStr.slice(0, 10));
  const diff = Date.now() - d.getTime();
  const m = Math.floor(diff / 60000);
  if (m < 2)  return '< 1 min';
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} h`;
  return `${Math.floor(h / 24)} d`;
}

// ── Main loader ───────────────────────────────────────────────────────────────

async function loadRemoteData() {
  const base = getDataUrl();
  if (!base) return { ok: false, reason: 'no-url' };

  // 1. Try new per-currency format (historico_*.json)
  const fetches = await Promise.allSettled(
    Object.entries(CUR_FILE).map(async ([code, file]) => {
      const res = await fetch(`${base}/${file}`, { cache: 'no-store' });
      if (!res.ok) throw new Error(`http-${res.status}`);
      const data = await res.json();
      return { code, data };
    })
  );

  const byCode = {};
  for (const r of fetches) {
    if (r.status === 'fulfilled') byCode[r.value.code] = r.value.data;
  }

  if (Object.keys(byCode).length > 0) {
    const transformed = CURRENCIES.map(cfg => {
      const entries = byCode[cfg.code];
      const history = transformNewFormat(entries);
      // Use last entry's last.date for precise lastUpdate if available
      const lastEntry = Array.isArray(entries) && entries.length
        ? [...entries].sort((a, b) => a._id.localeCompare(b._id)).at(-1)
        : null;
      const lastDatetime = lastEntry?.last?.date ?? null;
      return applyHistory(cfg, history, lastDatetime);
    });
    window.CURRENCIES.splice(0, window.CURRENCIES.length, ...transformed);
    return { ok: true, format: 'new', loaded: Object.keys(byCode).length };
  }

  // 2. Fall back to legacy single-file format
  try {
    const res = await fetch(base, { cache: 'no-store' });
    if (!res.ok) return { ok: false, reason: `http-${res.status}` };
    const banco = await res.json();
    if (typeof banco !== 'object' || Array.isArray(banco))
      return { ok: false, reason: 'unrecognized-format' };

    const transformed = CURRENCIES.map(cfg => {
      const history = transformLegacyFormat(cfg.code, banco);
      return applyHistory(cfg, history, null);
    });
    window.CURRENCIES.splice(0, window.CURRENCIES.length, ...transformed);
    return { ok: true, format: 'legacy', loaded: transformed.length };
  } catch (e) {
    return { ok: false, reason: 'network', error: String(e) };
  }
}

window.loadRemoteData = loadRemoteData;
window.getDataUrl     = getDataUrl;
window.setDataUrl = (url) => {
  if (url) localStorage.setItem('cc_data_url', url);
  else     localStorage.removeItem('cc_data_url');
};
