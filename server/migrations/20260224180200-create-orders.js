'use strict';

const tableName = 'orders';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(tableName, {
      id: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      orderNumber: {
        type: Sequelize.STRING,
        unique: true,
        field: 'order_number'
      },
      customerName: {
        type: Sequelize.STRING(120),
        allowNull: false,
        field: 'customer_name',
      },
      customerPhone: {
        type: Sequelize.STRING(30),
        allowNull: false,
        field: 'customer_phone',
      },
      provinceId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        field: 'province_id',
      },
      cityId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        field: 'city_id',
      },
      districtId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        field: 'district_id',
      },
      address: {
        type: Sequelize.TEXT,
        allowNull: false,
        field: 'customer_address',
      },
      postalCode: {
        type: Sequelize.STRING(10),
        allowNull: false,
        field: 'postal_code',
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true,
        field: 'notes',
      },
      paymentMethodId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        field: 'payment_method_id',
      },
      courierCode: {
        type: Sequelize.STRING(10),
        allowNull: true,
        field: 'courier_code',
      },
      paymentProofUrl: {
        type: Sequelize.STRING(255),
        allowNull: true,
        field: 'payment_proof_url',
      },
      subtotal: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      shippingCost: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        field: 'shipping_cost',
      },
      total: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled'),
        allowNull: false,
        defaultValue: 'pending',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        field: 'created_at'
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        field: 'updated_at'
      }
    }).then(async () => {
      await queryInterface.addIndex(tableName, ['order_number']);
      await queryInterface.addIndex(tableName, ['province_id']);
      await queryInterface.addIndex(tableName, ['city_id']);
      await queryInterface.addIndex(tableName, ['district_id']);
      await queryInterface.addIndex(tableName, ['payment_method_id']);
      await queryInterface.addIndex(tableName, ['status']);
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(tableName);
  },
};
