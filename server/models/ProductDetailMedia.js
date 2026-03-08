const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ProductDetailMedia extends Model {
    static associate(models) {
      ProductDetailMedia.belongsTo(models.Product, {
        foreignKey: {
          name: 'productId',
          field: 'product_id',
          allowNull: false,
        },
        as: 'product',
      });
    }
  }

  ProductDetailMedia.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'product_id',
    },
    mediaType: {
      type: DataTypes.ENUM('image', 'video'),
      allowNull: false,
      field: 'media_type',
    },
    mediaUrl: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'media_url',
    },
    sortOrder: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      field: 'sort_order',
    },
  }, {
    sequelize,
    modelName: 'ProductDetailMedia',
    tableName: 'product_detail_medias',
  });

  return ProductDetailMedia;
};
