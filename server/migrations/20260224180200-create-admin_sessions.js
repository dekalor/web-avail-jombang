'use strict';

const tableName = 'admin_sessions';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(tableName, {
      sid: {
        type: Sequelize.STRING(191),
        allowNull: false,
        primaryKey: true,
      },
      expires: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      data: {
        type: Sequelize.TEXT('long'),
        allowNull: true,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable(tableName);
  },
};

