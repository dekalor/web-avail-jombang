const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Province extends Model {

    static associate(models) {
      Province.hasMany(models.City, {
        foreignKey: {
          name: 'provinceId',
          field: 'province_id',
          allowNull: false,
        },
        as: 'products',
      });
    }

  }

  Province.init({
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
    sequelize,
    modelName: 'Province',
    tableName: 'provinces',
    timestamps: false,
  });

  return Province;
};