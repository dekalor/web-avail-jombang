module.exports = {
  PORT:              process.env.PORT              || 3000,
  FREE_SHIPPING_MIN: parseInt(process.env.FREE_SHIPPING_MIN) || 100000,
  SHIPPING_FEE:      parseInt(process.env.SHIPPING_FEE)      || 15000,

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
};
