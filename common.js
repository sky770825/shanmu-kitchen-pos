// 山木小館 POS 系統 - 共用模組
// 用 vanilla JS, 跨頁面共用 pos_menu / orders / utilities

const STORAGE_KEYS = {
  menu: 'pos_menu',
  orders: 'pos_orders',
  init: 'pos_init_v1',
};

// ===== FALLBACK 菜單 (當 localStorage 沒有時用) =====
// 圖片皆為 DALL-E 真實生成，2026-06-02 全菜單升級
const FALLBACK_MENU = [
  { id: 'd001', category: '招牌菜', name: '翡翠綠炒飯', price: 180, image: 'https://files.catbox.moe/lwbz5w.png', description: '招牌必點, 粒粒分明', available: true },
  { id: 'd002', category: '招牌菜', name: '山木小館紅燒肉', price: 280, image: 'https://files.catbox.moe/5uemap.png', description: '肥而不膩, 入味三分', available: true },
  { id: 'd003', category: '招牌菜', name: '客家小炒', price: 220, image: 'https://files.catbox.moe/n8prre.png', description: '傳統客家風味', available: true },
  { id: 'd004', category: '熱炒', name: '宮保雞丁', price: 200, image: 'https://files.catbox.moe/is8qfr.png', description: '微辣開胃', available: true },
  { id: 'd005', category: '熱炒', name: '蝦仁炒蛋', price: 240, image: 'https://files.catbox.moe/xevv8d.png', description: '滑嫩爽口', available: true },
  { id: 'd006', category: '熱炒', name: '回鍋肉', price: 220, image: 'https://files.catbox.moe/bmck78.png', description: '川式經典', available: true },
  { id: 'd007', category: '湯品', name: '酸辣湯', price: 80, image: 'https://files.catbox.moe/74vhb0.png', description: '開胃首選', available: true },
  { id: 'd008', category: '湯品', name: '竹筍雞湯', price: 220, image: 'https://files.catbox.moe/zl2avx.png', description: '溫補養生', available: true },
  { id: 'd009', category: '青菜', name: '清炒高麗菜', price: 100, image: 'https://files.catbox.moe/izdks1.png', description: '清脆爽口', available: true },
  { id: 'd010', category: '青菜', name: '蒜炒空心菜', price: 120, image: 'https://files.catbox.moe/r3l3d0.png', description: '蒜香十足', available: true },
  { id: 'd011', category: '飯麵', name: '白飯', price: 20, image: 'https://files.catbox.moe/uq5e0f.png', description: '蓬鬆香Q', available: true },
  { id: 'd012', category: '飯麵', name: '炒麵', price: 120, image: 'https://files.catbox.moe/9hka3v.png', description: '古早味', available: true },
  { id: 'd013', category: '甜點', name: '紫米紅豆湯', price: 60, image: 'https://files.catbox.moe/7a9lai.png', description: '飯後甜點', available: true },
  { id: 'd014', category: '甜點', name: '芋圓豆花', price: 70, image: 'https://files.catbox.moe/lutdum.png', description: '手工製作', available: true },
  { id: 'd015', category: '飲料', name: '古早味紅茶', price: 40, image: 'https://files.catbox.moe/fdrcp0.png', description: '清涼解渴', available: true },
  { id: 'd016', category: '飲料', name: '冬瓜茶', price: 40, image: 'https://files.catbox.moe/obenat.png', description: '古早甜味', available: true },
  { id: 'd017', category: '飲料', name: '檸檬愛玉', price: 60, image: 'https://files.catbox.moe/sfr6b0.png', description: '消暑聖品', available: true },
];

// ===== 品牌資源 (Logo / Hero / 環境) =====
const BRAND_ASSETS = {
  logo: 'https://files.catbox.moe/so3th5.png',          // 山木小館_Logo
  logoMark: 'https://files.catbox.moe/dm5547.png',      // 山木小館_標誌圖
  hero: 'https://files.catbox.moe/mapqkc.png',          // 餐廳封面_招牌炒飯
  env: 'https://files.catbox.moe/kl714n.png',           // 餐廳環境內景
};

