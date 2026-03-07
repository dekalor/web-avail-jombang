const orderService = require('../services/orderService');
const { FREE_SHIPPING_MIN } = require('../config/config');

const orderController = {

  async createOrder(req, res, next) {
    try {
      const data = { ...req.validated }

      const order = await orderService.placeOrder(data);

      res.status(201).json({
        success: true,
        message: 'Order placed successfully',
        data:    {
          orderId: order.id,
          orderNumber: order.orderNumber,
          total: order.total,
          status: order.status
        },
      });
    } catch (err) { next(err); }
  },

  async show(req, res, next) {
    try {
      const order = await orderService.getOrderById(req.params.id);
      res.json({ success: true, data: order });
    } catch (err) { next(err); }
  },

  async index(req, res, next) {
    try {
      const {
        status,
        limit = 50,
        offset = 0,
        page,
        page_size,
        pageSize,
        sort_by,
        sortBy,
        sort_dir,
        sortDir,
      } = req.query;
      const resolvedPageSize = page_size ?? pageSize;
      const resolvedSortBy = sort_by ?? sortBy;
      const resolvedSortDir = sort_dir ?? sortDir;
      const hasPaginationParams =
        page !== undefined ||
        resolvedPageSize !== undefined ||
        resolvedSortBy !== undefined ||
        resolvedSortDir !== undefined;

      if (!hasPaginationParams) {
        const result = await orderService.listOrders({ status, limit: +limit, offset: +offset });
        return res.json({ success: true, data: result.rows || [] });
      }

      const normalizedPageSize = Math.min(Math.max(Number(resolvedPageSize || limit || 10), 1), 100);
      const normalizedPage = Math.max(Number(page || 1), 1);
      const normalizedOffset = (normalizedPage - 1) * normalizedPageSize;

      const result = await orderService.listOrders({
        status,
        limit: normalizedPageSize,
        offset: normalizedOffset,
        sortBy: resolvedSortBy,
        sortDir: resolvedSortDir,
      });

      res.json({
        success: true,
        data: result.rows || [],
        meta: {
          page: normalizedPage,
          pageSize: normalizedPageSize,
          total: Number(result.count || 0),
          totalPages: Math.max(Math.ceil(Number(result.count || 0) / normalizedPageSize), 1),
          sortBy: resolvedSortBy || 'createdAt',
          sortDir: String(resolvedSortDir || 'desc').toLowerCase() === 'asc' ? 'asc' : 'desc',
        },
      });
    } catch (err) { next(err); }
  },

  async getPaymentMethod(req, res, next) {
    try {
      const paymentMethod = await orderService.getPaymentMethod();
      res.json({ success: true, data: paymentMethod });
    } catch (err) { next(err); }
  },

  async getCheckoutConfig(req, res, next) {
    try {
      res.json({
        success: true,
        data: {
          free_shipping_min: FREE_SHIPPING_MIN,
        },
      });
    } catch (err) { next(err); }
  },
};

module.exports = orderController;
