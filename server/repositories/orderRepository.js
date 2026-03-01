const { Op, fn, col, literal } = require('sequelize');
const { Order, OrderItem, PaymentMethod, Product } = require('../models');

const orderRepository = {

  findById(id) {
    return Order.findByPk(id, {
      include: [{ model: OrderItem, as: 'items' }],
    });
  },

  findAll({ status, limit = 50, offset = 0 } = {}) {
    const where = status ? { status } : {};
    return Order.findAll({
      where,
      order: [['created_at', 'DESC']],
      limit,
      offset,
    });
  },

  create(orderData, transaction) {
    return Order.create(orderData, { transaction });
  },

  createItem(itemData, transaction) {
    return OrderItem.create(itemData, { transaction });
  },

  async updateStatus(id, status) {
    const order = await Order.findByPk(id);
    if (!order) return null;
    return order.update({ status });
  },

  // ── Stats queries ─────────────────────────────────────────────────────────
  countAll() {
    return Order.count();
  },

  sumRevenue() {
    return Order.sum('total', {
      where: { status: { [Op.ne]: 'cancelled' } },
    });
  },

  countByStatus(status) {
    return Order.count({ where: { status } });
  },

  countToday() {
    return Order.count({
      where: {
        created_at: { [Op.gte]: literal('CURDATE()') },
      },
    });
  },

  getRevenueLast7Days() {
    return Order.findAll({
      attributes: [
        [fn('DATE', col('created_at')), 'day'],
        [fn('SUM', col('total')), 'revenue'],
      ],
      where: {
        created_at: { [Op.gte]: literal('DATE_SUB(CURDATE(), INTERVAL 6 DAY)') },
        status: { [Op.ne]: 'cancelled' },
      },
      group: [fn('DATE', col('created_at'))],
      order: [[fn('DATE', col('created_at')), 'ASC']],
      raw: true,
    });
  },

  getTopProducts(limit = 5) {
    return OrderItem.findAll({
      attributes: [
        [col('product.name'), 'product_name'],
        [fn('SUM', col('OrderItem.qty')), 'units_sold'],
      ],
      include: [
        {
          model: Order,
          as: 'order',
          attributes: [],
          where: { status: { [Op.ne]: 'cancelled' } },
        },
        {
          model: Product,
          as: 'product',
          attributes: ['name'],
        },
      ],
      group: ['OrderItem.product_id', 'product.name'],
      order: [[fn('SUM', col('OrderItem.qty')), 'DESC']],
      limit,
      raw: true,
    });
  },

  findAllPaymentMethod(active) {
    return PaymentMethod.findAll({
      where: {
        active
      },
    });
  },

  findPaymentMethod(where) {
    return PaymentMethod.findOne({
      where,
    });
  },

  findPaymentMethodById(id) {
    return PaymentMethod.findByPk(id);
  },

};

module.exports = orderRepository;
