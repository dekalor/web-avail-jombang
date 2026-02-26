const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Order extends Model {

    static associate(models) {
      Order.hasMany(models.OrderItem, {
        foreignKey: {
          name: 'orderId',
          field: 'order_id',
          allowNull: false,
        },
        as: 'items',
      });
    }

  }

  Order.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    customerName: {
      type: DataTypes.STRING(120),
      allowNull: false,
      field: 'customer_name',
    },
    customerPhone: {
      type: DataTypes.STRING(30),
      allowNull: false,
      field: 'customer_phone',
    },
    customerAddress: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'customer_address',
    },
    customerCity: {
      type: DataTypes.STRING(80),
      allowNull: false,
      field: 'customer_city',
    },
    customerPostal: {
      type: DataTypes.STRING(10),
      allowNull: false,
      field: 'customer_postal',
    },
    customerNotes: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'customer_notes',
    },
    subtotal: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    shippingFee: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'shipping_fee',
    },
    total: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled'),
      allowNull: false,
      defaultValue: 'pending',
    },
  }, {
    sequelize,
    modelName: 'Order',
    tableName: 'orders',
  });

  return Order;
};
