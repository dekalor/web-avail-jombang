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
    price: {
      type: DataTypes.INTEGER,   // IDR, stored as whole number
      allowNull: false,
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
    weight: {
      type: DataTypes.INTEGER,
      allowNull: false,
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