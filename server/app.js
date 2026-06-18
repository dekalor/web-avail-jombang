// server/app.js
const express = require('express');
const path    = require('path');
const session = require('express-session');

const productRoutes = require('./routes/productRoutes');
const orderRoutes   = require('./routes/orderRoutes');
const adminRoutes   = require('./routes/adminRoutes');
const shippingRoutes   = require('./routes/shippingRoutes');

const SequelizeSessionStore = require('./middleware/sequelizeSessionStore');
const { notFound, errorHandler } = require('./middleware/errorHandler');
const security = require('./middleware/security');
const { SESSION } = require('./config/config');

const isProd = process.env.NODE_ENV === 'production';

async function createApp() {
  const app = express();
  const bodyLimit = process.env.BODY_LIMIT || '20mb';

  if (isProd) {
    // Trust first proxy so secure cookies work behind TLS terminators
    app.set('trust proxy', 1);
  }
  
  app.use(express.json({ limit: bodyLimit }));
  app.use(express.urlencoded({ extended: true, limit: bodyLimit }));
  app.use(express.text({ limit: bodyLimit }));
  app.use(express.raw({ type: 'application/octet-stream', limit: bodyLimit }));
  app.use(session({
    store: new SequelizeSessionStore(),
    secret: SESSION.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: SESSION.MAX_AGE_MS,
      httpOnly: true,
      sameSite: isProd ? 'none' : 'lax',
      secure: isProd,
    },
  }));
  app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

  app.use('/api/health-check', (req, res) => {
    res.json({ status: 'ok' });
  });

  // ─── Base Route ──────────────────────────────────────────────────────────
  app.use('/api', security);
  app.use('/api/products', productRoutes);
  app.use('/api/orders',   orderRoutes);
  app.use('/api/admin',    adminRoutes);
  app.use('/api/shipping',    shippingRoutes);

  if (!isProd) {
    // ── Development: Vite dev servers as Express middleware ─────────────────
    // Both get full HMR, no separate ports needed.
    const { createServer: createViteServer } = await import('vite');
    const adminHmrPort = Number(process.env.ADMIN_HMR_PORT || 24678);
    const clientHmrPort = Number(process.env.CLIENT_HMR_PORT || 24679);

    // Admin Vite instance — handles requests under /admin
    const adminVite = await createViteServer({
      root: path.join(__dirname, '../admin'),
      configFile: path.join(__dirname, '../admin/vite.config.mjs'),
      server: {
        middlewareMode: true,
        hmr: { port: adminHmrPort },
      },
      appType: 'spa',
      base: '/admin/',
    });

    // Client Vite instance — handles everything else
    const clientVite = await createViteServer({
      root: path.join(__dirname, '../client'),
      configFile: path.join(__dirname, '../client/vite.config.mjs'),
      server: {
        middlewareMode: true,
        hmr: { port: clientHmrPort },
      },
      appType: 'spa',
      base: '/',
    });

    app.use('/admin', adminVite.middlewares);
    app.use(clientVite.middlewares);
  }

  app.use(notFound);
  app.use(errorHandler);

  return app;
}

module.exports = createApp;
