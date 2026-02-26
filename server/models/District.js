const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize');

const District = sequelize.define('District', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  cityId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'city_id'
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
}, {
  tableName: 'districts',
  timestamps: false,
});

module.exports = District;
