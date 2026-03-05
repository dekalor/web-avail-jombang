'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('product_units', {
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
      unit_code: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      label: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      price: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      weight: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      qty_per_unit: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
        comment: 'Qty in the base unit'
      },
      active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
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

    await queryInterface.addConstraint('product_units', {
      type: 'unique',
      fields: ['product_id', 'unit_code'],
      name: 'product_units_product_id_unit_code_unique',
    });
    await queryInterface.addIndex('product_units', ['product_id']);
    await queryInterface.addIndex('product_units', ['unit_code']);
    await queryInterface.addIndex('product_units', ['active']);

    // Remove products columns
    await queryInterface.removeColumn('products', 'price');
    await queryInterface.removeColumn('products', 'weight');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn('products', 'price', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    });
    
    await queryInterface.addColumn('products', 'weight', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    });

    await queryInterface.sequelize.query(`
      UPDATE products p
      LEFT JOIN product_units pso
        ON pso.product_id = p.id AND pso.unit_code = 'pcs' AND pso.active = 1
      SET p.price = COALESCE(pso.price, p.price), p.weight = COALESCE(pso.weight, p.weight)
    `);

    await queryInterface.dropTable('product_units');
  },
};
