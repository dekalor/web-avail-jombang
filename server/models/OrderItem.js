// server/models/OrderItem.js
// Defines the DB schema for order line items. No business logic here.

const { DataTypes } = require('sequelize');
const sequelize     = require('../db/sequelize');

const OrderItem = sequelize.define('OrderItem', {
  id: {
    type:          DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey:    true,
  },
  orderId: {
    type:      DataTypes.UUID,
    allowNull: false,
    field:     'order_id',
  },
  productId: {
    type:      DataTypes.INTEGER,
    allowNull: false,
    field:     'product_id',
  },
  productName: {
    type:      DataTypes.STRING(100),  // snapshot at purchase time
    allowNull: false,
    field:     'product_name',
  },
  price: {
    type:      DataTypes.INTEGER,      // snapshot at purchase time
    allowNull: false,
  },
  qty: {
    type:      DataTypes.INTEGER,
    allowNull: false,
  },
  lineTotal: {
    type:      DataTypes.INTEGER,
    allowNull: false,
    field:     'line_total',
  },
}, {
  tableName:  'order_items',
  timestamps: false,
});

module.exports = OrderItem;
