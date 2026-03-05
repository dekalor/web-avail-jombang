const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ProductUnit extends Model {
    static associate(models) {
      ProductUnit.belongsTo(models.Product, {
        foreignKey: {
          name: 'productId',
          field: 'product_id',
          allowNull: false,
        },
        as: 'product',
      });

      ProductUnit.hasMany(models.OrderItem, {
        foreignKey: {
          name: 'productUnitId',
          field: 'product_unit_id',
          allowNull: true,
        },
        as: 'orderItems',
      });
    }
  }

  ProductUnit.init({
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
    unitCode: {
      type: DataTypes.STRING(20),
      allowNull: false,
      field: 'unit_code',
    },
    label: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    weight: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    qtyPerUnit: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      field: 'qty_per_unit',
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  }, {
    sequelize,
    modelName: 'ProductUnit',
    tableName: 'product_units',
  });

  return ProductUnit;
};
