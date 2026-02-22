const { ProductCategory } = require('../db/index');

const productCategoryRepository = {

  findAll({ activeOnly = true, attributes = null } = {}) {
    const where = activeOnly ? { active: true } : {};

    return ProductCategory.findAll({
      attributes: attributes,
      where,
      order: [['id', 'ASC']],
    });
  },

  findById(id) {
    return ProductCategory.findByPk(id);
  },

  create(data) {
    return ProductCategory.create(data);
  },

  async update(id, data) {
    const product = await ProductCategory.findByPk(id);
    if (!product) return null;
    return product.update(data);
  },

  async softDelete(id) {
    const product = await ProductCategory.findByPk(id);
    if (!product) return null;
    return product.update({ active: false });
  },

};

module.exports = productCategoryRepository;
