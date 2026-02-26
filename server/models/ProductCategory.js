const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ProductCategory extends Model {

    static associate(models) {
      ProductCategory.hasMany(models.Product, {
        foreignKey: {
          name: 'categoryId',
          field: 'category_id',
          allowNull: false,
        },
        as: 'products',
      });
    }

  }

  ProductCategory.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
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
    modelName: 'ProductCategory',
    tableName: 'product_categories',
  });

  return ProductCategory;
};