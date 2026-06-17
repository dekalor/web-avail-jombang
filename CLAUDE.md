# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development (starts Express + Vite middleware, single port)
npm run dev

# Production build (generates sitemap/robots.txt, then builds client + admin)
npm run build

# Start production server
npm start

# Database migrations
npm run migrateup          # run all pending migrations
npm run migratedownname    # rollback one migration
npm run migratedownto      # rollback all migrations
npm run seed               # run seeders

# Generate a secure session secret
node server/scripts/generateKey.js
```

No test runner is configured. There are no lint scripts.

## Architecture

This is a **monorepo with three workspaces**: `client`, `admin`, and `server`. A single Express process on port 3000 serves everything.

- **Dev**: Express mounts two Vite instances as middleware (`/admin` and `/`). HMR runs on separate ports (`ADMIN_HMR_PORT`, `CLIENT_HMR_PORT`).
- **Prod**: Express serves `client/dist` (catch-all `*`) and `admin/dist` (under `/admin`). Admin must be registered first to avoid being swallowed by the client catch-all.

The Express app factory lives in `server/app.js` (exported as `createApp()`). `server/index.js` is the entry point — it authenticates the DB, calls `createApp()`, then calls `app.listen()`.

### Server layer (`server/`)

Follows a strict **routes → controllers → services → repositories** pattern:

- `routes/` — mounts middleware and delegates to controllers
- `controllers/` — thin HTTP adapters (parse req, call service, send res)
- `services/` — all business logic (order placement, stock management, etc.)
- `repositories/` — all Sequelize queries, no logic
- `models/` — Sequelize model definitions; associations declared in each model's `static associate()` method; `models/index.js` auto-loads all models
- `middleware/` — session store, admin auth guard, checkout protection, CORS/security, error handler
- `config/config.js` — single source of truth for all env-derived config values; import from here, not `process.env` directly

### Data model highlights

- `Product` has many `ProductUnit` records. A unit has `unitCode`, `qtyPerUnit`, `price`, and `weight`. **Stock is always tracked in `pcs`** (base unit). When a customer orders N units, `qtyInPcs = N × qtyPerUnit` is decremented from `Product.stock`.
- `Order` → `OrderItem` (many). Each `OrderItem` references a `ProductUnit`, not a `Product` directly.
- `OrderSequence` table generates sequential daily order numbers under a DB row lock to prevent duplicates (format: `ORD-AVLJBG-YYYYMMDD-XXXX`).
- Sessions are stored in MySQL via `connect-session-sequelize` (`AdminSession` model / `admin_sessions` table). There is no in-memory session state.

### Admin authentication

Session-based. `requireAdmin` middleware checks `req.session.isAdmin`. Login regenerates the session (CSRF-safe). The `User` model holds admin credentials (bcrypt-hashed passwords via `server/utils/password.js`).

### Checkout protection (anti-bot)

Three-layer guard on `POST /api/orders/create`:

1. **Guest token** — issued per session at `GET /api/orders/checkout-protection`, stored in `req.session.guestCheckoutToken`
2. **Challenge** — a UUID stored in an in-memory `Map` with IP, guest token, and timestamps; must match on submit
3. **Timing check** — submission must arrive ≥ `CHECKOUT_CHALLENGE_MIN_SUBMIT_MS` after challenge issue
4. **Rate limiter** — IP-based via `express-rate-limit`

Note: the `challengeStore` Map is in-memory, so challenges do not survive server restarts.

### Media uploads

All images/videos go through Cloudinary. Files are received as **base64 data URLs** in the request body (no multipart). `server/utils/cloudinaryStore.js` handles parsing, size validation (5 MB images / 20 MB video), and upload. Three scopes: product images, product detail media (images + video), and payment proof (images only).

### Client (`client/src/`)

Vue 3 + Vite SPA. Key patterns:

- **`useApi.js`** — thin fetch wrapper; always calls `/api<path>` relative to origin; expects `{ success, data, message }` envelope; shows an error modal on failure
- **`cartStore.js`** (Pinia, persisted to `localStorage`) — cart items keyed by `productId:unitCode`. Quantity is capped by available stock in pcs, accounting for all units of the same product already in cart. `refreshCartPrices()` re-fetches products and reconciles prices/stock before checkout.
- **Router** (`router.js`) — sets `document.title`, `meta[description]`, `meta[robots]`, and canonical link on `afterEach`

### Admin (`admin/src/`)

Vue 3 + Vite SPA served under `/admin/`. Session check is done via `GET /api/admin/session` on app mount. The admin router's `login` route renders an empty component — the `App.vue` handles the login modal overlay.

### SEO files

`server/scripts/generateSitemap.js` runs as part of `npm run build` and writes `client/public/sitemap.xml` and `client/public/robots.txt` using `SITE_URL`.

## Environment

Copy `.env.example` to `.env`. All config is centralised in `server/config/config.js`. Required groups:

- **DB**: `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
- **Session**: `SESSION_SECRET`, `SESSION_MAX_AGE_MS`
- **Cloudinary**: `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, plus three folder env vars
- **RajaOngkir**: `RAJAONGKIR_API_KEY`, `RAJAONGKIR_BASE_URL`, `ORIGIN_DISTRICT_ID`
- **SMTP**: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `ORDER_NOTIFICATION_EMAIL`
- **Runtime**: `NODE_ENV`, `PORT`, `SITE_URL`, `CORS_ORIGINS`, `FREE_SHIPPING_MIN`

## Deployment

Production uses **PM2** (`ecosystem.config.js`) on a VPS. The app is self-contained — Express serves both SPAs and the API from port 3000. See README for Vercel caveats (requires DB-backed sessions and serverless adaptation).
