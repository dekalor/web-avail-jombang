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
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    orderNumber: {
      type: DataTypes.STRING,
      unique: true,
      field: 'order_number'
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
    provinceId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'province_id',
    },
    cityId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'city_id',
    },
    districtId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'district_id',
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'customer_address',
    },
    postalCode: {
      type: DataTypes.STRING(10),
      allowNull: false,
      field: 'postal_code',
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'notes',
    },
    paymentMethodId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'payment_method_id',
    },
    courierCode: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: 'courier_code',
    },
    paymentProofUrl: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'payment_proof_url',
    },
    subtotal: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    shippingCost: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'shipping_cost',
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
