const productRepository = require('../repositories/productRepository');
const productCategoryRepository = require('../repositories/productCategoryRepository');

const productService = {

  async getAllProducts({ activeOnly = true, categoryId, priceSort = 'default' } = {}) {
    return productRepository.findAll({ activeOnly, categoryId, priceSort });
  },

  async getProductById(id) {
    const product = await productRepository.findById(id);
    if (!product) throw Object.assign(new Error('Product not found'), { status: 404 });
    return product;
  },

  async createProduct({ name, description, categoryId, category_id, price, imageUrl, badge, stock }) {
    if (!name || !price) {
      throw Object.assign(new Error('name and price are required'), { status: 400 });
    }


    const product = await productRepository.create({
      name,
      description: description || '',
      categoryId: +(categoryId || category_id || 1),
      price:  +price,
      imageUrl: imageUrl || null,
      badge:  badge  || null,
      stock:  +stock || 100,
      active: true,
    });

    return {
      ...product.toJSON(),
      category: {
        name: (await productCategoryRepository.findById(product.categoryId)).name
      }
    }
  },

  async updateProduct(id, fields) {
    const patch = {};
    if (fields.name !== undefined) patch.name = fields.name;
    if (fields.description !== undefined) patch.description = fields.description;
    if (fields.categoryId !== undefined) patch.categoryId = +fields.categoryId;
    if (fields.category_id !== undefined) patch.categoryId = +fields.category_id;
    if (fields.price !== undefined) patch.price = +fields.price;
    if (fields.imageUrl !== undefined) patch.imageUrl = fields.imageUrl || null;
    if (fields.badge !== undefined) patch.badge = fields.badge || null;
    if (fields.stock !== undefined) patch.stock = +fields.stock;
    if (fields.active !== undefined) patch.active = !!+fields.active;

    const product = await productRepository.update(id, patch);
    if (!product) throw Object.assign(new Error('Product not found'), { status: 404 });

    return {
      ...product.toJSON(),
      category: {
        name: (await productCategoryRepository.findById(product.categoryId)).name
      }
    }
  },

  async deactivateProduct(id) {
    const product = await productRepository.softDelete(id);
    if (!product) throw Object.assign(new Error('Product not found'), { status: 404 });
    return product;
  },

  async getProductStats() {
    const [total, lowStock] = await Promise.all([
      productRepository.countActive(),
      productRepository.countLowStock(),
    ]);
    return { total, low_stock: lowStock };
  },
};

module.exports = productService;
