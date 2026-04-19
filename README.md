# 📈 PortPlanner PWA

แอปติดตามพอร์ตหุ้นส่วนตัว — ลง "หน้าจอหลัก" ได้เหมือนแอปจริง พร้อม Firebase Realtime Sync

## ไฟล์ในโปรเจกต์

```
port-planner/
├── index.html               ← แอปหลัก
├── manifest.json            ← PWA manifest (ชื่อ, ไอคอน, สี)
├── sw.js                    ← Service Worker (offline cache)
├── icons/
│   ├── icon-192.png         ← ไอคอน Android
│   ├── icon-512.png         ← ไอคอน Android (ใหญ่)
│   └── apple-touch-icon.png ← ไอคอน iOS
└── README.md
```

## วิธี Deploy บน GitHub Pages

1. Push ทุกไฟล์ขึ้น GitHub (รวมโฟลเดอร์ `icons/`)
2. Settings → Pages → Source: `main` / root
3. เปิด URL ที่ได้ → กด **"Add to Home Screen"** ในมือถือ

> ⚠️ Service Worker ต้องการ HTTPS — GitHub Pages รองรับอยู่แล้ว  
> ถ้าเปิดจาก `file://` จะไม่ register SW (ปกติ)

## วิธีติดตั้งบนมือถือ

**Android (Chrome):**  
เปิดเว็บ → แตะเมนู ⋮ → "Add to Home screen" → Install

**iPhone (Safari):**  
เปิดเว็บ → แตะปุ่ม Share □↑ → "Add to Home Screen" → Add

## Firebase Rules

Realtime Database → Rules:
```json
{
  "rules": {
    "portfolio": {
      ".read": true,
      ".write": true
    }
  }
}
```

## อัพเดทโค้ด

เมื่อแก้ไข `index.html` ให้เพิ่ม CACHE_VERSION ใน `sw.js` ด้วย:
```js
const CACHE_VERSION = 'v1.0.1'; // เปลี่ยนทุกครั้ง
```
เพื่อให้มือถือดาวน์โหลดโค้ดใหม่แทน cache เก่า
