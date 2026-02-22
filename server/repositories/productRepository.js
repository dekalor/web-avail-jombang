const { Op }    = require('sequelize');
const { Product, ProductCategory } = require('../db/index');

const productRepository = {

  findAll({ activeOnly = true, categoryId, priceSort = 'default' } = {}) {
    const where = activeOnly ? { active: true } : {};
    if (categoryId !== undefined && categoryId !== null) {
      where.categoryId = Number(categoryId);
    }

    const order = [];
    if (priceSort === 'asc') order.push(['price', 'ASC']);
    if (priceSort === 'desc') order.push(['price', 'DESC']);
    order.push(['id', 'ASC']);

    return Product.findAll({
      where,
      include: [{
        model: ProductCategory,
        as: 'category',
        attributes: ['id', 'name'],
        required: false,
      }],
      order,
    });
  },

  findById(id) {
    return Product.findByPk(id);
  },

  create(data) {
    return Product.create(data);
  },

  async update(id, data) {
    const product = await Product.findByPk(id);
    if (!product) return null;
    return product.update(data);
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
};

module.exports = productRepository;
