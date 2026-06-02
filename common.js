// 山木小館 POS 系統 - 共用模組
// 用 vanilla JS, 跨頁面共用 pos_menu / orders / utilities

const STORAGE_KEYS = {
  menu: 'pos_menu',
  orders: 'pos_orders',
  init: 'pos_init_v1',
};

// ===== FALLBACK 菜單 (當 localStorage 沒有時用) =====
const FALLBACK_MENU = [
  { id: 'd001', category: '招牌菜', name: '翡翠綠炒飯', price: 180, image: 'https://files.catbox.moe/qhujx7.jpg', description: '招牌必點, 粒粒分明', available: true },
  { id: 'd002', category: '招牌菜', name: '山木小館紅燒肉', price: 280, image: 'https://files.catbox.moe/4nen8u.jpg', description: '肥而不膩, 入味三分', available: true },
  { id: 'd003', category: '招牌菜', name: '客家小炒', price: 220, image: 'https://files.catbox.moe/18ywl6.jpg', description: '傳統客家風味', available: true },
  { id: 'd004', category: '熱炒', name: '宮保雞丁', price: 200, image: 'https://files.catbox.moe/qbez8z.jpg', description: '微辣開胃', available: true },
  { id: 'd005', category: '熱炒', name: '蝦仁炒蛋', price: 240, image: 'https://files.catbox.moe/r6p2aa.jpg', description: '滑嫩爽口', available: true },
  { id: 'd006', category: '熱炒', name: '回鍋肉', price: 220, image: 'https://files.catbox.moe/4nen8u.jpg', description: '川式經典', available: true },
  { id: 'd007', category: '湯品', name: '酸辣湯', price: 80, image: 'https://files.catbox.moe/qckrp8.jpg', description: '開胃首選', available: true },
  { id: 'd008', category: '湯品', name: '竹筍雞湯', price: 220, image: 'https://files.catbox.moe/scw4mh.jpg', description: '溫補養生', available: true },
  { id: 'd009', category: '青菜', name: '清炒高麗菜', price: 100, image: 'https://files.catbox.moe/w4g70i.jpg', description: '清脆爽口', available: true },
  { id: 'd010', category: '青菜', name: '蒜炒空心菜', price: 120, image: 'https://files.catbox.moe/trojpd.jpg', description: '蒜香十足', available: true },
  { id: 'd011', category: '飯麵', name: '白飯', price: 20, image: 'https://files.catbox.moe/nyymq7.jpg', description: '', available: true },
  { id: 'd012', category: '飯麵', name: '炒麵', price: 120, image: 'https://files.catbox.moe/55f5p7.jpg', description: '古早味', available: true },
  { id: 'd013', category: '甜點', name: '紫米紅豆湯', price: 60, image: 'https://files.catbox.moe/x509m8.jpg', description: '飯後甜點', available: true },
  { id: 'd014', category: '甜點', name: '芋圓豆花', price: 70, image: 'https://files.catbox.moe/xlpn23.jpg', description: '手工製作', available: true },
  { id: 'd015', category: '飲料', name: '古早味紅茶', price: 40, image: 'https://files.catbox.moe/4ji8lb.jpg', description: '', available: true },
  { id: 'd016', category: '飲料', name: '冬瓜茶', price: 40, image: 'https://files.catbox.moe/mehrea.jpg', description: '', available: true },
  { id: 'd017', category: '飲料', name: '檸檬愛玉', price: 60, image: 'https://files.catbox.moe/4nlap7.jpg', description: '消暑聖品', available: true },
];

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

// ===== 初始化 =====
initStorage();
