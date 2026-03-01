module.exports = {
  PORT:              process.env.PORT              || 3000,
  FREE_SHIPPING_MIN: parseInt(process.env.FREE_SHIPPING_MIN) || 100000,

  DB: {
    HOST:     process.env.DB_HOST     || 'localhost',
    PORT:     parseInt(process.env.DB_PORT) || 3306,
    USER:     process.env.DB_USER     || 'root',
    PASSWORD: process.env.DB_PASSWORD || '',
    NAME:     process.env.DB_NAME     || 'avail_db',
    DIALECT:  'mysql',
  },

  ADMIN: {
    USERNAME: process.env.ADMIN_USERNAME || 'admin',
    PASSWORD: process.env.ADMIN_PASSWORD || 'bloom2025',
  },

  SESSION: {
    SECRET: process.env.SESSION_SECRET || 'change-this-session-secret',
    MAX_AGE_MS: parseInt(process.env.SESSION_MAX_AGE_MS || '86400000', 10),
  },

  RAJAONGKIR: {
    BASE_URL: process.env.RAJAONGKIR_BASE_URL,
    API_KEY: process.env.RAJAONGKIR_API_KEY,
    ORIGIN_DISTRICT_ID: process.env.ORIGIN_DISTRICT_ID,
    CACHE_DAYS: process.env.RAJAONGKIR_CACHE_DAYS,
    DEFAULT_WEIGHT: process.env.DEFAULT_WEIGHT
  },

  API_SECURITY: {
    CORS_ORIGINS: (process.env.CORS_ORIGINS || 'http://localhost:3000,http://localhost:5173')
      .split(',')
      .map(origin => origin.trim())
      .filter(Boolean),
    ORDER_CREATE_RATE_LIMIT_WINDOW_MS: parseInt(process.env.ORDER_CREATE_RATE_LIMIT_WINDOW_MS || '600000', 10),
    ORDER_CREATE_RATE_LIMIT_MAX: parseInt(process.env.ORDER_CREATE_RATE_LIMIT_MAX || '10', 10),
    CHECKOUT_CHALLENGE_MIN_SUBMIT_MS: parseInt(process.env.CHECKOUT_CHALLENGE_MIN_SUBMIT_MS || '3000', 10),
    CHECKOUT_CHALLENGE_TTL_MS: parseInt(process.env.CHECKOUT_CHALLENGE_TTL_MS || '600000', 10),
  },
};
