const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize');

const AdminSession = sequelize.define('AdminSession', {
  sid: {
    type: DataTypes.STRING(191),
    primaryKey: true,
    allowNull: false,
  },
  expires: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  data: {
    type: DataTypes.TEXT('long'),
    allowNull: true,
  },
}, {
  tableName: 'admin_sessions',
  timestamps: false,
});

module.exports = AdminSession;
