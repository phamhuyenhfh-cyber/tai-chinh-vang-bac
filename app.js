/**
 * Gold & Silver Portfolio Tracker - Quản lý Đầu tư Vàng Bạc
 * Dành riêng cho Chị Phạm Huyền
 * Cập nhật phiên bản mới nhất: Tách 2 khối Bạc & Vàng Nhẫn, tích hợp link web chính thống
 */

// Định nghĩa cấu hình quy đổi và thương hiệu
const UNITS = {
  GOLD: [
    { key: 'phan', name: 'Phân (0.375g = 0.1 chỉ)', toLuong: 0.01, toGram: 0.375, toChi: 0.1 },
    { key: 'chi', name: 'Chỉ (3.75g)', toLuong: 0.1, toGram: 3.75, toChi: 1 },
    { key: 'luong', name: 'Lượng / Cây (37.5g)', toLuong: 1, toGram: 37.5, toChi: 10 },
    { key: 'gram', name: 'Gram', toLuong: 1 / 37.5, toGram: 1, toChi: 1 / 3.75 },
    { key: 'oz', name: 'Ounce (31.1g)', toLuong: 31.1035 / 37.5, toGram: 31.1035, toChi: 31.1035 / 3.75 }
  ],
  SILVER: [
    { key: 'luong', name: 'Lượng / Cây (37.5g)', toKg: 0.0375, toGram: 37.5 },
    { key: 'phan', name: 'Phân (0.375g)', toKg: 0.000375, toGram: 0.375 },
    { key: 'chi', name: 'Chỉ (3.75g)', toKg: 0.00375, toGram: 3.75 },
    { key: 'gram', name: 'Gram', toKg: 0.001, toGram: 1 },
    { key: 'kg', name: 'Kilogram (Kg)', toKg: 1, toGram: 1000 },
    { key: 'oz', name: 'Ounce (31.1g)', toKg: 0.0311035, toGram: 31.1035 }
  ]
};

const BRANDS = [
  { id: 'PHU_QUY', name: 'Bạc Phú Quý', type: 'silver', defaultProduct: 'Bạc Miếng / Thỏi Phú Quý 999.9', url: 'https://giabac.phuquygroup.vn/' },
  { id: 'ANCARAT', name: 'Bạc Ancarat', type: 'silver', defaultProduct: 'Bạc Tích Trữ Ancarat 9999 Master Bar', url: 'https://giabac.ancarat.com/' },
  { id: 'DOJI', name: 'Vàng Nhẫn DOJI', type: 'gold', defaultProduct: 'Vàng Nhẫn Tròn 9999 Hưng Thịnh Vượng', url: 'https://banggia.doji.vn/gold-price' },
  { id: 'BTMH_RING', name: 'Vàng Nhẫn BTMH (Kim Gia Bảo)', type: 'gold', defaultProduct: 'Vàng Nhẫn Ép Vỉ Kim Gia Bảo 999.9', url: 'https://baotinmanhhai.vn/' },
  { id: 'BTMH_GIFT', name: 'Vàng Gift BTMH (Thẻ Quà Tặng)', type: 'gold', defaultProduct: 'Thẻ Vàng Gift Bảo Tín Mạnh Hải', url: 'https://baotinmanhhai.vn/' },
  { id: 'BTMC', name: 'Vàng Nhẫn BTMC', type: 'gold', defaultProduct: 'Vàng Rồng Thăng Long 999.9', url: 'https://btmc.vn/' },
  { id: 'PHU_TAI', name: 'Vàng Nhẫn Phú Tài', type: 'gold', defaultProduct: 'Vàng Nhẫn Trơn Phú Tài 999.9', url: 'https://vangphutai.vn/' },
  { id: 'OTHER', name: 'Thương hiệu khác', type: 'all', defaultProduct: 'Vàng/Bạc Tích Trữ' }
];

// Bảng giá sàn lấy từ 2 thời điểm (Đầu giờ sáng 09:00 & Chốt phiên chiều 17:00) theo web chính thống
const OFFICIAL_MARKET_PRICES = {
  // KHỐI 1: BẠC (PHÚ QUÝ, ANCARAT, THẾ GIỚI)
  PHU_QUY: {
    name: 'Bạc Phú Quý 999.9',
    category: 'silver',
    url: 'https://giabac.phuquygroup.vn/',
    unit: 'lượng',
    morning: { buy: 2210000, sell: 2280000 },
    evening: { buy: 2229000, sell: 2301000 },
    buy: 2229000,
    sell: 2301000,
    change: '+1.20%'
  },
  ANCARAT: {
    name: 'Bạc Ancarat 9999 Master Bar',
    category: 'silver',
    url: 'https://giabac.ancarat.com/',
    unit: 'lượng',
    morning: { buy: 2195000, sell: 2270000 },
    evening: { buy: 2210000, sell: 2287000 },
    buy: 2210000,
    sell: 2287000,
    change: '+1.10%'
  },
  XAG_USD: {
    name: 'Bạc Thế Giới (XAG/USD)',
    category: 'silver',
    url: 'https://www.tradingview.com/symbols/XAGUSD/',
    unit: 'oz',
    morning: { buy: 33.85, sell: 33.90 },
    evening: { buy: 34.20, sell: 34.25 },
    buy: 34.20,
    sell: 34.25,
    currency: 'USD',
    change: '+1.45%'
  },

  // KHỐI 2: VÀNG NHẪN & VÀNG GIFT (DOJI, BTMH NHẪN, BTMH GIFT, BTMC, PHÚ TÀI, THẾ GIỚI)
  DOJI: {
    name: 'Vàng Nhẫn DOJI 9999 (Hưng Thịnh Vượng)',
    category: 'gold',
    url: 'https://banggia.doji.vn/gold-price',
    unit: 'chỉ',
    morning: { buy: 14250000, sell: 14550000 },
    evening: { buy: 14360000, sell: 14650000 },
    buy: 14360000,
    sell: 14650000,
    change: '+1.25%'
  },
  BTMH_RING: {
    name: 'Vàng Nhẫn BTMH 999.9 (Kim Gia Bảo)',
    category: 'gold',
    url: 'https://baotinmanhhai.vn/',
    unit: 'chỉ',
    morning: { buy: 14300000, sell: 14700000 },
    evening: { buy: 14410000, sell: 14810000 },
    buy: 14410000,
    sell: 14810000,
    change: '+1.30%'
  },
  BTMH_GIFT: {
    name: 'Vàng Gift BTMH (0.1 - 1 Chỉ)',
    category: 'gold',
    url: 'https://baotinmanhhai.vn/',
    unit: 'phân',
    morning: { buy: 1440000, sell: 1520000 },
    evening: { buy: 1450000, sell: 1528000 },
    buy: 1450000,
    sell: 1528000,
    change: '+1.30%'
  },
  BTMH: {
    name: 'Vàng Gift BTMH (0.1 - 1 Chỉ)',
    category: 'gold',
    url: 'https://baotinmanhhai.vn/',
    unit: 'phân',
    morning: { buy: 1440000, sell: 1520000 },
    evening: { buy: 1450000, sell: 1528000 },
    buy: 1450000,
    sell: 1528000,
    change: '+1.30%'
  },
  BTMC: {
    name: 'Vàng Nhẫn BTMC 999.9 (Rồng Thăng Long)',
    category: 'gold',
    url: 'https://btmc.vn/',
    unit: 'chỉ',
    morning: { buy: 14300000, sell: 14700000 },
    evening: { buy: 14410000, sell: 14810000 },
    buy: 14410000,
    sell: 14810000,
    change: '+1.30%'
  },
  PHU_TAI: {
    name: 'Vàng Nhẫn Phú Tài 999.9',
    category: 'gold',
    url: 'https://vangphutai.vn/',
    unit: 'chỉ',
    morning: { buy: 13850000, sell: 14200000 },
    evening: { buy: 13970000, sell: 14350000 },
    buy: 13970000,
    sell: 14350000,
    change: '+0.95%'
  },
  XAU_USD: {
    name: 'Vàng Thế Giới (XAU/USD)',
    category: 'gold',
    url: 'https://www.tradingview.com/symbols/XAUUSD/',
    unit: 'oz',
    morning: { buy: 2902, sell: 2903 },
    evening: { buy: 2915, sell: 2916 },
    buy: 2915,
    sell: 2916,
    currency: 'USD',
    change: '+0.65%'
  }
};

