const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class AdminSession extends Model { }

  AdminSession.init({
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
    sequelize,
    modelName: 'AdminSession',
    tableName: 'admin_sessions',
    timestamps: false,
  });

  return AdminSession;
};