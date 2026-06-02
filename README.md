# 山木小館 POS 系統 — 重建版 (2026-06-02)

> **重建原因**: 5/22 完成的 HTML 5/22 寫在 `/tmp/showcase-2026/`, 被 macOS 自動清掉
> **設計/know-how**: 完整保留在 `~/.hermes/wiki/restaurant-pos.md` + Qdrant lesson
> **新位置**: `~/neuxa-source/restaurant-pos/` (永久, git 管理)

## 系統架構

```
admin.html (密碼8532) → pos_menu (localStorage)
                              ↓
              ┌───────────────┼───────────────┐
              ↓               ↓               ↓
         pos.html        order.html       index.html
       (店員點餐)       (顧客掃描)         (品牌官網)
              ↓               ↓
         kds.html ←───── localStorage (orders)
       (廚房看板)
              ↑
         qr.html
       (QR 碼生成)
```

## 6 個 HTML

| 頁面 | 用途 | 訪問者 |
|------|------|--------|
| `index.html` | 品牌官網, 菜品展示 | 一般訪客 |
| `order.html` | 顧客自助點餐 (QR 掃碼進入) | 顧客 |
| `pos.html` | 店員點餐 (桌位地圖) | 店員 |
| `kds.html` | 廚房看板 (訂單輪詢) | 廚房 |
| `admin.html` | 菜單管理 (密碼保護) | 店主 |
| `qr.html` | QR 碼生成器 (15 桌) | 店主 |

## 共用 Schema (localStorage)

### pos_menu
```json
[
  {
    "id": "dish_001",
    "category": "招牌菜",
    "name": "翡翠綠炒飯",
    "price": 180,
    "image": "https://files.catbox.moe/xxx.jpg",
    "description": "...",
    "available": true
  }
]
```

### orders
```json
[
  {
    "id": "order_20260602_001",
    "table": 5,
    "items": [{"dish_id": "dish_001", "qty": 2, "name": "翡翠綠炒飯", "price": 180}],
    "total": 360,
    "status": "pending",
    "created_at": "2026-06-02T12:30:00",
    "note": ""
  }
]
```

## 品牌色 (翡翠綠, lesson 教訓)

- Primary: `#10b981` (emerald-500)
- Primary Dark: `#047857` (emerald-700)
- BG: `#f0fdf4` (emerald-50)
- Text: `#1f2937` (gray-800)
- Accent: `#fbbf24` (amber-400, 用於強調)

## 技術決策

| 項目 | 選擇 | 理由 |
|------|------|------|
| Framework | None (vanilla) | 6 個獨立頁面, 不需要 SPA |
| CSS | Tailwind CDN | lesson 提到 build 工具, 但 demo 站 CDN 更簡單 |
| Data | localStorage | 5/22 lesson 關鍵決策, 單一來源 |
| Modal | 自定義 | lesson 教訓: 不要 alert/confirm |
| Audio | Web Audio API | kds.html 提示音 |
| QR 碼 | 純 CSS / 第三方 | qr.html 生成 |
| Test | python -m http.server | lesson 標準做法 |

## 上次踩坑（必避）

1. **alert/confirm 禁用** → 全部用自定義 Toast/Modal
2. **響應式要明確**: 桌面雙欄 / 手機 bottom sheet
3. **品牌色統一**: 翡翠綠, 不要再換
4. **pos_menu 初始化**: 第一次開 admin 自動 seed, 不用手動
5. **訂單狀態**: pending → preparing → ready → served

## 啟動方式

```bash
cd ~/neuxa-source/restaurant-pos
python3 -m http.server 8765
# 訪問:
#   http://localhost:8765/index.html (品牌官網)
#   http://localhost:8765/admin.html (管理後台, 密碼 8532)
#   http://localhost:8765/qr.html (QR 碼生成)
#   http://localhost:8765/pos.html (店員點餐)
#   http://localhost:8765/order.html?table=5 (顧客掃碼, 桌號 5)
#   http://localhost:8765/kds.html (廚房看板)
```