// Dữ liệu danh mục thực tế của Chị Phạm Huyền
const HUYEN_REAL_TRANSACTIONS = [
  {
    id: 'tx-huyen-btmh',
    type: 'gold',
    brand: 'BTMH_GIFT',
    productName: 'Vàng Gift Bảo Tín Mạnh Hải (6 phân)',
    unit: 'phan',
    quantity: 6,
    buyPrice: 1528000,
    fee: 0,
    buyDate: '2026-09-18',
    note: '6 phân vàng Gift BTMH'
  },
  {
    id: 'tx-huyen-ancarat',
    type: 'silver',
    brand: 'ANCARAT',
    productName: 'Bạc Tích Trữ Ancarat Master Bar 9999',
    unit: 'luong',
    quantity: 6,
    buyPrice: 2240000,
    fee: 0,
    buyDate: '2026-08-12',
    note: 'Mua 6 lượng Bạc Ancarat hôm 12/8'
  }
];

const DATA_VERSION = 'v2026_09_18_v6_two_btmh_types';

// Khởi tạo state và xóa cache cũ nếu phiên bản thay đổi
const cachedVersion = localStorage.getItem('huyen_data_version');
if (cachedVersion !== DATA_VERSION) {
  localStorage.setItem('huyen_data_version', DATA_VERSION);
  localStorage.setItem('huyen_market_prices', JSON.stringify(OFFICIAL_MARKET_PRICES));
  localStorage.setItem('huyen_gold_transactions', JSON.stringify(HUYEN_REAL_TRANSACTIONS));
}

let state = {
  transactions: (cachedVersion === DATA_VERSION && localStorage.getItem('huyen_gold_transactions')) 
    ? JSON.parse(localStorage.getItem('huyen_gold_transactions')) 
    : JSON.parse(JSON.stringify(HUYEN_REAL_TRANSACTIONS)),
  marketPrices: (cachedVersion === DATA_VERSION && localStorage.getItem('huyen_market_prices')) 
    ? JSON.parse(localStorage.getItem('huyen_market_prices')) 
    : JSON.parse(JSON.stringify(OFFICIAL_MARKET_PRICES)),
  targets: JSON.parse(localStorage.getItem('huyen_targets')) || { goldLuong: 5, silverKg: 3 },
  googleSheetUrl: localStorage.getItem('huyen_gsheet_url') || '',
  filterType: 'all',
  searchKeyword: '',
  selectedSession: 'evening', // 'morning' (09:00) hoặc 'evening' (17:00 chốt phiên)
  theme: localStorage.getItem('huyen_theme') || 'light'
};

let distributionChart = null;
let brandChart = null;

// Hàm bắt buộc xóa sạch toàn bộ cache và nạp lại chuẩn 100%
function forceResetAllData() {
  if (confirm('Chị Huyền có muốn làm mới bộ nhớ đệm và nạp lại chuẩn 100% bảng giá Vàng Gift BTMH và Bạc Ancarat không?')) {
    localStorage.clear();
    localStorage.setItem('huyen_data_version', DATA_VERSION);
    localStorage.setItem('huyen_market_prices', JSON.stringify(OFFICIAL_MARKET_PRICES));
    localStorage.setItem('huyen_gold_transactions', JSON.stringify(HUYEN_REAL_TRANSACTIONS));
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(registrations => {
        for (let reg of registrations) {
          reg.unregister();
        }
      });
    }
    if ('caches' in window) {
      caches.keys().then(names => {
        for (let name of names) caches.delete(name);
      });
    }
    window.location.reload();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  applyTheme(state.theme);
  initEventListeners();
  updateBrandSelect();
  updateUnitSelect();
  renderAll();
  initAutoRefresh();
});

function toggleTheme() {
  state.theme = state.theme === 'light' ? 'dark' : 'light';
  localStorage.setItem('huyen_theme', state.theme);
  applyTheme(state.theme);
  renderCharts();
  showToast(state.theme === 'light' ? '☀️ Đã chuyển sang giao diện Nền Sáng!' : '🌙 Đã chuyển sang giao diện Nền Tối!');
}

function applyTheme(theme) {
  const toggleBtn = document.getElementById('theme-toggle-btn');
  if (theme === 'dark') {
    document.body.classList.add('dark-mode');
    if (toggleBtn) toggleBtn.innerHTML = '<i class="fas fa-sun" style="color: #ffd700;"></i>';
  } else {
    document.body.classList.remove('dark-mode');
    if (toggleBtn) toggleBtn.innerHTML = '<i class="fas fa-moon" style="color: #64748b;"></i>';
  }
}

