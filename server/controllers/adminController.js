// server/controllers/adminController.js
// Handles HTTP req/res only. All logic lives in productService / orderService.

const productService = require('../services/productService');
const orderService   = require('../services/orderService');
const productCategoryService = require('../services/productCategoryService')
const { storeProductImage, deleteUploadedImage } = require('../utils/cloudinaryStore');

const adminController = {

  // ── Dashboard ─────────────────────────────────────────────────────────────
  async getDashboard(req, res, next) {
    try {
      const [orderStats, productStats] = await Promise.all([
        orderService.getOrderStats(),
        productService.getProductStats(),
      ]);
      res.json({ success: true, data: { ...orderStats, ...productStats } });
    } catch (err) { next(err); }
  },

  // ── Orders ────────────────────────────────────────────────────────────────
  async getOrders(req, res, next) {
    try {
      const {
        status,
        limit = 50,
        offset = 0,
        page,
        page_size,
        sort_by,
        sort_dir,
      } = req.query;
      
      const pageSize = page_size;
      const sortBy = sort_by;
      const sortDir = sort_dir;
      const hasPaginationParams =
        page !== undefined ||
        pageSize !== undefined ||
        sortBy !== undefined ||
        sortDir !== undefined;

      if (!hasPaginationParams) {
        const result = await orderService.listOrders({ status, limit: +limit, offset: +offset });
        return res.json({ success: true, data: result.rows || [] });
      }

      const normalizedPageSize = Math.min(Math.max(Number(pageSize || limit || 10), 1), 100);
      const normalizedPage = Math.max(Number(page || 1), 1);
      const normalizedOffset = (normalizedPage - 1) * normalizedPageSize;

      const result = await orderService.listOrders({
        status,
        limit: normalizedPageSize,
        offset: normalizedOffset,
        sortBy: sortBy,
        sortDir: sortDir,
      });

      res.json({
        success: true,
        data: result.rows || [],
        meta: {
          page: normalizedPage,
          pageSize: normalizedPageSize,
          total: Number(result.count || 0),
          totalPages: Math.max(Math.ceil(Number(result.count || 0) / normalizedPageSize), 1),
          sortBy: sortBy || 'createdAt',
          sortDir: String(sortDir || 'desc').toLowerCase() === 'asc' ? 'asc' : 'desc',
        },
      });
    } catch (err) { next(err); }
  },

  async getOrder(req, res, next) {
    try {
      const order = await orderService.getOrderById(req.params.id);
      res.json({ success: true, data: order });
    } catch (err) { next(err); }
  },

  async updateOrderStatus(req, res, next) {
    try {
      const order = await orderService.updateOrderStatus(req.params.id, req.body.status);
      res.json({ success: true, data: order });
    } catch (err) { next(err); }
  },

  // ── Products ──────────────────────────────────────────────────────────────
  async getProducts(req, res, next) {
    try {
      const products = await productService.getAllProducts({
        activeOnly: false,
      });
      res.json({ success: true, data: products });
    } catch (err) { next(err); }
  },

  async createProduct(req, res, next) {
    try {
      const payload = { ...req.body };
      if (payload.imageData) {
        payload.imageUrl = await storeProductImage(payload.imageData);
      }
      delete payload.imageData;
      delete payload.removeImage;

      const product = await productService.createProduct(payload);
      res.status(201).json({ success: true, data: product });
    } catch (err) { next(err); }
  },

  async updateProduct(req, res, next) {
    try {
      const existing = await productService.getProductById(req.params.id);
      const payload = { ...req.body };
      let nextImageUrl = existing.imageUrl || null;

      if (payload.removeImage === true || payload.removeImage === 'true') {
        nextImageUrl = null;
      }
      if (payload.imageData) {
        nextImageUrl = await storeProductImage(payload.imageData);
      }

      payload.imageUrl = nextImageUrl;
      delete payload.imageData;
      delete payload.removeImage;

      const product = await productService.updateProduct(req.params.id, payload);
      if (existing.imageUrl && existing.imageUrl !== nextImageUrl) {
        await deleteUploadedImage(existing.imageUrl);
      }
      res.json({ success: true, data: product });
    } catch (err) { next(err); }
  },

  async deleteProduct(req, res, next) {
    try {
      await productService.deactivateProduct(req.params.id);
      res.json({ success: true, message: 'Product deactivated' });
    } catch (err) { next(err); }
  },

  // ── Product Categories ──────────────────────────────────────────────────────────────
  async getProductCategories(req, res, next) {
    try {
      const products = await productCategoryService.getAllProductCategories({
        activeOnly: false,
      });
      res.json({ success: true, data: products });
    } catch (err) { next(err); }
  },

  async createProductCategory(req, res, next) {
    try {
      const payload = req.body;

      const product = await productCategoryService.createProductCategory(payload);
      res.status(201).json({ success: true, data: product });
    } catch (err) { next(err); }
  },

  async updateProductCategory(req, res, next) {
    try {
      const payload = req.body

      const product = await productCategoryService.updateProductCategory(req.params.id, payload);
      res.json({ success: true, data: product });
    } catch (err) { next(err); }
  },

  async deleteProductCategory(req, res, next) {
    try {
      await productCategoryService.deactivateProductCategory(req.params.id);
      res.json({ success: true, message: 'Product Category deactivated' });
    } catch (err) { next(err); }
  },
};

module.exports = adminController;
