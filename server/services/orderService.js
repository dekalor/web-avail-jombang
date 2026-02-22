const { sequelize }       = require('../db/index');
const orderRepository     = require('../repositories/orderRepository');
const productRepository   = require('../repositories/productRepository');
const { FREE_SHIPPING_MIN, SHIPPING_FEE } = require('../config/config');

const VALID_STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

const orderService = {

  async placeOrder(customer, cartItems) {
    // ── 1. Validate + build line items ─────────────────────────────────────
    const lines    = [];
    let   subtotal = 0;

    for (const { id, qty: rawQty } of cartItems) {
      const product = await productRepository.findById(id);
      if (!product)        throw Object.assign(new Error(`Product id ${id} not found`),  { status: 400 });
      if (!product.active) throw Object.assign(new Error(`Product "${product.name}" is unavailable`), { status: 400 });
      if (product.stock < rawQty) {
        throw Object.assign(
          new Error(`Insufficient stock for "${product.name}" (available: ${product.stock})`),
          { status: 400 }
        );
      }

      const qty       = parseInt(rawQty) || 1;
      const lineTotal = product.price * qty;
      subtotal       += lineTotal;
      lines.push({ product, qty, lineTotal });
    }

    // ── 2. Compute shipping + total ────────────────────────────────────────
    const shippingFee = subtotal >= FREE_SHIPPING_MIN ? 0 : SHIPPING_FEE;
    const total       = subtotal + shippingFee;

    // ── 3. Persist inside a transaction ───────────────────────────────────
    const order = await sequelize.transaction(async (t) => {
      const newOrder = await orderRepository.create({
        customerName:    customer.name,
        customerPhone:   customer.phone,
        customerAddress: customer.address,
        customerCity:    customer.city,
        customerPostal:  customer.postal,
        customerNotes:   customer.notes || null,
        subtotal,
        shippingFee,
        total,
        status: 'pending',
      }, t);

      for (const { product, qty, lineTotal } of lines) {
        await orderRepository.createItem({
          orderId:     newOrder.id,
          productId:   product.id,
          productName: product.name,  // snapshot
          price:       product.price, // snapshot
          qty,
          lineTotal,
        }, t);

        await productRepository.decrementStock(product.id, qty, t);
      }

      return newOrder;
    });

    // Return the full order with items
    return orderRepository.findById(order.id);
  },

  async getOrderById(id) {
    const order = await orderRepository.findById(id);
    if (!order) throw Object.assign(new Error('Order not found'), { status: 404 });
    return order;
  },

  async listOrders({ status, limit, offset } = {}) {
    return orderRepository.findAll({ status, limit, offset });
  },

  async updateOrderStatus(id, status) {
    if (!VALID_STATUSES.includes(status)) {
      throw Object.assign(
        new Error(`Invalid status. Allowed: ${VALID_STATUSES.join(', ')}`),
        { status: 400 }
      );
    }
    const order = await orderRepository.updateStatus(id, status);
    if (!order) throw Object.assign(new Error('Order not found'), { status: 404 });
    return order;
  },

  async getOrderStats() {
    const [total_orders, total_revenue, pending, today, revenue7d, topProducts] = await Promise.all([
      orderRepository.countAll(),
      orderRepository.sumRevenue(),
      orderRepository.countByStatus('pending'),
      orderRepository.countToday(),
      orderRepository.getRevenueLast7Days(),
      orderRepository.getTopProducts(),
    ]);

    return {
      total_orders,
      total_revenue: total_revenue || 0,
      pending,
      today,
      revenue7d,
      topProducts,
    };
  },
};

module.exports = orderService;