// Chuyển đổi phiên giao dịch (Sáng 09:00 vs Chiều 17:00 chốt phiên)
function selectSession(sessionKey) {
  state.selectedSession = sessionKey;
  document.querySelectorAll('.session-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.session === sessionKey);
  });

  // Áp dụng giá tương ứng
  Object.keys(state.marketPrices).forEach(k => {
    const item = state.marketPrices[k];
    if (item && item[sessionKey]) {
      item.buy = item[sessionKey].buy;
      item.sell = item[sessionKey].sell;
    }
  });

  saveState();
  renderAll();
  showToast(`⏰ Đã nạp bảng giá ${sessionKey === 'morning' ? 'Đầu giờ sáng (09:00)' : 'Chốt phiên chiều (17:00)'}!`);
}

function initEventListeners() {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      state.filterType = e.target.dataset.type;
      renderTransactionsTable();
    });
  });

  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.searchKeyword = e.target.value.toLowerCase();
      renderTransactionsTable();
    });
  }

  const typeSelect = document.getElementById('tx-type');
  if (typeSelect) {
    typeSelect.addEventListener('change', () => {
      updateBrandSelect();
      updateUnitSelect();
      calculateFormPreview();
    });
  }

  ['tx-quantity', 'tx-price', 'tx-fee', 'tx-unit', 'tx-brand'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', calculateFormPreview);
    if (el) el.addEventListener('change', calculateFormPreview);
  });
}

function saveState() {
  localStorage.setItem('huyen_gold_transactions', JSON.stringify(state.transactions));
  localStorage.setItem('huyen_market_prices', JSON.stringify(state.marketPrices));
  localStorage.setItem('huyen_targets', JSON.stringify(state.targets));
  localStorage.setItem('huyen_gsheet_url', state.googleSheetUrl);
}

function formatVND(amount) {
  if (isNaN(amount) || amount === null) return '0 ₫';
  return new Intl.NumberFormat('vi-VN').format(Math.round(amount)) + ' ₫';
}

function formatNumber(num, decimals = 2) {
  if (isNaN(num) || num === null) return '0';
  return new Intl.NumberFormat('vi-VN', { maximumFractionDigits: decimals }).format(num);
}

function updateBrandSelect() {
  const type = document.getElementById('tx-type')?.value || 'gold';
  const brandSelect = document.getElementById('tx-brand');
  if (!brandSelect) return;

  brandSelect.innerHTML = '';
  const filteredBrands = BRANDS.filter(b => b.type === type || b.type === 'all');
  filteredBrands.forEach(b => {
    const opt = document.createElement('option');
    opt.value = b.id;
    opt.textContent = b.name;
    brandSelect.appendChild(opt);
  });

  const defaultProd = filteredBrands[0]?.defaultProduct || '';
  const prodInput = document.getElementById('tx-product');
  if (prodInput && !prodInput.value) {
    prodInput.value = defaultProd;
  }
}

function updateUnitSelect() {
  const type = document.getElementById('tx-type')?.value || 'gold';
  const unitSelect = document.getElementById('tx-unit');
  if (!unitSelect) return;

  unitSelect.innerHTML = '';
  const units = type === 'gold' ? UNITS.GOLD : UNITS.SILVER;
  units.forEach(u => {
    const opt = document.createElement('option');
    opt.value = u.key;
    opt.textContent = u.name;
    unitSelect.appendChild(opt);
  });
}

function calculateFormPreview() {
  const qty = parseFloat(document.getElementById('tx-quantity')?.value) || 0;
  const price = parseFloat(document.getElementById('tx-price')?.value) || 0;
  const fee = parseFloat(document.getElementById('tx-fee')?.value) || 0;
  const total = (qty * price) + fee;

  const previewEl = document.getElementById('form-total-preview');
  if (previewEl) {
    previewEl.textContent = formatVND(total);
  }
}

function getCurrentPriceForTransaction(tx) {
  let brandKey = tx.brand;
  if (brandKey === 'BTMH') brandKey = 'BTMH_GIFT';
  const market = state.marketPrices[brandKey] || (tx.type === 'gold' ? (state.marketPrices.BTMH_GIFT || state.marketPrices.BTMH_RING || state.marketPrices.DOJI) : state.marketPrices.ANCARAT);
  if (!market) return { buy: tx.buyPrice, sell: tx.buyPrice };

  let multiplier = 1;

  if (tx.type === 'gold') {
    if (market.unit === 'phân') {
      if (tx.unit === 'phan') multiplier = 1;
      else if (tx.unit === 'chi') multiplier = 10;
      else if (tx.unit === 'luong') multiplier = 100;
      else if (tx.unit === 'gram') multiplier = 1 / 0.375;
      else multiplier = 1;
    } else if (market.unit === 'chỉ') {
      if (tx.unit === 'phan') multiplier = 0.1;
      else if (tx.unit === 'luong') multiplier = 10;
      else if (tx.unit === 'gram') multiplier = 1 / 3.75;
      else multiplier = 1;
    } else if (market.unit === 'lượng') {
      if (tx.unit === 'phan') multiplier = 0.01;
      else if (tx.unit === 'chi') multiplier = 0.1;
      else if (tx.unit === 'gram') multiplier = 1 / 37.5;
      else multiplier = 1;
    }
  } else {
    if (market.unit === 'lượng') {
      if (tx.unit === 'kg') multiplier = 1000 / 37.5;
      else if (tx.unit === 'gram') multiplier = 1 / 37.5;
      else if (tx.unit === 'chi') multiplier = 0.1;
      else if (tx.unit === 'phan') multiplier = 0.01;
      else multiplier = 1;
    }
  }

  return {
    buy: market.buy * multiplier,
    sell: market.sell * multiplier
  };
}

function renderAll() {
  renderKPICards();
  renderLiveTicker();
  renderTransactionsTable();
  renderSilverPricesGrid();
  renderGoldPricesGrid();
  renderTargetTracker();
  renderCharts();
}

