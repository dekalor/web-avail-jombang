// server/controllers/orderController.js
// Handles HTTP req/res only. All logic lives in orderService.

const orderService = require('../services/orderService');

const REQUIRED_CUSTOMER_FIELDS = ['name', 'phone', 'address', 'city', 'postal'];

const orderController = {

  async store(req, res, next) {
    try {
      const { customer, cart } = req.body;

      for (const field of REQUIRED_CUSTOMER_FIELDS) {
        if (!customer?.[field]?.toString().trim()) {
          return res.status(400).json({ success: false, message: `Missing required field: ${field}` });
        }
      }
      if (!Array.isArray(cart) || cart.length === 0) {
        return res.status(400).json({ success: false, message: 'Cart is empty' });
      }

      const order = await orderService.placeOrder(customer, cart);
      console.log(`📦 New order #${order.id} | ${order.customerName} | Rp ${order.total.toLocaleString('id-ID')}`);

      res.status(201).json({
        success: true,
        message: 'Order placed successfully',
        data:    { orderId: order.id, total: order.total, status: order.status },
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
      const { status, limit = 50, offset = 0 } = req.query;
      const orders = await orderService.listOrders({ status, limit: +limit, offset: +offset });
      res.json({ success: true, data: orders });
    } catch (err) { next(err); }
  },
};

module.exports = orderController;
