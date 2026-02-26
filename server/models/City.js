const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class City extends Model {

    static associate(models) {
      City.belongsTo(models.Province, {
        foreignKey: {
          name: 'provinceId',
          field: 'province_id',
          allowNull: false,
        },
      });

      City.hasMany(models.District, {
        foreignKey: {
          name: 'cityId',
          field: 'city_id',
          allowNull: false,
        },
      })
    }

  }

  City.init({
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
    sequelize,
    modelName: 'City',
    tableName: 'cities',
    timestamps: false,
  });

  return City;
};