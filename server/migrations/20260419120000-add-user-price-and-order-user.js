'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('product_units', 'user_price', {
      type: Sequelize.INTEGER,
      allowNull: true,
      after: 'price',
    });

    await queryInterface.addColumn('orders', 'user_id', {
      type: Sequelize.BIGINT,
      allowNull: true,
      after: 'id',
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });

    await queryInterface.addIndex('orders', ['user_id']);
  },

  async down(queryInterface) {
    await queryInterface.removeIndex('orders', ['user_id']);
    await queryInterface.removeColumn('orders', 'user_id');
    await queryInterface.removeColumn('product_units', 'user_price');
  },
};
