const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class OrderItem extends Model {

    static associate(models) {
      OrderItem.belongsTo(models.Order, {
        foreignKey: {
          name: 'orderId',
          field: 'order_id',
          allowNull: false,
        },
        as: 'order',
      });

      OrderItem.belongsTo(models.Product, {
        foreignKey: {
          name: 'productId',
          field: 'product_id',
          allowNull: false,
        },
        as: 'product',
      });
    }

  }

  OrderItem.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    orderId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'order_id',
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'product_id',
    },
    productName: {
      type: DataTypes.STRING(100),  // snapshot at purchase time
      allowNull: false,
      field: 'product_name',
    },
    price: {
      type: DataTypes.INTEGER,      // snapshot at purchase time
      allowNull: false,
    },
    qty: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    lineTotal: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'line_total',
    },
  }, {
    sequelize,
    modelName: 'OrderItem',
    tableName: 'order_items',
    timestamps: false,
  });

  return OrderItem;
};