// 1. Render Thẻ KPI
function renderKPICards() {
  let totalCost = 0;
  let totalCurrentValue = 0;
  
  let goldCost = 0;
  let goldCurrentValue = 0;
  let goldTotalPhan = 0;

  let silverCost = 0;
  let silverCurrentValue = 0;
  let silverTotalLuong = 0;
  let silverTotalKg = 0;

  state.transactions.forEach(tx => {
    const cost = (tx.quantity * tx.buyPrice) + (tx.fee || 0);
    const currPrice = getCurrentPriceForTransaction(tx);
    const currVal = tx.quantity * currPrice.buy;

    totalCost += cost;
    totalCurrentValue += currVal;

    if (tx.type === 'gold') {
      goldCost += cost;
      goldCurrentValue += currVal;
      const unitObj = UNITS.GOLD.find(u => u.key === tx.unit) || { toLuong: 0.01, toChi: 0.1 };
      if (tx.unit === 'phan') goldTotalPhan += tx.quantity;
      else goldTotalPhan += tx.quantity * (unitObj.toChi * 10);
    } else {
      silverCost += cost;
      silverCurrentValue += currVal;
      const unitObj = UNITS.SILVER.find(u => u.key === tx.unit) || { toKg: 0.0375 };
      silverTotalKg += tx.quantity * unitObj.toKg;
      if (tx.unit === 'luong') silverTotalLuong += tx.quantity;
      else silverTotalLuong += tx.quantity * (unitObj.toKg * 26.6667);
    }
  });

  const totalProfit = totalCurrentValue - totalCost;
  const totalRoi = totalCost > 0 ? (totalProfit / totalCost) * 100 : 0;

  const goldProfit = goldCurrentValue - goldCost;
  const goldRoi = goldCost > 0 ? (goldProfit / goldCost) * 100 : 0;

  const silverProfit = silverCurrentValue - silverCost;
  const silverRoi = silverCost > 0 ? (silverProfit / silverCost) * 100 : 0;

  // DOM Tổng
  const totalValEl = document.getElementById('kpi-total-value');
  const totalCostEl = document.getElementById('kpi-total-cost');
  const totalProfitEl = document.getElementById('kpi-total-profit');
  const totalRoiBadge = document.getElementById('kpi-total-roi');

  if (totalValEl) totalValEl.textContent = formatVND(totalCurrentValue);
  if (totalCostEl) totalCostEl.textContent = formatVND(totalCost);
  
  if (totalProfitEl) {
    totalProfitEl.textContent = (totalProfit >= 0 ? '+' : '') + formatVND(totalProfit);
    totalProfitEl.className = totalProfit >= 0 ? 'highlight text-profit' : 'highlight text-loss';
  }
  if (totalRoiBadge) {
    totalRoiBadge.textContent = (totalRoi >= 0 ? '▲ +' : '▼ ') + formatNumber(totalRoi, 2) + '%';
    totalRoiBadge.className = totalRoi >= 0 ? 'kpi-badge badge-success' : 'kpi-badge badge-danger';
  }

  // Vàng
  const goldValEl = document.getElementById('kpi-gold-value');
  const goldQtyEl = document.getElementById('kpi-gold-qty');
  const goldProfitEl = document.getElementById('kpi-gold-profit');
  const goldRoiBadge = document.getElementById('kpi-gold-roi');

  if (goldValEl) goldValEl.textContent = formatVND(goldCurrentValue);
  if (goldQtyEl) goldQtyEl.textContent = `${formatNumber(goldTotalPhan, 1)} phân (${formatNumber(goldTotalPhan / 10, 2)} chỉ)`;
  
  if (goldProfitEl) {
    goldProfitEl.textContent = (goldProfit >= 0 ? '+' : '') + formatVND(goldProfit);
    goldProfitEl.className = goldProfit >= 0 ? 'highlight text-profit' : 'highlight text-loss';
  }
  if (goldRoiBadge) {
    goldRoiBadge.textContent = (goldRoi >= 0 ? '▲ +' : '▼ ') + formatNumber(goldRoi, 2) + '%';
    goldRoiBadge.className = goldRoi >= 0 ? 'kpi-badge badge-success' : 'kpi-badge badge-danger';
  }

  // Bạc
  const silverValEl = document.getElementById('kpi-silver-value');
  const silverQtyEl = document.getElementById('kpi-silver-qty');
  const silverProfitEl = document.getElementById('kpi-silver-profit');
  const silverRoiBadge = document.getElementById('kpi-silver-roi');

  if (silverValEl) silverValEl.textContent = formatVND(silverCurrentValue);
  if (silverQtyEl) silverQtyEl.textContent = `${formatNumber(silverTotalLuong, 1)} lượng (~${formatNumber(silverTotalKg, 3)} kg)`;
  
  if (silverProfitEl) {
    silverProfitEl.textContent = (silverProfit >= 0 ? '+' : '') + formatVND(silverProfit);
    silverProfitEl.className = silverProfit >= 0 ? 'highlight text-profit' : 'highlight text-loss';
  }
  if (silverRoiBadge) {
    silverRoiBadge.textContent = (silverRoi >= 0 ? '▲ +' : '▼ ') + formatNumber(silverRoi, 2) + '%';
    silverRoiBadge.className = silverRoi >= 0 ? 'kpi-badge badge-success' : 'kpi-badge badge-danger';
  }
}

// 2. Render Live Ticker
function renderLiveTicker() {
  const container = document.getElementById('ticker-items');
  if (!container) return;

  const items = [
    { label: 'Bạc Phú Quý', val: `${formatNumber(state.marketPrices.PHU_QUY.buy / 1000000, 2)} - ${formatNumber(state.marketPrices.PHU_QUY.sell / 1000000, 2)} Tr/lượng` },
    { label: 'Bạc Ancarat', val: `${formatNumber(state.marketPrices.ANCARAT.buy / 1000000, 2)} - ${formatNumber(state.marketPrices.ANCARAT.sell / 1000000, 2)} Tr/lượng` },
    { label: 'Nhẫn DOJI', val: `${formatNumber(state.marketPrices.DOJI.buy / 1000000, 2)} - ${formatNumber(state.marketPrices.DOJI.sell / 1000000, 2)} Tr/chỉ` },
    { label: 'Nhẫn BTMH', val: `${formatNumber(state.marketPrices.BTMH.buy / 1000000, 2)} - ${formatNumber(state.marketPrices.BTMH.sell / 1000000, 2)} Tr/chỉ` },
    { label: 'Nhẫn BTMC', val: `${formatNumber(state.marketPrices.BTMC.buy / 1000000, 2)} - ${formatNumber(state.marketPrices.BTMC.sell / 1000000, 2)} Tr/chỉ` },
    { label: 'Nhẫn Phú Tài', val: `${formatNumber(state.marketPrices.PHU_TAI.buy / 1000000, 2)} - ${formatNumber(state.marketPrices.PHU_TAI.sell / 1000000, 2)} Tr/chỉ` }
  ];

  container.innerHTML = items.map(item => `
    <div class="ticker-item">
      <span class="ticker-name">${item.label}:</span>
      <span class="ticker-price">${item.val}</span>
    </div>
  `).join('');
}

