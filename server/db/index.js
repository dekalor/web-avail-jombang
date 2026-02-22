// server/db/index.js
// Central place to import models and define associations.
// Keeps model files clean and association logic in one place.

const sequelize     = require('./sequelize');
const Product       = require('../models/Product');
const ProductCategory = require('../models/ProductCategory');
const Order         = require('../models/Order');
const OrderItem     = require('../models/OrderItem');
const AdminSession  = require('../models/AdminSession');

// ─── Associations ──────────────────────────────────────────────────────────
Order.hasMany(OrderItem, {
  foreignKey: {
    name:      'orderId',
    field:     'order_id',
    allowNull: false,
  },
  as:         'items',
  onDelete:   'CASCADE',
  onUpdate:   'CASCADE',
});

OrderItem.belongsTo(Order, {
  foreignKey: {
    name:      'orderId',
    field:     'order_id',
    allowNull: false,
  },
  as:         'order',
  onDelete:   'CASCADE',
  onUpdate:   'CASCADE',
});

OrderItem.belongsTo(Product, {
  foreignKey: {
    name:      'productId',
    field:     'product_id',
    allowNull: false,
  },
  as:         'product',
  onDelete:   'RESTRICT',
  onUpdate:   'CASCADE',
});

Product.hasMany(OrderItem, {
  foreignKey: {
    name:      'productId',
    field:     'product_id',
    allowNull: false,
  },
  as:         'orderItems',
  onDelete:   'RESTRICT',
  onUpdate:   'CASCADE',
});

Product.belongsTo(ProductCategory, {
  foreignKey: {
    name:      'categoryId',
    field:     'category_id',
    allowNull: false,
  },
  as:       'category',
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE',
});

ProductCategory.hasMany(Product, {
  foreignKey: {
    name:      'categoryId',
    field:     'category_id',
    allowNull: false,
  },
  as:       'products',
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE',
});

module.exports = { sequelize, Product, ProductCategory, Order, OrderItem, AdminSession };
