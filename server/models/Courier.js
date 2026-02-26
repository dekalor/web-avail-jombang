const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Courier extends Model {

    static associate(models) {
      Courier.hasMany(models.ShippingCost, {
        foreignKey: 'courier',
        sourceKey: 'code',
        as: 'shippingCosts'
      });
    }

  }

  Courier.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    code: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  }, {
    sequelize,
    modelName: 'Courier',
    tableName: 'couriers',
    timestamps: false,
  });

  return Courier;
};