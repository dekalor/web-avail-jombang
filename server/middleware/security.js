const { API_SECURITY } = require('../config/config');
const cors = require('cors');

function isAllowedOrigin(origin) {
  const allowedOrigins = API_SECURITY.CORS_ORIGINS;
  if (!origin) return true;
  if (allowedOrigins.includes('*')) return true;
  return allowedOrigins.includes(origin);
}

const corsMiddleware = cors({
  origin: (origin, callback) => {
    callback(null, isAllowedOrigin(origin));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
});

module.exports = function security(req, res, next) {
  // Explicitly skip admin APIs
  if (req.path.startsWith('/admin')) return next();

  if (!isAllowedOrigin(req.headers.origin)) {
    return res.status(403).json({
      success: false,
      message: 'Origin not allowed',
    });
  }

  return corsMiddleware(req, res, () => {
    if (req.method === 'OPTIONS') {
      return res.sendStatus(204);
    }

    return next();
  });
};
