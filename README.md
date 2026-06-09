# 🌌 Type Game — Asteroid Typing Shooter

> พิมพ์ให้ทัน... หรือโดนอุกกาบาตถล่ม

**[🚀 Play Now](https://type-game-chi.vercel.app/)**

---

## 🎮 About

Typing game แนว Space Shooter ที่ผสานทักษะการพิมพ์เข้ากับความเร้าใจของเกมยิงอวกาศ  
อุกกาบาตพุ่งลงมาพร้อมคำศัพท์ — พิมพ์ให้ถูกต้องและรวดเร็วเพื่อทำลายมัน  
รองรับทั้ง **ภาษาไทย** และ **ภาษาอังกฤษ** พร้อมระบบ Wave และ Multiplier

---

## ⚙️ Tech Stack

![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-443E38?style=for-the-badge&logo=react&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Canvas](https://img.shields.io/badge/HTML5_Canvas-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

---

## 🛠 Installation

```bash
# 1. Clone repository
git clone https://github.com/Littihai/type-game-main.git
cd type-game-main

# 2. Install dependencies
npm install

# 3. Start dev server
npm run dev

# 4. Build for production
npm run build
```

> Node.js 18+ required

---

## 📁 Project Structure

```
src/
├── components/       # UI Components (HUD, Menu, GameCanvas, ...)
├── game/             # Core game logic (entities, particles, soundManager)
├── hooks/            # Custom React hooks
├── store/            # Zustand state (gameStore, storageStore)
public/
└── words.json        # Thai / English word lists
```

---

## 🎯 Gameplay

- พิมพ์คำที่แสดงบนอุกกาบาตเพื่อทำลายมัน
- กด **Enter** หรือ **Space** เพื่อเลือก/สลับเป้าหมาย
- ทำลายอุกกาบาตต่อเนื่องเพื่อเพิ่ม **Multiplier**
- ครบ Kill quota → Wave ถัดไป
- พลาดให้อุกกาบาตผ่าน → เสียชีวิต

---

## ⚡ Conditions & Rules

- ชีวิตเริ่มต้น **3 หัวใจ** — หมดแล้วจบเกม
- ความเร็วและจำนวนอุกกาบาตเพิ่มขึ้นทุก Wave
- Multiplier รีเซ็ตเมื่อพิมพ์ผิด
- รองรับ **Easy / Medium / Hard** ตามความยาวคำ
- High Score บันทึกไว้ใน Local Storage

---

## 🌐 Language Support

| ภาษา | Easy | Medium | Hard |
|---|---|---|---|
| 🇬🇧 English | 3–4 chars | 5–7 chars | 8–13 chars |
| 🇹🇭 Thai | 1–2 พยางค์ | 3–5 พยางค์ | 6+ พยางค์ |

---

## 👤 Author

**RITZ-PRIME** (Littihai)  
System & Web Developer  
📫 menmry1436@gmail.com

---

*Built with React + Canvas + too much caffeine ☕*
