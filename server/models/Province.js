const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize');

const Province = sequelize.define('Province', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
}, {
  tableName: 'provinces',
  timestamps: false,
});

module.exports = Province;
