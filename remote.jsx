// Remote data loader — fetches live JSON from the bot's exported file.
// Falls back to the mock CURRENCIES when offline or no URL configured.
//
// Configure the URL by editing DATA_URL below OR by setting localStorage.cc_data_url.

const DEFAULT_DATA_URL = ''; // e.g. 'https://my-bucket.r2.dev/banco_dados_historicos_fiat.json'

function getDataUrl() {
  return localStorage.getItem('cc_data_url') || DEFAULT_DATA_URL;
}

// Maps bot's JSON shape into the app's CURRENCIES shape.
// Expected input: { "YYYY-MM-DD": { "PRECO_USD_CUP": { media_compra, media_venda, ... }, ... } }
function transformBotJson(banco) {
  const dates = Object.keys(banco).filter(k => /^\d{4}-\d{2}-\d{2}$/.test(k)).sort();
  if (!dates.length) return null;

  // Bot uses keys like PRECO_USD_CUP, PRECO_EUR_CUP, PRECO_MLC_CUP, PRECO_ZELLE_CUP,
  // PRECO_CAD_CUP, PRECO_BRL_CUP, PRECO_MXN_CUP, PRECO_GBP_CUP, PRECO_CHF_CUP,
  // PRECO_CLA_CUP, PRECO_BANDEC_PREPAGO_CUP
  const KEY_MAP = {
    USD: 'PRECO_USD_CUP', EUR: 'PRECO_EUR_CUP', MLC: 'PRECO_MLC_CUP',
    ZELLE: 'PRECO_ZELLE_CUP', CAD: 'PRECO_CAD_CUP', BRL: 'PRECO_BRL_CUP',
    MXN: 'PRECO_MXN_CUP', GBP: 'PRECO_GBP_CUP', CHF: 'PRECO_CHF_CUP',
    CLA: 'PRECO_CLA_CUP', TROP: 'PRECO_BANDEC_PREPAGO_CUP',
  };

  const out = [];
  for (const cfg of CURRENCIES) {
    const botKey = KEY_MAP[cfg.code];
    if (!botKey) { out.push(cfg); continue; }
    const history = [];
    for (const d of dates) {
      const blk = banco[d] && banco[d][botKey];
      if (!blk || typeof blk !== 'object') continue;
      const compra = blk.media_compra ?? blk.media_compra_venda ?? blk.media_venda;
      const venda  = blk.media_venda  ?? blk.media_compra_venda ?? blk.media_compra;
      if (compra == null && venda == null) continue;
      history.push({ d, compra: Number(compra ?? venda), venda: Number(venda ?? compra) });
    }
    if (history.length === 0) { out.push(cfg); continue; }
    const last = history[history.length - 1];
    const prev = history[history.length - 2] || last;
    out.push({
      ...cfg,
      compra: last.compra,
      venda: last.venda,
      prev_compra: prev.compra,
      prev_venda: prev.venda,
      history,
      lastUpdate: timeAgo(last.d),
      active: isRecent(last.d),
    });
  }
  return out;
}

function isRecent(isoDate) {
  const d = new Date(isoDate + 'T00:00:00');
  return (Date.now() - d.getTime()) < 48 * 3600 * 1000;
}

function timeAgo(isoDate) {
  const d = new Date(isoDate + 'T00:00:00');
  const diff = Date.now() - d.getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1) return '< 1 h';
  if (h < 24) return `${h} h`;
  const days = Math.floor(h / 24);
  return `${days} d`;
}

async function loadRemoteData() {
  const url = getDataUrl();
  if (!url) return { ok: false, reason: 'no-url' };
  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return { ok: false, reason: `http-${res.status}` };
    const banco = await res.json();
    const transformed = transformBotJson(banco);
    if (!transformed) return { ok: false, reason: 'empty-data' };
    // Replace the in-memory CURRENCIES
    window.CURRENCIES.splice(0, window.CURRENCIES.length, ...transformed);
    return { ok: true, count: transformed.length };
  } catch (e) {
    return { ok: false, reason: 'network', error: String(e) };
  }
}

window.loadRemoteData = loadRemoteData;
window.getDataUrl = getDataUrl;
window.setDataUrl = (url) => {
  if (url) localStorage.setItem('cc_data_url', url);
  else localStorage.removeItem('cc_data_url');
};
