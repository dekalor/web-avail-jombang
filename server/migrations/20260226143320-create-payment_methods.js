'use strict';

const tableName = 'payment_methods';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(tableName, {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      code: {
        type: Sequelize.STRING,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      type: {
        type: Sequelize.STRING,
        allowNull: false
      },
      accountNumber: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: '',
        field: 'account_number'
      },
      accountName: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: '',
        field: 'account_name'
      },
      active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
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
      await queryInterface.addIndex(tableName, ['code']);
      await queryInterface.addIndex(tableName, ['type']);
      await queryInterface.addIndex(tableName, ['active']);
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(tableName);
  }
};