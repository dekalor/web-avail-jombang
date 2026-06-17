require('dotenv').config()

module.exports = {
  local: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT || 'mysql',
    timezone: '+07:00',
    logging: console.log,
    define: {
      underscored:   true,   // JS camelCase → DB snake_case automatically
      timestamps:    true,
      createdAt:     'created_at',
      updatedAt:     'updated_at',
    },
    pool: {
      max:     10,
      min:     0,
      acquire: 30000,
      idle:    10000,
    },
  },

  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT,
    timezone: '+07:00',
    logging: false,
    define: {
      underscored:   true,   // JS camelCase → DB snake_case automatically
      timestamps:    true,
      createdAt:     'created_at',
      updatedAt:     'updated_at',
    },
    pool: {
      max:     10,
      min:     0,
      acquire: 30000,
      idle:    10000,
    },
  }
}