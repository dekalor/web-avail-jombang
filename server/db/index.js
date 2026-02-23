// Central place to import models and define associations.
// Keeps model files clean and association logic in one place.

const sequelize = require('./sequelize');
const Product = require('../models/Product');
const ProductCategory = require('../models/ProductCategory');
const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const AdminSession = require('../models/AdminSession');
const Province = require('../models/Province');
const City = require('../models/City');
const Courier = require('../models/Courier');
const ShippingRate = require('../models/ShippingRate');

// ─── Associations ──────────────────────────────────────────────────────────
Order.hasMany(OrderItem, {
  foreignKey: {
    name: 'orderId',
    field: 'order_id',
    allowNull: false,
  },
  as: 'items',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

OrderItem.belongsTo(Order, {
  foreignKey: {
    name: 'orderId',
    field: 'order_id',
    allowNull: false,
  },
  as: 'order',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

OrderItem.belongsTo(Product, {
  foreignKey: {
    name: 'productId',
    field: 'product_id',
    allowNull: false,
  },
  as: 'product',
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE',
});

Product.hasMany(OrderItem, {
  foreignKey: {
    name: 'productId',
    field: 'product_id',
    allowNull: false,
  },
  as: 'orderItems',
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE',
});

Product.belongsTo(ProductCategory, {
  foreignKey: {
    name: 'categoryId',
    field: 'category_id',
    allowNull: false,
  },
  as: 'category',
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE',
});

ProductCategory.hasMany(Product, {
  foreignKey: {
    name: 'categoryId',
    field: 'category_id',
    allowNull: false,
  },
  as: 'products',
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE',
});

Province.hasMany(City, {
  foreignKey: {
    name: 'provinceId',
    field: 'province_id',
    allowNull: false,
  },
  as: 'products',
});

City.belongsTo(Province, {
  foreignKey: {
    name: 'provinceId',
    field: 'province_id',
    allowNull: false,
  },
});

ShippingRate.belongsTo(City, {
  foreignKey: {
    name: 'cityId',
    field: 'city_id',
    allowNull: false,
  },
  as: 'city',
});

ShippingRate.belongsTo(Courier, {
  foreignKey: {
    name: 'courierId',
    field: 'courier_id',
    allowNull: false,
  },
  as: 'courier',
});

module.exports = { sequelize, Product, ProductCategory, Order, OrderItem, AdminSession, Province, City, Courier, ShippingRate };
