# NAAVI — Women's Fashion E-Commerce Website

## 🗂️ Project Structure
```
naavi/
├── backend/          ← Node.js + Express + MongoDB API
└── frontend/         ← React + Tailwind + MUI
```

---

## 🛠️ STEP-BY-STEP SETUP (For Beginners)

### Prerequisites — Install these first:
1. **Node.js** → https://nodejs.org (download LTS version, install it)
2. **MongoDB Community** → https://www.mongodb.com/try/download/community (install & run)
3. **VS Code** → https://code.visualstudio.com

### Step 1 — Open Terminal in VS Code
- Open VS Code
- Press `Ctrl + `` ` (backtick) to open terminal

### Step 2 — Setup Backend
```bash
cd naavi/backend
npm install
cp .env.example .env
# Edit .env: set MONGO_URI=mongodb://localhost:27017/naavi and JWT_SECRET=naavi_secret_2025
node seed.js        # populates the database with products
npm run dev         # starts backend on http://localhost:5000
```

### Step 3 — Setup Frontend (open a NEW terminal tab)
```bash
cd naavi/frontend
npm install
npm run dev         # starts frontend on http://localhost:5173
```

### Step 4 — Open browser
Go to: http://localhost:5173

### Admin Login (after seeding):
- Email: admin@naavi.com
- Password: admin123

---

## Features
- Dark luxury theme with gold accents
- All clothing categories: Kurtas, Suits, Tops, Sarees, Jackets, Scarves, Dresses, T-shirts, Jeans
- User auth (register/login with JWT)
- Product listing with filters & search
- Product detail page with size/color selection
- Shopping cart (add/remove/update)
- Wishlist
- Checkout & Orders
- User profile
- Admin panel (manage products & orders)
- Fully responsive (mobile + desktop)
