const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize');

const City = sequelize.define('City', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  provinceId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'province_id'
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
}, {
  tableName: 'cities',
  timestamps: false,
});

module.exports = City;
