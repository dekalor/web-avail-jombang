const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Product extends Model {

    static associate(models) {
      Product.hasMany(models.OrderItem, {
        foreignKey: {
          name: 'productId',
          field: 'product_id',
          allowNull: false,
        },
        as: 'orderItems',
      });

      Product.belongsTo(models.ProductCategory, {
        foreignKey: {
          name: 'categoryId',
          field: 'category_id',
          allowNull: false,
        },
        as: 'category',
      });

      Product.hasMany(models.ProductUnit, {
        foreignKey: {
          name: 'productId',
          field: 'product_id',
          allowNull: false,
        },
        as: 'units',
      });

      Product.hasOne(models.ProductUnit, {
        foreignKey: {
          name: 'productId',
          field: 'product_id',
          allowNull: false,
        },
        as: 'defaultUnit',
      });

      Product.hasMany(models.ProductDetailMedia, {
        foreignKey: {
          name: 'productId',
          field: 'product_id',
          allowNull: false,
        },
        as: 'detailMedia',
      });

    }

  }

  Product.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'category_id',
    },
    imageUrl: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'image_url',
    },
    badge: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 100,
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  }, {
    sequelize,
    modelName: 'Product',
    tableName: 'products',
  });

  return Product;
};
