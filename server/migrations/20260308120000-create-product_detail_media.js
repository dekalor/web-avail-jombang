'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('product_detail_medias', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      product_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'products',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      media_type: {
        type: Sequelize.ENUM('image', 'video'),
        allowNull: false,
      },
      media_url: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      sort_order: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    await queryInterface.addIndex('product_detail_medias', ['product_id']);
    await queryInterface.addIndex('product_detail_medias', ['media_type']);
    await queryInterface.addIndex('product_detail_medias', ['sort_order']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('product_detail_medias');
  },
};
