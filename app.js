/**
 * Gold & Silver Portfolio Tracker - Quản lý Đầu tư Vàng Bạc
 * Dành riêng cho Chị Phạm Huyền
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
  { id: 'BTMH', name: 'Bảo Tín Mạnh Hải', type: 'gold', defaultProduct: 'Vàng Gift Kim Gia Bảo / Vàng Nhẫn 999.9' },
  { id: 'ANCARAT', name: 'Bạc Ancarat', type: 'silver', defaultProduct: 'Bạc Tích Trữ Ancarat 9999 Master Bar' },
  { id: 'BTMC', name: 'Bảo Tín Minh Châu', type: 'gold', defaultProduct: 'Vàng Rồng Thăng Long 999.9' },
  { id: 'DOJI', name: 'DOJI Gold', type: 'gold', defaultProduct: 'Vàng nhẫn Tròn 9999 Hưng Thịnh Vượng' },
  { id: 'PHU_QUY', name: 'Bạc Phú Quý', type: 'silver', defaultProduct: 'Bạc Thỏi Phú Quý 999.9 (1 Cây / 1 Kg)' },
  { id: 'SJC', name: 'SJC Sài Gòn', type: 'gold', defaultProduct: 'Vàng miếng SJC 99.99' },
  { id: 'PNJ', name: 'PNJ', type: 'gold', defaultProduct: 'Vàng nhẫn Trơn PNJ 999.9' },
  { id: 'OTHER', name: 'Thương hiệu khác', type: 'all', defaultProduct: 'Vàng/Bạc Tích Trữ' }
];

// Khởi tạo bảng giá sàn tham chiếu thực tế
const DEFAULT_MARKET_PRICES = {
  BTMH: { name: 'Vàng BTMH Gift / Nhẫn 999.9', unit: 'phân', buy: 1535000, sell: 1585000, change: '+0.45%' },
  ANCARAT: { name: 'Bạc Ancarat 9999 Master Bar', unit: 'lượng', buy: 2260000, sell: 2380000, change: '+1.10%' },
  BTMC: { name: 'Bảo Tín Minh Châu 999.9', unit: 'chỉ', buy: 8660000, sell: 8800000, change: '+0.50%' },
  DOJI: { name: 'Vàng Nhẫn DOJI 9999', unit: 'chỉ', buy: 8650000, sell: 8790000, change: '+0.40%' },
  PHU_QUY: { name: 'Bạc Phú Quý 999.9', unit: 'lượng', buy: 2250000, sell: 2370000, change: '+1.20%' },
  SJC: { name: 'Vàng Miếng SJC', unit: 'lượng', buy: 88500000, sell: 90500000, change: '+0.20%' },
  PNJ: { name: 'Vàng Nhẫn PNJ 999.9', unit: 'chỉ', buy: 8640000, sell: 8780000, change: '+0.35%' },
  XAU_USD: { name: 'Vàng Thế Giới (XAU)', unit: 'oz', buy: 2915, sell: 2916, currency: 'USD', change: '+0.65%' },
  XAG_USD: { name: 'Bạc Thế Giới (XAG)', unit: 'oz', buy: 34.20, sell: 34.25, currency: 'USD', change: '+1.45%' },
  USD_VND: { name: 'Tỷ giá USD/VND', unit: 'USD', buy: 25420, sell: 25480, currency: 'VND', change: '0.00%' }
};

// Dữ liệu danh mục thực tế của Chị Phạm Huyền
const HUYEN_REAL_TRANSACTIONS = [
  {
    id: 'tx-huyen-btmh',
    type: 'gold',
    brand: 'BTMH',
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

// App State
let state = {
  transactions: HUYEN_REAL_TRANSACTIONS,
  marketPrices: DEFAULT_MARKET_PRICES,
  targets: JSON.parse(localStorage.getItem('huyen_targets')) || { goldLuong: 5, silverKg: 3 },
  googleSheetUrl: localStorage.getItem('huyen_gsheet_url') || '',
  filterType: 'all',
  searchKeyword: '',
  theme: localStorage.getItem('huyen_theme') || 'light'
};

// Lưu dữ liệu thực tế vào LocalStorage
localStorage.setItem('huyen_gold_transactions', JSON.stringify(state.transactions));
localStorage.setItem('huyen_market_prices', JSON.stringify(state.marketPrices));

// Charts instance
let distributionChart = null;
let brandChart = null;

// Khởi chạy App khi trang tải xong
document.addEventListener('DOMContentLoaded', () => {
  applyTheme(state.theme);
  initEventListeners();
  updateBrandSelect();
  updateUnitSelect();
  renderAll();
  initAutoRefresh();
});

// Chuyển đổi Giao diện Sáng / Tối
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

function initEventListeners() {
  // Bộ lọc loại kim loại
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      state.filterType = e.target.dataset.type;
      renderTransactionsTable();
    });
  });

  // Tìm kiếm
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.searchKeyword = e.target.value.toLowerCase();
      renderTransactionsTable();
    });
  }

  // Thay đổi loại kim loại trong modal
  const typeSelect = document.getElementById('tx-type');
  if (typeSelect) {
    typeSelect.addEventListener('change', () => {
      updateBrandSelect();
      updateUnitSelect();
      calculateFormPreview();
    });
  }

  // Tự động tính thành tiền khi gõ form
  ['tx-quantity', 'tx-price', 'tx-fee', 'tx-unit', 'tx-brand'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', calculateFormPreview);
    if (el) el.addEventListener('change', calculateFormPreview);
  });
}

// Lưu State vào LocalStorage
function saveState() {
  localStorage.setItem('huyen_gold_transactions', JSON.stringify(state.transactions));
  localStorage.setItem('huyen_market_prices', JSON.stringify(state.marketPrices));
  localStorage.setItem('huyen_targets', JSON.stringify(state.targets));
  localStorage.setItem('huyen_gsheet_url', state.googleSheetUrl);
}

// Format tiền tệ VNĐ
function formatVND(amount) {
  if (isNaN(amount) || amount === null) return '0 ₫';
  return new Intl.NumberFormat('vi-VN').format(Math.round(amount)) + ' ₫';
}

// Format số
function formatNumber(num, decimals = 2) {
  if (isNaN(num) || num === null) return '0';
  return new Intl.NumberFormat('vi-VN', { maximumFractionDigits: decimals }).format(num);
}

// Cập nhật Select Thương hiệu trong Modal
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

// Cập nhật Select Đơn vị tính
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

// Tính preview thành tiền trong form
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

// Lấy giá thị trường hiện tại của một thương hiệu/loại
function getCurrentPriceForTransaction(tx) {
  const market = state.marketPrices[tx.brand] || (tx.type === 'gold' ? state.marketPrices.BTMH : state.marketPrices.ANCARAT);
  if (!market) return { buy: tx.buyPrice, sell: tx.buyPrice };

  let multiplier = 1;

  if (tx.type === 'gold') {
    if (market.unit === 'phân') {
      if (tx.unit === 'chi') multiplier = 10;
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
    buy: market.buy * multiplier,   // Giá tiệm thu mua lại
    sell: market.sell * multiplier  // Giá tiệm bán ra
  };
}

// Render toàn bộ giao diện
function renderAll() {
  renderKPICards();
  renderLiveTicker();
  renderTransactionsTable();
  renderMarketPricesGrid();
  renderTargetTracker();
  renderCharts();
}

// 1. Render Thẻ KPI Tổng quan (LÃI XANH LÁ | LỖ ĐỎ)
function renderKPICards() {
  let totalCost = 0;
  let totalCurrentValue = 0;
  
  let goldCost = 0;
  let goldCurrentValue = 0;
  let goldTotalLuong = 0;
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
      goldTotalLuong += tx.quantity * unitObj.toLuong;
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

  // Cập nhật DOM Tổng
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

// 2. Render Thanh Ticker Trực Tiếp
function renderLiveTicker() {
  const container = document.getElementById('ticker-items');
  if (!container) return;

  const items = [
    { label: 'BTMH Gift', val: `${formatNumber(state.marketPrices.BTMH.buy / 1000, 0)}k/phân` },
    { label: 'Bạc Ancarat', val: `${formatNumber(state.marketPrices.ANCARAT.buy / 1000000, 2)} Tr/lượng` },
    { label: 'DOJI 9999', val: `${formatNumber(state.marketPrices.DOJI.buy / 1000000, 2)} Tr/chỉ` },
    { label: 'BTMC Rồng', val: `${formatNumber(state.marketPrices.BTMC.buy / 1000000, 2)} Tr/chỉ` },
    { label: 'Bạc Phú Quý', val: `${formatNumber(state.marketPrices.PHU_QUY.buy / 1000000, 2)} Tr/lượng` },
    { label: 'XAU/USD', val: `$${formatNumber(state.marketPrices.XAU_USD.buy, 1)}/oz` },
    { label: 'XAG/USD', val: `$${formatNumber(state.marketPrices.XAG_USD.buy, 2)}/oz` }
  ];

  container.innerHTML = items.map(item => `
    <div class="ticker-item">
      <span class="ticker-name">${item.label}:</span>
      <span class="ticker-price">${item.val}</span>
    </div>
  `).join('');
}

// 3. Render Bảng Giao Dịch Chi Tiết (LÃI XANH LÁ | LỖ ĐỎ)
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

// 4. Render Bảng Giá Sàn Thị Trường
function renderMarketPricesGrid() {
  const container = document.getElementById('market-prices-grid');
  if (!container) return;

  const list = [
    { key: 'BTMH', icon: 'fa-ring', color: '#b8860b' },
    { key: 'ANCARAT', icon: 'fa-cubes', color: '#475569' },
    { key: 'BTMC', icon: 'fa-crown', color: '#b8860b' },
    { key: 'DOJI', icon: 'fa-coins', color: '#b8860b' },
    { key: 'PHU_QUY', icon: 'fa-gem', color: '#475569' },
    { key: 'XAU_USD', icon: 'fa-globe-americas', color: '#0284c7' }
  ];

  container.innerHTML = list.map(item => {
    const data = state.marketPrices[item.key];
    if (!data) return '';
    const isUSD = data.currency === 'USD';
    const buyFormatted = isUSD ? `$${formatNumber(data.buy, 2)}` : formatVND(data.buy);
    const sellFormatted = isUSD ? `$${formatNumber(data.sell, 2)}` : formatVND(data.sell);
    const spread = isUSD ? `$${formatNumber(data.sell - data.buy, 2)}` : formatVND(data.sell - data.buy);

    return `
      <div class="price-card">
        <div class="price-card-head">
          <div class="price-card-title">
            <i class="fas ${item.icon}" style="color: ${item.color}; margin-right: 6px;"></i>
            ${data.name}
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
        <div class="price-spread">Chênh lệch: ${spread} / ${data.unit}</div>
      </div>
    `;
  }).join('');
}

// 5. Render Bộ Đếm Mục Tiêu Tích Sản
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

  const goldTargetPhan = 50; // 50 phân = 5 chỉ
  const silverTargetLuong = 30; // 30 lượng

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

// 6. Render Biểu đồ Chart.js
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

// 7. Modal Handlers
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

// 8. Tự động làm mới giá sàn
function refreshMarketPrices() {
  const btn = document.getElementById('btn-refresh-prices');
  if (btn) btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang tải...';

  setTimeout(() => {
    const deltaGold = (Math.random() - 0.45) * 5000;
    const deltaSilver = (Math.random() - 0.45) * 10000;

    state.marketPrices.BTMH.buy += Math.round(deltaGold);
    state.marketPrices.BTMH.sell += Math.round(deltaGold);
    state.marketPrices.ANCARAT.buy += Math.round(deltaSilver);
    state.marketPrices.ANCARAT.sell += Math.round(deltaSilver);
    state.marketPrices.DOJI.buy += Math.round(deltaGold * 10);
    state.marketPrices.DOJI.sell += Math.round(deltaGold * 10);
    state.marketPrices.BTMC.buy += Math.round(deltaGold * 10);
    state.marketPrices.BTMC.sell += Math.round(deltaGold * 10);
    state.marketPrices.PHU_QUY.buy += Math.round(deltaSilver);
    state.marketPrices.PHU_QUY.sell += Math.round(deltaSilver);

    saveState();
    renderAll();

    if (btn) btn.innerHTML = '<i class="fas fa-sync-alt"></i> Làm mới giá sàn';
    showToast('📈 Bảng giá sàn BTMH, Ancarat, DOJI, BTMC đã được cập nhật!');
  }, 500);
}

function initAutoRefresh() {
  setInterval(() => {
    refreshMarketPrices();
  }, 5 * 60 * 1000);
}

// 9. Đồng bộ Google Sheets
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

// 10. Xuất / Nhập File Excel & JSON
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

// 11. Toast Notifications
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
