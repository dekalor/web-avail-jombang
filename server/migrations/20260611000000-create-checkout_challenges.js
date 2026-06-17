'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('checkout_challenges', {
      id: {
        type: Sequelize.STRING(36),
        primaryKey: true,
        allowNull: false,
      },
      guest_token: {
        type: Sequelize.STRING(48),
        allowNull: false,
      },
      ip: {
        type: Sequelize.STRING(45),
        allowNull: false,
      },
      issued_at: {
        type: Sequelize.BIGINT,
        allowNull: false,
      },
      expires_at: {
        type: Sequelize.BIGINT,
        allowNull: false,
      },
    });

    await queryInterface.addIndex('checkout_challenges', ['expires_at']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('checkout_challenges');
  },
};
