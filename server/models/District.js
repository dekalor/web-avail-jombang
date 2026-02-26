const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class District extends Model {

    static associate(models) {
      District.belongsTo(models.City, {
        foreignKey: {
          name: 'cityId',
          field: 'city_id',
          allowNull: false,
        },
      });

      District.hasMany(models.ShippingCost, {
        foreignKey: {
          name: 'destinationDistrictId',
          field: 'destination_district_id',
          allowNull: false,
        },
        as: 'shippingCosts'
      });
    }

  }

  District.init({
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
    sequelize,
    modelName: 'District',
    tableName: 'districts',
    timestamps: false,
  });

  return District;
};