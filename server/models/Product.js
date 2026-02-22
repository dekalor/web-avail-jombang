// server/models/Product.js
// Defines the DB schema for products. No business logic here.

const { DataTypes } = require('sequelize');
const sequelize     = require('../db/sequelize');

const Product = sequelize.define('Product', {
  id: {
    type:          DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey:    true,
  },
  name: {
    type:      DataTypes.STRING(100),
    allowNull: false,
  },
  description: {
    type:      DataTypes.TEXT,
    allowNull: true,
  },
  categoryId: {
    type:      DataTypes.INTEGER,
    allowNull: false,
    field:     'category_id',
  },
  price: {
    type:      DataTypes.INTEGER,   // IDR, stored as whole number
    allowNull: false,
  },
  imageUrl: {
    type:      DataTypes.STRING(255),
    allowNull: true,
    field:     'image_url',
  },
  badge: {
    type:      DataTypes.STRING(30),
    allowNull: true,
  },
  stock: {
    type:         DataTypes.INTEGER,
    allowNull:    false,
    defaultValue: 100,
  },
  active: {
    type:         DataTypes.BOOLEAN,
    allowNull:    false,
    defaultValue: true,
  },
}, {
  tableName: 'products',
});

module.exports = Product;
