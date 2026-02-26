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
const ShippingCost = require('../models/ShippingCost');
const District = require('../models/District');

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

City.hasMany(District, {
  foreignKey: {
    name: 'cityId',
    field: 'city_id',
    allowNull: false,
  },
})

District.belongsTo(City, {
  foreignKey: {
    name: 'cityId',
    field: 'city_id',
    allowNull: false,
  },
})

ShippingCost.belongsTo(District, {
  foreignKey: {
    name: 'destinationDistrictId',
    field: 'destination_district_id',
    allowNull: false,
  },
  as: 'district',
});

District.hasMany(ShippingCost, {
  foreignKey: {
    name: 'destinationDistrictId',
    field: 'destination_district_id',
    allowNull: false,
  },
  as: 'shippingCosts'
})

ShippingCost.belongsTo(Courier, {
  foreignKey: 'courier',   // column in ShippingCost
  targetKey: 'code',       // column in Courier
  as: 'courierInfo'
});

Courier.hasMany(ShippingCost, {
  foreignKey: 'courier',
  sourceKey: 'code',
  as: 'shippingCosts'
});

module.exports = { sequelize, Product, ProductCategory, Order, OrderItem, AdminSession, Province, City, District, Courier, ShippingCost };