// ===== 初始化 =====
function initStorage() {
  if (!localStorage.getItem(STORAGE_KEYS.init)) {
    if (!localStorage.getItem(STORAGE_KEYS.menu)) {
      localStorage.setItem(STORAGE_KEYS.menu, JSON.stringify(FALLBACK_MENU));
    }
    if (!localStorage.getItem(STORAGE_KEYS.orders)) {
      localStorage.setItem(STORAGE_KEYS.orders, JSON.stringify([]));
    }
    localStorage.setItem(STORAGE_KEYS.init, '1');
  }
}

function getMenu() {
  initStorage();
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.menu)) || FALLBACK_MENU;
  } catch {
    return FALLBACK_MENU;
  }
}

function getOrders() {
  initStorage();
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.orders)) || [];
  } catch {
    return [];
  }
}

function saveOrders(orders) {
  localStorage.setItem(STORAGE_KEYS.orders, JSON.stringify(orders));
}

function saveMenu(menu) {
  localStorage.setItem(STORAGE_KEYS.menu, JSON.stringify(menu));
}

function resetAll() {
  localStorage.removeItem(STORAGE_KEYS.menu);
  localStorage.removeItem(STORAGE_KEYS.orders);
  localStorage.removeItem(STORAGE_KEYS.init);
  initStorage();
}

// ===== 訂單工具 =====
function createOrder(table, items, note = '') {
  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const order = {
    id: 'order_' + Date.now(),
    table,
    items,
    total,
    status: 'pending',
    created_at: new Date().toISOString(),
    note,
  };
  const orders = getOrders();
  orders.push(order);
  saveOrders(orders);
  return order;
}

function updateOrderStatus(orderId, newStatus) {
  const orders = getOrders();
  const idx = orders.findIndex(o => o.id === orderId);
  if (idx >= 0) {
    orders[idx].status = newStatus;
    orders[idx].updated_at = new Date().toISOString();
    saveOrders(orders);
    return true;
  }
  return false;
}

function deleteOrder(orderId) {
  const orders = getOrders().filter(o => o.id !== orderId);
  saveOrders(orders);
}

// ===== 自定義 Toast (取代 alert) =====
function showToast(msg, type = 'info', duration = 2500) {
  const colors = {
    success: 'bg-emerald-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
    warning: 'bg-amber-500',
  };
  const toast = document.createElement('div');
  toast.className = `fixed top-4 right-4 ${colors[type] || colors.info} text-white px-6 py-3 rounded-lg shadow-2xl z-[9999] font-medium animate-pulse`;
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), duration);
}

// ===== 自定義 Confirm Modal (取代 confirm) =====
function showConfirm(title, message, onConfirm, onCancel) {
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-black/60 z-[9998] flex items-center justify-center p-4';
  modal.innerHTML = `
    <div class="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
      <h3 class="text-xl font-bold text-gray-800 mb-2">${title}</h3>
      <p class="text-gray-600 mb-6">${message}</p>
      <div class="flex gap-3 justify-end">
        <button id="__cancel_btn" class="px-5 py-2.5 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition">取消</button>
        <button id="__ok_btn" class="px-5 py-2.5 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition">確定</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  modal.querySelector('#__ok_btn').onclick = () => {
    modal.remove();
    if (onConfirm) onConfirm();
  };
  modal.querySelector('#__cancel_btn').onclick = () => {
    modal.remove();
    if (onCancel) onCancel();
  };
}

// ===== 格式化 =====
function formatPrice(n) {
  return '$' + n.toLocaleString('zh-TW');
}

function formatTime(iso) {
  const d = new Date(iso);
  return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`;
}

function getTableFromURL() {
  const params = new URLSearchParams(window.location.search);
  return parseInt(params.get('table') || '0', 10);
}

