const orderService = require('../services/orderService');

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
      const { status, limit = 50, offset = 0 } = req.query;
      const orders = await orderService.listOrders({ status, limit: +limit, offset: +offset });
      res.json({ success: true, data: orders });
    } catch (err) { next(err); }
  },

  async getPaymentMethod(req, res, next) {
    try {
      const paymentMethod = await orderService.getPaymentMethod();
      res.json({ success: true, data: paymentMethod });
    } catch (err) { next(err); }
  },
};

module.exports = orderController;
