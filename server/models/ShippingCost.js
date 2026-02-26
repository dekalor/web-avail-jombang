const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ShippingCost extends Model {

    static associate(models) {
      ShippingCost.belongsTo(models.District, {
        foreignKey: {
          name: 'destinationDistrictId',
          field: 'destination_district_id',
          allowNull: false,
        },
        as: 'district',
      });

      ShippingCost.belongsTo(models.Courier, {
        foreignKey: 'courier',   // column in ShippingCost
        targetKey: 'code',       // column in Courier
        as: 'courierInfo'
      });
    }

  }

  ShippingCost.init({
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
    sequelize,
    modelName: 'ShippingCost',
    tableName: 'shipping_costs',
    underscored: true
  });

  return ShippingCost;
};