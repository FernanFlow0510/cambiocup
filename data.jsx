// Mock data + i18n for Cambio CUP app
// Based on the price bot that tracks CUP (Cuban Peso) vs fiat currencies

// Generate realistic historical data for the last 90 days
function genHistory(base, volatility = 0.015, trend = 0.0008, days = 90) {
  const out = [];
  let v = base * (1 - trend * days);
  for (let i = 0; i < days; i++) {
    // random walk with slight upward trend
    v = v * (1 + trend + (Math.random() - 0.5) * volatility);
    out.push({
      d: new Date(Date.now() - (days - i - 1) * 86400000).toISOString().slice(0, 10),
      compra: v * (0.985 + Math.random() * 0.005),
      venda: v * (1.005 + Math.random() * 0.008),
    });
  }
  return out;
}

// Current rates reflect the bot's real current ranges (2026 data)
const CURRENCIES = [
  {
    code: 'USD', name_es: 'Dólar estadounidense', name_pt: 'Dólar americano',
    flag: 'US', symbol: '$', compra: 508, venda: 518,
    prev_compra: 503, prev_venda: 514,
    history: genHistory(510, 0.012, 0.0009),
    sources: 4, lastUpdate: '2 min', active: true,
  },
  {
    code: 'EUR', name_es: 'Euro', name_pt: 'Euro',
    flag: 'EU', symbol: '€', compra: 578, venda: 592,
    prev_compra: 572, prev_venda: 589,
    history: genHistory(582, 0.011, 0.0008),
    sources: 4, lastUpdate: '1 min', active: true,
  },
  {
    code: 'MLC', name_es: 'Moneda Libremente Convertible', name_pt: 'Moeda Livre Conversível',
    flag: 'MLC', symbol: '', compra: 390, venda: 402,
    prev_compra: 392, prev_venda: 404,
    history: genHistory(396, 0.009, -0.0001),
    sources: 3, lastUpdate: '5 min', active: true,
  },
  {
    code: 'ZELLE', name_es: 'Zelle', name_pt: 'Zelle',
    flag: 'Z', symbol: '$', compra: 498, venda: 512,
    prev_compra: 495, prev_venda: 508,
    history: genHistory(503, 0.013, 0.0007),
    sources: 3, lastUpdate: '3 min', active: true,
  },
  {
    code: 'CAD', name_es: 'Dólar canadiense', name_pt: 'Dólar canadense',
    flag: 'CA', symbol: 'C$', compra: 370, venda: 382,
    prev_compra: 368, prev_venda: 380,
    history: genHistory(375, 0.010, 0.0006),
    sources: 2, lastUpdate: '12 min', active: true,
  },
  {
    code: 'BRL', name_es: 'Real brasileño', name_pt: 'Real brasileiro',
    flag: 'BR', symbol: 'R$', compra: 98, venda: 102,
    prev_compra: 97, prev_venda: 101,
    history: genHistory(99.5, 0.011, 0.0005),
    sources: 2, lastUpdate: '8 min', active: true,
  },
  {
    code: 'MXN', name_es: 'Peso mexicano', name_pt: 'Peso mexicano',
    flag: 'MX', symbol: '$', compra: 28.2, venda: 29.1,
    prev_compra: 28.0, prev_venda: 28.9,
    history: genHistory(28.5, 0.009, 0.0006),
    sources: 2, lastUpdate: '15 min', active: true,
  },
  {
    code: 'GBP', name_es: 'Libra esterlina', name_pt: 'Libra esterlina',
    flag: 'GB', symbol: '£', compra: 635, venda: 655,
    prev_compra: 630, prev_venda: 650,
    history: genHistory(640, 0.010, 0.0007),
    sources: 2, lastUpdate: '18 min', active: true,
  },
  {
    code: 'CHF', name_es: 'Franco suizo', name_pt: 'Franco suíço',
    flag: 'CH', symbol: 'Fr', compra: 615, venda: 640,
    prev_compra: 612, prev_venda: 638,
    history: genHistory(625, 0.010, 0.0005),
    sources: 1, lastUpdate: '1 h', active: false,
  },
  {
    code: 'CLA', name_es: 'Tarjeta Clásica', name_pt: 'Cartão Clássica',
    flag: 'CL', symbol: '', compra: 498, venda: 512,
    prev_compra: 495, prev_venda: 510,
    history: genHistory(503, 0.012, 0.0008),
    sources: 2, lastUpdate: '6 min', active: true,
  },
  {
    code: 'TROP', name_es: 'Bandec / Prepago', name_pt: 'Bandec / Pré-pago',
    flag: 'TP', symbol: '', compra: 498, venda: 512,
    prev_compra: 495, prev_venda: 510,
    history: genHistory(503, 0.012, 0.0008),
    sources: 2, lastUpdate: '11 min', active: true,
  },
];

