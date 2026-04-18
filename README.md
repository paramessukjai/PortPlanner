# 📈 PortPlanner — พอร์ตการลงทุน

แอปพลิเคชันติดตามพอร์ตหุ้นส่วนตัว พร้อมซิงก์ข้อมูลแบบเรียลไทม์ผ่าน Firebase Realtime Database

## ✨ ฟีเจอร์

- **ตั้งค่าพอร์ต** — กำหนดงบรายเดือนและสัดส่วนหุ้นแต่ละตัว
- **รายเดือน** — ยืนยันการฝากเงินแต่ละเดือน สะสมอัตโนมัติ
- **กำไร / ขาดทุน** — คำนวณ P&L รายหุ้นและรวมพอร์ต
- **Rebalance** — แนะนำงบเดือนถัดไปให้พอร์ตสมดุล
- **สรุปพอร์ต** — ภาพรวมพร้อมกราฟ Donut chart
- **🔥 Firebase Realtime Sync** — ข้อมูลบันทึกและอัพเดทแบบเรียลไทม์

## 🚀 วิธีใช้งาน

### เปิดตรงๆ (ไม่ต้อง build)
เปิดไฟล์ `index.html` ผ่าน browser ได้เลย หรือ deploy ผ่าน GitHub Pages / Firebase Hosting

### Deploy บน GitHub Pages
1. Push โค้ดขึ้น GitHub repository
2. ไปที่ Settings → Pages
3. เลือก Source: `main` branch, folder `/` (root)
4. บันทึก → รอสักครู่ แล้วเปิด URL ที่ได้

### Deploy บน Firebase Hosting (แนะนำ)
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

## 🔥 Firebase Setup

โปรเจกต์นี้ใช้ Firebase Realtime Database เพื่อบันทึกข้อมูลแบบ persistent

### Database Rules (ตั้งใน Firebase Console)
ไปที่ **Realtime Database → Rules** แล้วใส่:

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

> ⚠️ Rules ด้านบนเปิดให้ทุกคนอ่าน/เขียนได้ เหมาะสำหรับใช้ส่วนตัว  
> หากต้องการความปลอดภัยมากขึ้น ให้เพิ่ม Firebase Authentication

### databaseURL
ตรวจสอบให้แน่ใจว่า `databaseURL` ใน config ถูกต้อง ดูได้จาก  
Firebase Console → Realtime Database → Copy URL (ปกติจะเป็น `.asia-southeast1.firebasedatabase.app`)

## 📁 โครงสร้างไฟล์

```
port-planner/
├── index.html      ← ไฟล์หลัก (single-file app)
├── .gitignore
└── README.md
```

## 🛠 Tech Stack

- Vanilla HTML / CSS / JavaScript (ไม่มี framework)
- [Chart.js 4.4](https://www.chartjs.org/) — กราฟ Donut
- [Firebase 10](https://firebase.google.com/) — Realtime Database + Analytics
- Google Fonts: DM Serif Display, DM Sans
