const productService = require('../services/productService');
const productCategoryService = require('../services/productCategoryService')

const productController = {

  async index(req, res, next) {
    try {
      const { category_id, sort_price } = req.query;
      const parsedCategoryId = +category_id;
      const normalizedCategoryId = category_id && category_id !== 'all' && Number.isFinite(parsedCategoryId)
        ? parsedCategoryId
        : undefined;
      const normalizedSort = sort_price === 'asc' || sort_price === 'desc' ? sort_price : 'default';

      const products = await productService.getAllProducts({
        activeOnly: true,
        categoryId: normalizedCategoryId,
        priceSort: normalizedSort,
      });
      res.json({ success: true, data: products });
    } catch (err) { next(err); }
  },

  async show(req, res, next) {
    try {
      const product = await productService.getProductById(req.params.id);
      res.json({ success: true, data: product });
    } catch (err) { next(err); }
  },

  async getCategories(req, res, next) {
    try {
      const categories = await productCategoryService.getAllProductCategories({
        activeOnly: false,
        attributes: ['id', 'name']
      });
      res.json({ success: true, data: categories });
    } catch (err) { next(err); }
  }
};

module.exports = productController;