// Mock alerts
const ALERTS = [
  { id: 1, code: 'USD', type: 'above', threshold: 520, active: true, side: 'venda' },
  { id: 2, code: 'EUR', type: 'below', threshold: 575, active: true, side: 'compra' },
  { id: 3, code: 'MLC', type: 'above', threshold: 410, active: false, side: 'venda' },
  { id: 4, code: 'ZELLE', type: 'change', threshold: 2, active: true, side: 'ambos' },
];

// i18n
const I18N = {
  es: {
    // Nav
    home: 'Inicio',
    compare: 'Comparar',
    alerts: 'Alertas',
    settings: 'Ajustes',
    // Home
    app_name: 'Cambio CUP',
    live: 'En vivo',
    total_tracked: 'monedas rastreadas',
    converter: 'Conversor rápido',
    amount: 'Cantidad',
    you_get: 'Obtienes',
    all_currencies: 'Todas las monedas',
    search: 'Buscar moneda…',
    buy: 'Compra',
    sell: 'Venta',
    spread: 'Spread',
    vs_yesterday: 'vs ayer',
    sources: 'fuentes',
    active_now: 'activa',
    inactive: 'inactiva',
    // Detail
    overview: 'Resumen',
    chart: 'Gráfico',
    history: 'Historial',
    statistics: 'Estadísticas',
    period: 'Período',
    min: 'Mínimo',
    max: 'Máximo',
    avg: 'Promedio',
    range: 'Rango',
    change_30d: 'Cambio 30d',
    volatility: 'Volatilidad',
    confidence: 'Intervalo conf.',
    observations: 'Observaciones',
    last_updated: 'Actualizado hace',
    set_alert: 'Crear alerta',
    add_compare: 'Añadir a comparar',
    // Compare
    compare_title: 'Comparar monedas',
    add_currency: 'Añadir moneda',
    remove: 'Quitar',
    // Alerts
    alerts_title: 'Alertas de precio',
    new_alert: 'Nueva alerta',
    when: 'Cuando',
    above: 'suba por encima de',
    below: 'baje por debajo de',
    change: 'cambie más de',
    notify_me: 'Notificar',
    // Settings
    settings_title: 'Ajustes',
    language: 'Idioma',
    theme: 'Tema',
    dark: 'Oscuro',
    light: 'Claro',
    default_currency: 'Moneda favorita',
    notifications: 'Notificaciones',
    data_sources: 'Fuentes de datos',
    about: 'Acerca de',
    // Misc
    back: 'Atrás',
    done: 'Listo',
    cancel: 'Cancelar',
    ago_min: 'min',
    ago_h: 'h',
  },
  pt: {
    home: 'Início',
    compare: 'Comparar',
    alerts: 'Alertas',
    settings: 'Ajustes',
    app_name: 'Câmbio CUP',
    live: 'Ao vivo',
    total_tracked: 'moedas monitoradas',
    converter: 'Conversor rápido',
    amount: 'Quantia',
    you_get: 'Você recebe',
    all_currencies: 'Todas as moedas',
    search: 'Buscar moeda…',
    buy: 'Compra',
    sell: 'Venda',
    spread: 'Spread',
    vs_yesterday: 'vs ontem',
    sources: 'fontes',
    active_now: 'ativa',
    inactive: 'inativa',
    overview: 'Visão geral',
    chart: 'Gráfico',
    history: 'Histórico',
    statistics: 'Estatísticas',
    period: 'Período',
    min: 'Mínimo',
    max: 'Máximo',
    avg: 'Média',
    range: 'Variação',
    change_30d: 'Mudança 30d',
    volatility: 'Volatilidade',
    confidence: 'Intervalo conf.',
    observations: 'Observações',
    last_updated: 'Atualizado há',
    set_alert: 'Criar alerta',
    add_compare: 'Adicionar comparar',
    compare_title: 'Comparar moedas',
    add_currency: 'Adicionar moeda',
    remove: 'Remover',
    alerts_title: 'Alertas de preço',
    new_alert: 'Nova alerta',
    when: 'Quando',
    above: 'subir acima de',
    below: 'cair abaixo de',
    change: 'variar mais de',
    notify_me: 'Notificar',
    settings_title: 'Ajustes',
    language: 'Idioma',
    theme: 'Tema',
    dark: 'Escuro',
    light: 'Claro',
    default_currency: 'Moeda favorita',
    notifications: 'Notificações',
    data_sources: 'Fontes de dados',
    about: 'Sobre',
    back: 'Voltar',
    done: 'Pronto',
    cancel: 'Cancelar',
    ago_min: 'min',
    ago_h: 'h',
  },
};

Object.assign(window, { CURRENCIES, ALERTS, I18N, genHistory });
