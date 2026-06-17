require('dotenv').config()

module.exports = {
  local: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT || 'postgres',
    timezone: '+07:00',
    logging: console.log,
    define: {
      underscored:   true,
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
    dialect: process.env.DB_DIALECT || 'postgres',
    timezone: '+07:00',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    define: {
      underscored:   true,
      timestamps:    true,
      createdAt:     'created_at',
      updatedAt:     'updated_at',
    },
    pool: {
      max:     2,
      min:     0,
      acquire: 30000,
      idle:    10000,
    },
  }
}