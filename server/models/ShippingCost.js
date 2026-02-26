const { DataTypes, NOW } = require('sequelize');
const sequelize = require('../db/sequelize');

const ShippingCost = sequelize.define("ShippingCost", {
  originDistrictId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'origin_district_id'
  },
  destinationDistrictId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'destination_district_id'
  },
  courier: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  service: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  pricePerKg: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'price_per_kg'
  },
  etd: {
    type: DataTypes.STRING,
    allowNull: true
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'expires_at'
  }
}, {
  tableName: "shipping_costs",
  indexes: [
    {
      unique: true,
      fields: [
        "origin_district_id",
        "destination_district_id",
        "courier",
        "service"
      ],
      name: 'shipping_costs_unique_idx'
    }
  ]
});

module.exports = ShippingCost;
