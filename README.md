# 🌿 AVAIL Jombang Store

Vite + Vue 3 SFC monorepo with Express MVC backend + MySQL.

## Structure

```
web-avail-jombang/
├── package.json          ← root workspace
├── .env.example
│
├── server/               ← Express API (Node.js MVC + MySQL)
│   ├── index.js          ← entry point
│   ├── app.js            ← Express setup
│   ├── config/env.js
│   ├── db/
│   │   ├── connection.js ← MySQL2 pool
│   │   └── schema.sql    ← schema + seed
│   ├── models/           ← productModel, orderModel
│   ├── controllers/      ← product, order, admin
│   ├── routes/           ← product, order, admin
│   └── middleware/       ← errorHandler, adminAuth
│
├── client/               ← Store frontend (Vite + Vue SFC)
│   ├── vite.config.js    ← proxies /api → :3000
│   ├── index.html
│   └── src/
│       ├── main.js
│       ├── App.vue
│       ├── assets/main.css
│       ├── composables/
│       │   └── useCart.js
│       └── components/store/
│           ├── TheNavbar.vue
│           ├── TheFooter.vue
│           ├── HomePage.vue
│           ├── ProductsPage.vue
│           ├── ProductCard.vue
│           ├── CartDrawer.vue
│           └── CheckoutModal.vue
│
└── admin/                ← Admin frontend (Vite + Vue SFC)
    ├── vite.config.js    ← port 5174, proxies /api → :3000
    ├── index.html
    └── src/
        ├── main.js
        ├── App.vue
        ├── assets/admin.css
        ├── composables/
        │   └── useApi.js ← typed API client
        └── components/
            ├── LoginPage.vue
            ├── TheSidebar.vue
            ├── OrdersPage.vue    ← list, filter, status, detail
            └── ProductsPage.vue  ← CRUD, stock, badge
```

## Setup

```bash
# 1. Database
mysql -u root -p < server/db/schema.sql

# 2. Environment
cp .env.example .env   # fill in DB credentials

# 3. Install all workspaces
npm install

# 4. Dev — everything on one port
npm run dev
```

| App    | URL                           |
|--------|-------------------------------|
| Store  | http://localhost:3000/        |
| Admin  | http://localhost:3000/admin/  |
| API    | http://localhost:3000/api/    |

Admin credentials: `admin` / `bloom2025`

## Production build

```bash
npm run build    # Vite builds client → client/dist, admin → admin/dist
npm start        # Express serves both dist folders statically on port 3000
```

## How single-port works

In **dev**, `server/app.js` spins up two Vite instances in `middlewareMode`
and mounts them directly into Express — no separate ports, full HMR:

```
Express :3000
  /api/*        → Express routes (always)
  /admin/*      → Vite middleware (admin SFC app, base="/admin/")
  /*            → Vite middleware (client SFC app, base="/")
```

In **production**, Express just serves the pre-built `dist/` folders as static files.

## Key decisions

| Topic             | Choice                                                   |
|-------------------|----------------------------------------------------------|
| Build tool        | Vite 5 — instant HMR, fast builds                        |
| Component format  | Vue 3 SFC with `<script setup>` + Composition API        |
| State             | `useCart` composable (module-level singleton ref)        |
| Admin auth        | Header token (`x-admin-token`) stored in localStorage   |
| DB transactions   | mysql2 manual `beginTransaction` on order creation       |
| CSS               | Scoped `<style scoped>` per component + global CSS vars  |
