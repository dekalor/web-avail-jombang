const { Sequelize } = require('sequelize');
const { DB } = require('../config/env');

const sequelize = new Sequelize(DB.NAME, DB.USER, DB.PASSWORD, {
  host:    DB.HOST,
  port:    DB.PORT,
  dialect: DB.DIALECT,
  logging: process.env.NODE_ENV !== 'production' ? console.log : false,
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
});

// Test connection on startup
sequelize.authenticate()
  .then(() => console.log('✅ MySQL (Sequelize) connected'))
  .catch(err => {
    console.error('❌ MySQL connection failed:', err.message);
    process.exit(1);
  });

module.exports = sequelize;