// ===== Dish Detail Modal (縮圖點擊放大) =====
function showDishDetail(dishId, sourcePage = 'order') {
  const menu = getMenu();
  const dish = menu.find(d => d.id === dishId);
  if (!dish) {
    showToast('找不到此菜品', 'error');
    return;
  }

  // 移除舊 modal
  const existing = document.getElementById('__dish_modal');
  if (existing) existing.remove();

  const imageHTML = dish.image && dish.image.startsWith('http')
    ? `<img src="${dish.image}" alt="${dish.name}" class="w-full h-64 object-cover rounded-xl">`
    : `<div class="w-full h-64 bg-emerald-50 rounded-xl flex items-center justify-center text-8xl">${dish.image || '🍽️'}</div>`;

  const modal = document.createElement('div');
  modal.id = '__dish_modal';
  modal.className = 'fixed inset-0 bg-black/70 z-[9997] flex items-center justify-center p-4';
  modal.innerHTML = `
    <div class="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden animate-[fadeIn_0.2s]">
      <div class="relative">
        ${imageHTML}
        <button onclick="document.getElementById('__dish_modal').remove()"
                class="absolute top-3 right-3 w-9 h-9 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center text-lg font-bold">✕</button>
      </div>
      <div class="p-5">
        <p class="text-xs text-emerald-600 font-bold mb-1">${dish.category}</p>
        <h2 class="text-2xl font-black text-gray-800 mb-2">${dish.name}</h2>
        ${dish.description ? `<p class="text-gray-600 mb-3">${dish.description}</p>` : ''}
        <div class="flex items-center justify-between mb-4">
          <span class="text-3xl font-black text-emerald-700">${formatPrice(dish.price)}</span>
          <span class="text-sm text-gray-500">${dish.available === false ? '已售完' : '供應中'}</span>
        </div>
        <button onclick="addToCartFromDetail('${dish.id}', '${sourcePage}')"
                class="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold text-lg transition shadow-md">
          + 加入購物車
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  // 點背景關閉
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.remove();
  });
}

// 從 detail modal 加入購物車
function addToCartFromDetail(dishId, sourcePage) {
  if (sourcePage === 'order' && typeof updateCart === 'function') {
    updateCart(dishId, 1);
    showToast('已加入購物車 ✅', 'success', 1500);
  } else if (sourcePage === 'pos' && typeof posAddToOrder === 'function') {
    posAddToOrder(dishId);
    showToast('已加入點餐單 ✅', 'success', 1500);
  } else {
    // 首頁沒有購物車, 跳轉到 order.html
    showToast('前往點餐頁...', 'info', 1000);
    setTimeout(() => location.href = `order.html?focus=${dishId}`, 800);
  }
  const modal = document.getElementById('__dish_modal');
  if (modal) modal.remove();
}

// ===== 結帳後跳 KDS 詢問 =====
function showCheckoutRedirect(onContinue) {
  const existing = document.getElementById('__redirect_modal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = '__redirect_modal';
  modal.className = 'fixed inset-0 bg-black/60 z-[9998] flex items-center justify-center p-4';
  modal.innerHTML = `
    <div class="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl text-center">
      <div class="text-5xl mb-3">🎉</div>
      <h3 class="text-xl font-black text-emerald-800 mb-2">訂單已送出！</h3>
      <p class="text-gray-600 mb-6 text-sm">廚房已收到訂單<br>要看廚房製作狀態嗎？</p>
      <div class="flex flex-col gap-2">
        <button id="__go_kds" class="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition">
          🍳 跳到 KDS 廚房看板
        </button>
        <button id="__stay" class="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200 transition">
          繼續點餐
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  modal.querySelector('#__go_kds').onclick = () => {
    modal.remove();
    location.href = 'kds.html';
  };
  modal.querySelector('#__stay').onclick = () => {
    modal.remove();
    if (onContinue) onContinue();
  };
}

// ===== 初始化 =====
initStorage();