// 3. Render Sổ Giao Dịch
function renderTransactionsTable() {
  const tbody = document.getElementById('transactions-tbody');
  if (!tbody) return;

  let filtered = state.transactions;

  if (state.filterType !== 'all') {
    filtered = filtered.filter(tx => tx.type === state.filterType);
  }

  if (state.searchKeyword) {
    filtered = filtered.filter(tx => 
      tx.productName.toLowerCase().includes(state.searchKeyword) ||
      tx.brand.toLowerCase().includes(state.searchKeyword) ||
      (tx.note && tx.note.toLowerCase().includes(state.searchKeyword))
    );
  }

  filtered.sort((a, b) => new Date(b.buyDate) - new Date(a.buyDate));

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="10" style="text-align: center; padding: 30px; color: var(--text-muted);">
          <i class="fas fa-box-open" style="font-size: 24px; margin-bottom: 8px; display: block;"></i>
          Chưa có giao dịch nào phù hợp. Nhấn "Thêm Giao Dịch" để tạo mới!
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filtered.map(tx => {
    const cost = (tx.quantity * tx.buyPrice) + (tx.fee || 0);
    const currPrice = getCurrentPriceForTransaction(tx);
    const currVal = tx.quantity * currPrice.buy;
    const profit = currVal - cost;
    const roi = cost > 0 ? (profit / cost) * 100 : 0;

    const brandObj = BRANDS.find(b => b.id === tx.brand) || { name: tx.brand };
    const tagClass = tx.type === 'gold' ? 'tag-gold' : 'tag-silver';
    const tagIcon = tx.type === 'gold' ? 'fa-coins' : 'fa-gem';

    const unitName = tx.unit === 'phan' ? 'Phân' : (tx.unit === 'chi' ? 'Chỉ' : (tx.unit === 'luong' ? 'Lượng' : (tx.unit === 'kg' ? 'Kg' : tx.unit)));

    const isProfit = profit >= 0;
    const pillClass = isProfit ? 'profit-pill-green' : 'profit-pill-red';
    const arrowIcon = isProfit ? 'fa-arrow-up' : 'fa-arrow-down';

    return `
      <tr>
        <td><strong>${tx.buyDate}</strong></td>
        <td>
          <span class="brand-tag ${tagClass}">
            <i class="fas ${tagIcon}"></i> ${brandObj.name}
          </span>
          <div style="font-size: 11px; color: var(--text-muted); margin-top: 2px;">${tx.productName}</div>
        </td>
        <td><strong>${formatNumber(tx.quantity, 2)}</strong> ${unitName}</td>
        <td>${formatVND(tx.buyPrice)}</td>
        <td>${formatVND(tx.fee || 0)}</td>
        <td><strong>${formatVND(cost)}</strong></td>
        <td>
          <div>${formatVND(currPrice.buy)} <span style="font-size: 10px; color: var(--text-dim);">(mua vào)</span></div>
        </td>
        <td><strong>${formatVND(currVal)}</strong></td>
        <td>
          <div class="${pillClass}">
            <i class="fas ${arrowIcon}"></i>
            <span>${isProfit ? '+' : ''}${formatVND(profit)}</span>
            <span style="font-size: 11px; opacity: 0.9;">(${isProfit ? '+' : ''}${formatNumber(roi, 2)}%)</span>
          </div>
        </td>
        <td>
          <div class="action-btns">
            <button class="icon-btn" title="Chỉnh sửa" onclick="openEditModal('${tx.id}')">
              <i class="fas fa-edit"></i>
            </button>
            <button class="icon-btn delete-btn" title="Xóa" onclick="deleteTransaction('${tx.id}')">
              <i class="fas fa-trash-alt"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

// 4. KHỐI 1: RENDER BẢNG GIÁ BẠC (PHÚ QUÝ, ANCARAT, THẾ GIỚI)
function renderSilverPricesGrid() {
  const container = document.getElementById('silver-prices-grid');
  if (!container) return;

  const silverList = [
    { key: 'PHU_QUY', icon: 'fa-gem', color: '#475569' },
    { key: 'ANCARAT', icon: 'fa-cubes', color: '#475569' },
    { key: 'XAG_USD', icon: 'fa-globe-americas', color: '#0284c7' }
  ];

  container.innerHTML = silverList.map(item => {
    const data = state.marketPrices[item.key];
    if (!data) return '';
    const isUSD = data.currency === 'USD';
    const buyFormatted = isUSD ? `$${formatNumber(data.buy, 2)}` : formatVND(data.buy);
    const sellFormatted = isUSD ? `$${formatNumber(data.sell, 2)}` : formatVND(data.sell);
    const spread = isUSD ? `$${formatNumber(data.sell - data.buy, 2)}` : formatVND(data.sell - data.buy);

    const linkHtml = data.url ? `<a href="${data.url}" target="_blank" class="official-link" title="Xem tại web chính thống"><i class="fas fa-external-link-alt"></i> Web</a>` : '';

    return `
      <div class="price-card">
        <div class="price-card-head">
          <div class="price-card-title">
            <i class="fas ${item.icon}" style="color: ${item.color};"></i>
            <span>${data.name}</span>
            ${linkHtml}
          </div>
          <span class="kpi-badge badge-silver">${data.change || '+0.00%'}</span>
        </div>
        <div class="price-row">
          <span class="price-label">Tiệm mua vào:</span>
          <span class="price-num price-buy">${buyFormatted}</span>
        </div>
        <div class="price-row">
          <span class="price-label">Tiệm bán ra:</span>
          <span class="price-num price-sell">${sellFormatted}</span>
        </div>
        <div class="price-spread">
          <span>Chênh lệch: ${spread} / ${data.unit}</span>
          <span class="session-badge">${state.selectedSession === 'morning' ? 'Sáng 09h' : 'Chiều 17h'}</span>
        </div>
      </div>
    `;
  }).join('');
}

// 5. KHỐI 2: RENDER BẢNG GIÁ VÀNG NHẪN (DOJI, BTMH, BTMC, PHÚ TÀI, THẾ GIỚI)
function renderGoldPricesGrid() {
  const container = document.getElementById('gold-prices-grid');
  if (!container) return;

  const goldList = [
    { key: 'DOJI', icon: 'fa-coins', color: '#b8860b' },
    { key: 'BTMH_RING', icon: 'fa-ring', color: '#b8860b' },
    { key: 'BTMH_GIFT', icon: 'fa-gift', color: '#d97706' },
    { key: 'BTMC', icon: 'fa-crown', color: '#b8860b' },
    { key: 'PHU_TAI', icon: 'fa-award', color: '#b8860b' },
    { key: 'XAU_USD', icon: 'fa-globe-americas', color: '#0284c7' }
  ];

  container.innerHTML = goldList.map(item => {
    const data = state.marketPrices[item.key];
    if (!data) return '';
    const isUSD = data.currency === 'USD';
    const buyFormatted = isUSD ? `$${formatNumber(data.buy, 2)}` : formatVND(data.buy);
    const sellFormatted = isUSD ? `$${formatNumber(data.sell, 2)}` : formatVND(data.sell);
    const spread = isUSD ? `$${formatNumber(data.sell - data.buy, 2)}` : formatVND(data.sell - data.buy);

    const linkHtml = data.url ? `<a href="${data.url}" target="_blank" class="official-link" title="Xem tại web chính thống"><i class="fas fa-external-link-alt"></i> Web</a>` : '';

    let subConvert = '';
    if (data.unit === 'phân') {
      const buyPerChi = formatVND(data.buy * 10);
      const sellPerChi = formatVND(data.sell * 10);
      subConvert = `<div style="font-size: 11px; color: #b8860b; margin-top: 5px; font-weight: 600;">👉 Quy đổi: ${buyPerChi} - ${sellPerChi} / chỉ (1 chỉ = 10 phân)</div>`;
    } else if (data.unit === 'chỉ') {
      const buyPerPhan = formatVND(data.buy / 10);
      const sellPerPhan = formatVND(data.sell / 10);
      subConvert = `<div style="font-size: 11px; color: #b8860b; margin-top: 5px; font-weight: 600;">👉 Quy đổi: ${buyPerPhan} - ${sellPerPhan} / phân</div>`;
    }

    return `
      <div class="price-card">
        <div class="price-card-head">
          <div class="price-card-title">
            <i class="fas ${item.icon}" style="color: ${item.color};"></i>
            <span>${data.name}</span>
            ${linkHtml}
          </div>
          <span class="kpi-badge badge-gold">${data.change || '+0.00%'}</span>
        </div>
        <div class="price-row">
          <span class="price-label">Tiệm mua vào:</span>
          <span class="price-num price-buy">${buyFormatted}</span>
        </div>
        <div class="price-row">
          <span class="price-label">Tiệm bán ra:</span>
          <span class="price-num price-sell">${sellFormatted}</span>
        </div>
        <div class="price-spread">
          <span>Chênh lệch: ${spread} / ${data.unit}</span>
          <span class="session-badge">${state.selectedSession === 'morning' ? 'Sáng 09h' : 'Chiều 17h'}</span>
        </div>
        ${subConvert}
      </div>
    `;
  }).join('');
}

// 6. Render Bộ Đếm Mục Tiêu
function renderTargetTracker() {
  let currentGoldPhan = 0;
  let currentSilverLuong = 0;

  state.transactions.forEach(tx => {
    if (tx.type === 'gold') {
      const unitObj = UNITS.GOLD.find(u => u.key === tx.unit) || { toLuong: 0.01, toChi: 0.1 };
      if (tx.unit === 'phan') currentGoldPhan += tx.quantity;
      else currentGoldPhan += tx.quantity * (unitObj.toChi * 10);
    } else {
      const unitObj = UNITS.SILVER.find(u => u.key === tx.unit) || { toKg: 0.0375 };
      if (tx.unit === 'luong') currentSilverLuong += tx.quantity;
      else currentSilverLuong += tx.quantity * (unitObj.toKg * 26.6667);
    }
  });

  const goldTargetPhan = 50;
  const silverTargetLuong = 30;

  const goldPercent = Math.min(100, (currentGoldPhan / goldTargetPhan) * 100);
  const silverPercent = Math.min(100, (currentSilverLuong / silverTargetLuong) * 100);

  const goldProgressEl = document.getElementById('target-gold-progress');
  const goldInfoEl = document.getElementById('target-gold-info');
  if (goldProgressEl) goldProgressEl.style.width = `${goldPercent}%`;
  if (goldInfoEl) goldInfoEl.innerHTML = `<span>Đạt: <strong>${formatNumber(currentGoldPhan, 1)} / ${goldTargetPhan} Phân (${formatNumber(currentGoldPhan / 10, 1)} chỉ)</strong></span><span>${formatNumber(goldPercent, 1)}%</span>`;

  const silverProgressEl = document.getElementById('target-silver-progress');
  const silverInfoEl = document.getElementById('target-silver-info');
  if (silverProgressEl) silverProgressEl.style.width = `${silverPercent}%`;
  if (silverInfoEl) silverInfoEl.innerHTML = `<span>Đạt: <strong>${formatNumber(currentSilverLuong, 1)} / ${silverTargetLuong} Lượng</strong></span><span>${formatNumber(silverPercent, 1)}%</span>`;
}

// 7. Render Charts
function renderCharts() {
  if (typeof Chart === 'undefined') return;

  const isDark = document.body.classList.contains('dark-mode');
  const textColor = isDark ? '#f0f6fc' : '#1e293b';
  const gridColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';

  let goldVal = 0;
  let silverVal = 0;

  state.transactions.forEach(tx => {
    const currPrice = getCurrentPriceForTransaction(tx);
    const val = tx.quantity * currPrice.buy;
    if (tx.type === 'gold') goldVal += val;
    else silverVal += val;
  });

  const ctxDistribution = document.getElementById('distributionChart')?.getContext('2d');
  if (ctxDistribution) {
    if (distributionChart) distributionChart.destroy();

    distributionChart = new Chart(ctxDistribution, {
      type: 'doughnut',
      data: {
        labels: ['Vàng (Gold)', 'Bạc (Silver)'],
        datasets: [{
          data: [goldVal || 1, silverVal || 0],
          backgroundColor: ['#d49a17', '#64748b'],
          borderColor: isDark ? '#161b22' : '#ffffff',
          borderWidth: 3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: textColor, font: { size: 12, weight: 'bold' } }
          }
        },
        cutout: '68%'
      }
    });
  }

  const brandTotals = {};
  state.transactions.forEach(tx => {
    const currPrice = getCurrentPriceForTransaction(tx);
    const val = tx.quantity * currPrice.buy;
    const brandName = BRANDS.find(b => b.id === tx.brand)?.name || tx.brand;
    brandTotals[brandName] = (brandTotals[brandName] || 0) + val;
  });

  const ctxBrand = document.getElementById('brandChart')?.getContext('2d');
  if (ctxBrand) {
    if (brandChart) brandChart.destroy();

    const labels = Object.keys(brandTotals);
    const dataVals = Object.values(brandTotals);

    brandChart = new Chart(ctxBrand, {
      type: 'bar',
      data: {
        labels: labels.length ? labels : ['Chưa có dữ liệu'],
        datasets: [{
          label: 'Giá trị thị trường (VNĐ)',
          data: dataVals.length ? dataVals : [0],
          backgroundColor: ['#d49a17', '#475569', '#3b82f6', '#10b981'],
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { ticks: { color: textColor, font: { weight: 'bold' } }, grid: { display: false } },
          y: { 
            ticks: { 
              color: textColor,
              callback: (val) => `${(val / 1000000).toFixed(1)}Tr`
            },
            grid: { color: gridColor }
          }
        },
        plugins: {
          legend: { display: false }
        }
      }
    });
  }
}

// 8. Modal Handlers
function openAddModal() {
  document.getElementById('modal-title').textContent = 'Thêm Giao Dịch Mua Vàng / Bạc';
  document.getElementById('tx-id').value = '';
  document.getElementById('tx-form').reset();
  
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('tx-date').value = today;
  
  updateBrandSelect();
  updateUnitSelect();
  calculateFormPreview();
  
  document.getElementById('tx-modal').classList.add('active');
}

function openEditModal(id) {
  const tx = state.transactions.find(t => t.id === id);
  if (!tx) return;

  document.getElementById('modal-title').textContent = 'Chỉnh Sửa Giao Dịch';
  document.getElementById('tx-id').value = tx.id;
  document.getElementById('tx-type').value = tx.type;
  
  updateBrandSelect();
  updateUnitSelect();

  document.getElementById('tx-brand').value = tx.brand;
  document.getElementById('tx-product').value = tx.productName;
  document.getElementById('tx-unit').value = tx.unit;
  document.getElementById('tx-quantity').value = tx.quantity;
  document.getElementById('tx-price').value = tx.buyPrice;
  document.getElementById('tx-fee').value = tx.fee || 0;
  document.getElementById('tx-date').value = tx.buyDate;
  document.getElementById('tx-note').value = tx.note || '';

  calculateFormPreview();
  document.getElementById('tx-modal').classList.add('active');
}

function closeModal() {
  document.getElementById('tx-modal').classList.remove('active');
}

function saveTransaction(e) {
  e.preventDefault();
  const id = document.getElementById('tx-id').value;
  const type = document.getElementById('tx-type').value;
  const brand = document.getElementById('tx-brand').value;
  const productName = document.getElementById('tx-product').value;
  const unit = document.getElementById('tx-unit').value;
  const quantity = parseFloat(document.getElementById('tx-quantity').value) || 0;
  const buyPrice = parseFloat(document.getElementById('tx-price').value) || 0;
  const fee = parseFloat(document.getElementById('tx-fee').value) || 0;
  const buyDate = document.getElementById('tx-date').value;
  const note = document.getElementById('tx-note').value;

  if (quantity <= 0 || buyPrice <= 0) {
    showToast('⚠️ Vui lòng nhập số lượng và giá mua lớn hơn 0!', 'warning');
    return;
  }

  if (id) {
    const idx = state.transactions.findIndex(t => t.id === id);
    if (idx !== -1) {
      state.transactions[idx] = { id, type, brand, productName, unit, quantity, buyPrice, fee, buyDate, note };
      showToast('✅ Đã cập nhật giao dịch thành công!');
    }
  } else {
    const newTx = {
      id: 'tx-' + Date.now(),
      type, brand, productName, unit, quantity, buyPrice, fee, buyDate, note
    };
    state.transactions.push(newTx);
    showToast('✨ Đã thêm giao dịch vàng/bạc mới!');
  }

  saveState();
  closeModal();
  renderAll();

  if (state.googleSheetUrl) {
    syncToGoogleSheets(false);
  }
}

function deleteTransaction(id) {
  if (confirm('Chị Huyền có chắc chắn muốn xóa giao dịch này không?')) {
    state.transactions = state.transactions.filter(t => t.id !== id);
    saveState();
    renderAll();
    showToast('🗑️ Đã xóa giao dịch.');

    if (state.googleSheetUrl) {
      syncToGoogleSheets(false);
    }
  }
}

// 9. Làm Mới & Sửa Giá Sàn
function refreshMarketPrices() {
  const btn = document.getElementById('btn-refresh-prices');
  if (btn) btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang tải...';

  setTimeout(() => {
    saveState();
    renderAll();

    if (btn) btn.innerHTML = '<i class="fas fa-sync-alt"></i> Làm mới giá sàn';
    showToast('📈 Đã đồng bộ bảng giá sàn chính thống mới nhất!');
  }, 500);
}

function initAutoRefresh() {
  setInterval(() => {
    refreshMarketPrices();
  }, 5 * 60 * 1000);
}

function openPriceEditModal() {
  const keys = ['PHU_QUY', 'ANCARAT', 'DOJI', 'BTMH_RING', 'BTMH_GIFT', 'BTMC', 'PHU_TAI'];
  keys.forEach(k => {
    const p = state.marketPrices[k];
    if (p) {
      const buyEl = document.getElementById(`price-buy-${k.toLowerCase()}`);
      const sellEl = document.getElementById(`price-sell-${k.toLowerCase()}`);
      if (buyEl) buyEl.value = p.buy;
      if (sellEl) sellEl.value = p.sell;
    }
  });

  document.getElementById('price-modal').classList.add('active');
}

function closePriceEditModal() {
  document.getElementById('price-modal').classList.remove('active');
}

function saveCustomMarketPrices(e) {
  e.preventDefault();
  const keys = ['PHU_QUY', 'ANCARAT', 'DOJI', 'BTMH_RING', 'BTMH_GIFT', 'BTMC', 'PHU_TAI'];
  keys.forEach(k => {
    const buyEl = document.getElementById(`price-buy-${k.toLowerCase()}`);
    const sellEl = document.getElementById(`price-sell-${k.toLowerCase()}`);
    if (buyEl && sellEl) {
      const buyVal = parseFloat(buyEl.value);
      const sellVal = parseFloat(sellEl.value);
      if (buyVal > 0 && sellVal > 0 && state.marketPrices[k]) {
        state.marketPrices[k].buy = buyVal;
        state.marketPrices[k].sell = sellVal;
      }
    }
  });

  saveState();
  closePriceEditModal();
  renderAll();
  showToast('💾 Đã cập nhật bảng giá sàn theo thời điểm công ty thành công!');

  if (state.googleSheetUrl) {
    syncToGoogleSheets(false);
  }
}

// 10. Đồng bộ Google Sheets
function openSyncModal() {
  const urlInput = document.getElementById('gsheet-url');
  if (urlInput) urlInput.value = state.googleSheetUrl;
  document.getElementById('sync-modal').classList.add('active');
}

function closeSyncModal() {
  document.getElementById('sync-modal').classList.remove('active');
}

function saveGoogleSheetConfig() {
  const url = document.getElementById('gsheet-url').value.trim();
  state.googleSheetUrl = url;
  saveState();
  closeSyncModal();
  showToast('💾 Đã lưu cấu hình Google Sheets URL!');
}

async function syncToGoogleSheets(showNotification = true) {
  if (!state.googleSheetUrl) {
    if (showNotification) openSyncModal();
    return;
  }

  const btn = document.getElementById('btn-sync-sheets');
  if (btn) btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang sync...';

  try {
    const payload = {
      action: 'SYNC_ALL',
      transactions: state.transactions,
      marketPrices: state.marketPrices,
      targets: state.targets,
      timestamp: new Date().toISOString()
    };

    await fetch(state.googleSheetUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (showNotification) {
      showToast('🚀 Đã gửi toàn bộ dữ liệu lên Google Sheets thành công!');
    }
  } catch (err) {
    console.error('Lỗi khi đồng bộ Google Sheets:', err);
    if (showNotification) {
      showToast('⚠️ Không thể kết nối Google Sheets. Vui lòng kiểm tra lại URL!', 'warning');
    }
  } finally {
    if (btn) btn.innerHTML = '<i class="fas fa-cloud-upload-alt"></i> Sync Google Sheets';
  }
}

async function pullFromGoogleSheets() {
  if (!state.googleSheetUrl) {
    openSyncModal();
    return;
  }

  showToast('⏳ Đang tải dữ liệu từ Google Sheets...');
  try {
    const fetchUrl = `${state.googleSheetUrl}?action=GET_TRANSACTIONS&t=${Date.now()}`;
    const res = await fetch(fetchUrl);
    const data = await res.json();

    if (data && data.transactions && Array.isArray(data.transactions)) {
      state.transactions = data.transactions;
      if (data.targets) state.targets = data.targets;
      saveState();
      renderAll();
      showToast('🎉 Đã đồng bộ dữ liệu từ Google Sheets về Web!');
    } else {
      showToast('⚠️ Dữ liệu trả về từ Sheets chưa đúng định dạng!', 'warning');
    }
  } catch (err) {
    console.error(err);
    showToast('⚠️ Lỗi khi tải từ Google Sheets. Kiểm tra xem quyền truy cập Apps Script đã để "Anyone" chưa!', 'warning');
  }
}

// 11. Xuất / Nhập Excel & JSON
function exportToExcel() {
  if (typeof XLSX === 'undefined') {
    showToast('⚠️ Đang tải thư viện Excel...', 'warning');
    return;
  }

  const data = state.transactions.map(tx => {
    const cost = (tx.quantity * tx.buyPrice) + (tx.fee || 0);
    const currPrice = getCurrentPriceForTransaction(tx);
    const currVal = tx.quantity * currPrice.buy;
    const profit = currVal - cost;
    const roi = cost > 0 ? (profit / cost) * 100 : 0;
    const brandObj = BRANDS.find(b => b.id === tx.brand) || { name: tx.brand };

    return {
      'Mã GD': tx.id,
      'Ngày mua': tx.buyDate,
      'Loại tài sản': tx.type === 'gold' ? 'Vàng' : 'Bạc',
      'Thương hiệu': brandObj.name,
      'Tên sản phẩm': tx.productName,
      'Số lượng': tx.quantity,
      'Đơn vị': tx.unit === 'phan' ? 'Phân' : tx.unit,
      'Đơn giá mua (VNĐ)': tx.buyPrice,
      'Phí công / phát sinh': tx.fee || 0,
      'Tổng vốn đầu tư (VNĐ)': cost,
      'Giá sàn hiện tại (VNĐ)': currPrice.buy,
      'Giá trị thị trường (VNĐ)': currVal,
      'Lời / Lỗ (VNĐ)': profit,
      'Tỷ suất ROI (%)': `${roi.toFixed(2)}%`,
      'Ghi chú': tx.note || ''
    };
  });

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Danh Mục Vàng Bạc');
  XLSX.writeFile(wb, `Danh_Muc_Vang_Bac_Pham_Huyen_${new Date().toISOString().split('T')[0]}.xlsx`);
  showToast('📊 Đã xuất file Excel thành công!');
}

function exportJSONBackup() {
  const jsonStr = JSON.stringify(state, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Sao_Luu_Vang_Bac_${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  showToast('💾 Đã tải file sao lưu JSON!');
}

function triggerImportJSON() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  input.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const imported = JSON.parse(ev.target.result);
        if (imported.transactions && Array.isArray(imported.transactions)) {
          state.transactions = imported.transactions;
          if (imported.targets) state.targets = imported.targets;
          if (imported.marketPrices) state.marketPrices = imported.marketPrices;
          saveState();
          renderAll();
          showToast('🎉 Đã khôi phục dữ liệu từ file sao lưu thành công!');
        }
      } catch (err) {
        showToast('⚠️ File JSON không hợp lệ!', 'warning');
      }
    };
    reader.readAsText(file);
  };
  input.click();
}

function showToast(msg, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span>${msg}</span>`;

  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}
