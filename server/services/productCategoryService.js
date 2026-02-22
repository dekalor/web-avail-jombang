const productCategoryRepository = require('../repositories/productCategoryRepository');

const productCategoryService = {

  async getAllProductCategories({ activeOnly = true, attributes = null } = {}) {
    return productCategoryRepository.findAll({ activeOnly, attributes });
  },

  async getProductCategoryById(id) {
    const product = await productCategoryRepository.findById(id);
    if (!product) throw Object.assign(new Error('Product Category not found'), { status: 404 });
    return product;
  },

  async createProductCategory({ name }) {
    if (!name) {
      throw Object.assign(new Error('name is required'), { status: 400 });
    }
    return productCategoryRepository.create({
      name,
    });
  },

  async updateProductCategory(id, fields) {
    const patch = {};
    if (fields.name !== undefined) patch.name = fields.name;
    if (fields.active !== undefined) patch.active = !!+fields.active;

    const product = await productCategoryRepository.update(id, patch);
    if (!product) throw Object.assign(new Error('Product Category not found'), { status: 404 });
    return product;
  },

  async deactivateProductCategory(id) {
    const product = await productCategoryRepository.softDelete(id);
    if (!product) throw Object.assign(new Error('Product Category not found'), { status: 404 });
    return product;
  },

};

module.exports = productCategoryService;
