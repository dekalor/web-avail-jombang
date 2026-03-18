# AVAIL Jombang Store

Monorepo e-commerce app:
- `client` (Vue 3 + Vite) storefront
- `admin` (Vue 3 + Vite) admin panel
- `server` (Express + Sequelize + MySQL) API

## Overview

- Single-port runtime via Express (`:3000`)
- Development: Express mounts Vite middleware for store (`/`) and admin (`/admin`)
- Production: Express serves `client/dist` and `admin/dist`
- Admin authentication uses session (`connect.sid`)
- Checkout protection for guest order create:
  - guest token
  - anti-bot challenge
  - rate limiting on `/api/orders/create`

## Core Features

### Storefront
- Product listing + category filter + price sort
- Product detail with unit selection (`qty_per_unit`)
- Cart + checkout state persistence (Pinia persisted state)
- Checkout modular sections:
  - personal info
  - shipping address
  - payment and proof upload
  - order summary
- Shipping fee integration via RajaOngkir (cached master data)
- Free shipping threshold (`FREE_SHIPPING_MIN`)
- Order creation with stock decrement
- Product cards/detail display unit label formatting (example: `BOX (20 pcs)`)
- Home featured products sourced from DB (`/api/products/featured`)

### Admin
- Session-based login/logout
- Dashboard metrics (orders, customers, revenue, top products, status counts)
- Orders with pagination and sorting
- Order status update with stock return when changed to `cancelled`
- Product CRUD + category CRUD
- Product unit management (`product_units`) and stock conversion support

### Media, Email, SEO
- Cloudinary upload for product images, detail media, payment proof
- Email notification on new order (async fire-and-forget)
- Dynamic SEO file generation from `SITE_URL`:
  - `client/public/sitemap.xml`
  - `client/public/robots.txt`
- Route-level SEO meta handling in client router (`title`, `description`, `robots`, canonical)

## Setup

### 1. Environment

```bash
cp .env.example .env
```

Main env keys:

- Runtime:
  - `NODE_ENV`
  - `PORT`
  - `SITE_URL`
  - `ADMIN_HMR_PORT`
  - `CLIENT_HMR_PORT`
  - `BODY_LIMIT`
- Security:
  - `SESSION_SECRET`
  - `SESSION_MAX_AGE_MS`
  - `CORS_ORIGINS`
  - `ORDER_CREATE_RATE_LIMIT_WINDOW_MS`
  - `ORDER_CREATE_RATE_LIMIT_MAX`
  - `CHECKOUT_CHALLENGE_MIN_SUBMIT_MS`
  - `CHECKOUT_CHALLENGE_TTL_MS`
- Database:
  - `DB_HOST`
  - `DB_PORT`
  - `DB_USER`
  - `DB_PASSWORD`
  - `DB_NAME`
  - `DB_DIALECT`
- Shipping:
  - `FREE_SHIPPING_MIN`
  - `RAJAONGKIR_BASE_URL`
  - `RAJAONGKIR_API_KEY`
  - `RAJAONGKIR_CACHE_DAYS`
  - `ORIGIN_DISTRICT_ID`
  - `DEFAULT_WEIGHT`
- Cloudinary:
  - `CLOUDINARY_CLOUD_NAME`
  - `CLOUDINARY_API_KEY`
  - `CLOUDINARY_API_SECRET`
  - `CLOUDINARY_PRODUCTS_FOLDER`
  - `CLOUDINARY_PRODUCT_DETAILS_FOLDER`
  - `CLOUDINARY_ORDERS_FOLDER`
- Email SMTP:
  - `SMTP_HOST`
  - `SMTP_PORT`
  - `SMTP_SECURE`
  - `SMTP_USER`
  - `SMTP_PASS`
  - `SMTP_FROM`
  - `ORDER_NOTIFICATION_EMAIL`

### 2. Install dependencies

```bash
npm install
```

### 3. Run migration + seed

```bash
npm run migrateup
npm run seed
```

## Run

### Development

```bash
npm run dev
```

URLs:
- Store: `http://localhost:3000/`
- Admin: `http://localhost:3000/admin/`
- API: `http://localhost:3000/api/`

### Production

```bash
npm run build
npm start
```

`npm run build` will:
1. Generate `sitemap.xml` + `robots.txt` from `SITE_URL`
2. Build `client`
3. Build `admin`

## Root Scripts

- `npm run dev` → start Express in dev mode
- `npm run build` → generate SEO files + build `client` and `admin`
- `npm start` → start Express
- `npm run migrateup` → run migrations
- `npm run migratedownto` → rollback all migrations
- `npm run migratedownname` → rollback one migration
- `npm run seed` → run seeders

## API Summary

### Public
- `GET /api/products`
- `GET /api/products/featured`
- `GET /api/products/categories`
- `GET /api/products/:id`
- `GET /api/orders/get-payment-method`
- `GET /api/orders/checkout-config`
- `GET /api/orders/checkout-protection`
- `POST /api/orders/create`
- `GET /api/shipping/*`

### Admin
- `POST /api/admin/login`
- `POST /api/admin/logout`
- `GET /api/admin/session`
- `GET /api/admin/dashboard`
- `GET /api/admin/orders`
- `GET /api/admin/orders/:id`
- `PATCH /api/admin/orders/:id`
- `GET/POST/PUT/DELETE /api/admin/products*`
- `GET/POST/PUT/DELETE /api/admin/product-categories*`

## Notes

- Product and proof images are hosted on Cloudinary
- Order email notification is async and does not block checkout response
- Security middleware applies to non-admin `/api/*`
- Cancelled orders return stock automatically based on ordered unit conversion
