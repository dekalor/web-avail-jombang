'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('order_items', 'product_unit_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      after: 'product_id',
      references: {
        model: 'product_units',
        key: 'id',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });

    await queryInterface.addIndex('order_items', ['product_unit_id']);
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('order_items', 'product_unit_id');
  },
};
