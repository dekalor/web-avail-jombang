# AVAIL Jombang Store

Monorepo e-commerce application with:
- `client` (Vue 3 + Vite) for storefront
- `admin` (Vue 3 + Vite) for admin panel
- `server` (Express + Sequelize + MySQL) for API

## Overview

- Single-port runtime via Express (`:3000`)
- Development mode: Express mounts two Vite middleware apps (`/` for client, `/admin` for admin)
- Production mode: Express serves `client/dist` and `admin/dist`
- Session-based admin authentication (`connect.sid` cookie)
- Guest checkout protection for order creation:
  - guest checkout token
  - anti-bot challenge
  - strict rate limit on `/api/orders/create`

## Project Structure

```txt
web-avail-jombang/
├── .sequelizerc
├── .env.example
├── package.json
├── client/
│   └── src/
│       ├── pages/ (Home, Products, ProductDetail, Cart, Checkout, OrderSuccess, Testimonial)
│       ├── components/ (Layout, ProductCard, CourierSelect, etc.)
│       ├── stores/ (cartStore, checkoutStore, shippingStore)
│       └── composables/ (useProducts, useApi, etc.)
├── admin/
│   └── src/
│       ├── pages/ (Dashboard, Orders, Products, ProductCategories)
│       ├── components/
│       │   ├── charts/BarChartOne.vue
│       │   └── ui/Badge.vue
│       └── assets/main.css
└── server/
    ├── app.js / index.js
    ├── config/
    ├── routes/ (productRoutes, orderRoutes, adminRoutes, shippingRoutes)
    ├── controllers/
    ├── services/
    ├── repositories/
    ├── models/
    ├── middleware/
    ├── migrations/
    ├── seeders/
    └── db/
```

## Implemented Features

### Storefront
- Product listing + category filter
- Product detail page
- Cart with product unit selection (`product_units`)
- Cart and checkout state persistence via Pinia persisted state
- Checkout + shipping fee flow
- Shipping fee calculation via RajaOngkir API with shipping master caching
- Free shipping threshold (`FREE_SHIPPING_MIN`)
- Payment proof upload to Cloudinary (`CLOUDINARY_ORDERS_FOLDER`)
- Order success page

### Admin Panel
- Session-based login/logout
- Dashboard:
  - Daily sales chart (dynamic from `revenue7d`)
  - Today order status distribution
  - Top products
  - Recent orders
  - Unique customers (`COUNT DISTINCT customer_phone`)
- Orders:
  - pagination + server-side sorting (`page`, `page_size`, `sort_by`, `sort_dir`)
  - status transition guard
  - quick status actions
  - payment proof preview/open/download
  - line-item CSV export
- Products:
  - CRUD product management
  - multi-unit product pricing (`product_units`)
  - stock conversion with `qty_per_unit`
- Media handling:
  - Product image upload to Cloudinary (`CLOUDINARY_PRODUCTS_FOLDER`)
  - Payment proof image hosting on Cloudinary
- Product Categories:
  - CRUD + active/inactive states

## Setup

### 1. Environment

```bash
cp .env.example .env
```

Use values from `.env.example`. Current environment keys:

- App runtime:
  - `NODE_ENV`
  - `PORT`
  - `ADMIN_HMR_PORT`
  - `CLIENT_HMR_PORT`
- Security:
  - `SESSION_SECRET`
  - `SESSION_MAX_AGE_MS`
  - `CORS_ORIGINS` (comma-separated)
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

Important:
- Replace all placeholder/example values before deployment (especially secrets and API keys).

### 2. Install dependencies

```bash
npm install
```

### 3. Run database migration + seed

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

## Root Scripts

- `npm run dev` → start Express (dev mode + Vite middleware)
- `npm run build` → build `client` + `admin`
- `npm start` → start Express in production mode
- `npm run migrateup` → run all migrations
- `npm run migratedownto` → rollback to specific migration
- `npm run migratedownname` → rollback one migration
- `npm run seed` → run seeders

## API Summary

### Public
- `GET /api/products`
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
- `PATCH /api/admin/orders/:id`
- `GET/POST/PUT/DELETE /api/admin/products*`
- `GET/POST/PUT/DELETE /api/admin/product-categories*`

## Notes

- Product images and payment proof images are uploaded to Cloudinary
- Admin auth is session-based (not localStorage token-based)
- Security middleware is applied to non-admin `/api/*` routes
- Shipping integration uses cached RajaOngkir master data to reduce API calls and improve response time
