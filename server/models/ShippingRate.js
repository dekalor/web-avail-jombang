const { DataTypes, NOW } = require('sequelize');
const sequelize = require('../db/sequelize');

const ShippingRate = sequelize.define('ShippingRate', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  cityId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'city_id',
  },
  courierId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'courier_id',
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  etd: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
}, {
  tableName: 'shipping_rates',
});

module.exports = ShippingRate;
