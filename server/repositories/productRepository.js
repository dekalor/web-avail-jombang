const { Op }    = require('sequelize');
const { Product, ProductCategory, ProductUnit } = require('../models');

const productRepository = {

  findAll({ activeOnly = true, categoryId, priceSort = 'default' } = {}) {
    const where = activeOnly ? { active: true } : {};
    if (categoryId !== undefined && categoryId !== null) {
      where.categoryId = Number(categoryId);
    }

    const order = [];
    if (priceSort === 'asc') {
      order.push([{ model: ProductUnit, as: 'defaultUnit' }, 'price', 'ASC']);
    }
    if (priceSort === 'desc') {
      order.push([{ model: ProductUnit, as: 'defaultUnit' }, 'price', 'DESC']);
    }
    order.push(['id', 'ASC']);

    return Product.findAll({
      where,
      include: [{
        model: ProductCategory,
        as: 'category',
        attributes: ['id', 'name'],
        required: false,
      }, {
        model: ProductUnit,
        as: 'defaultUnit',
        required: false,
        where: {
          unitCode: 'pcs',
          active: true,
        },
      }, {
        model: ProductUnit,
        as: 'units',
        required: false,
        where: { active: true },
        separate: true,
      }],
      order,
      distinct: true,
    });
  },

  findById(id) {
    return Product.findByPk(id, {
      include: [{
        model: ProductCategory,
        as: 'category',
        attributes: ['id', 'name'],
        required: false,
      }, {
        model: ProductUnit,
        as: 'defaultUnit',
        required: false,
        where: {
          unitCode: 'pcs',
          active: true,
        },
      }, {
        model: ProductUnit,
        as: 'units',
        required: false,
        where: { active: true },
        separate: true,
      }],
    });
  },

  create(data, transaction) {
    return Product.create(data, { transaction });
  },

  async update(id, data, transaction) {
    const product = await Product.findByPk(id);
    if (!product) return null;
    return product.update(data, { transaction });
  },

  async softDelete(id) {
    const product = await Product.findByPk(id);
    if (!product) return null;
    return product.update({ active: false });
  },

  // ── Stats queries ─────────────────────────────────────────────────────────
  countActive() {
    return Product.count({ where: { active: true } });
  },

  countLowStock(threshold = 20) {
    return Product.count({ where: { active: true, stock: { [Op.lt]: threshold } } });
  },

  decrementStock(id, qty, transaction) {
    return Product.decrement('stock', { by: qty, where: { id }, transaction });
  },

  findUnitById(id) {
    return ProductUnit.findByPk(id);
  },

  findUnit(productId, unitCode) {
    return ProductUnit.findOne({
      where: {
        productId,
        unitCode,
        active: true,
      },
      order: [['id', 'ASC']],
    });
  },

  findFirstUnit(productId) {
    return ProductUnit.findOne({
      where: {
        productId,
        active: true,
      },
      order: [['id', 'ASC']],
    });
  },

  upsertUnit(data, transaction) {
    return ProductUnit.upsert(data, { transaction });
  },
};

module.exports = productRepository;
