const db = require('../models');
const orderRepository = require('../repositories/orderRepository');
const productRepository = require('../repositories/productRepository');
const generateOrderNumber = require("../utils/generateOrderNumber")
const { storeOrderPaymentProof } = require('../utils/localImageStore');

const VALID_STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

const orderService = {

  async placeOrder(data) {
    const { customer, shipping, items, payment_method, payment_method_id, payment_proof_data, subtotal } = data;

    if ((payment_method === 'bank' || payment_method === 'qris') && !payment_proof_data) {
      throw Object.assign(new Error('Bukti pembayaran wajib diupload untuk metode pembayaran ini'), { status: 400 });
    }

    const lines = [];
    let calc_subtotal = 0; // Calculate subtotal from items submitted

    for (const item of items) {
      const productId = Number(item.product_id);
      const qty = Number(item.qty);

      const product = await productRepository.findById(productId);
      if (!product) {
        throw Object.assign(new Error(`Product id ${productId} not found`), { status: 400 });
      }
      if (!product.active) {
        throw Object.assign(new Error(`Product "${product.name}" is unavailable`), { status: 400 });
      }
      if (product.stock < qty) {
        throw Object.assign(
          new Error(`Insufficient stock for "${product.name}" (available: ${product.stock})`),
          { status: 400 }
        );
      }

      const lineTotal = product.price * qty;
      calc_subtotal += lineTotal;
      lines.push({ product, qty, lineTotal });
    }

    if (calc_subtotal != subtotal) {
      throw Object.assign(new Error(`Terdapat perubahan harga, silahkan refresh halaman`), { status: 400 });
    }

    const shippingCost = payment_method === 'cod' ? 0 : Number(shipping.cost || 0);
    const total = calc_subtotal + shippingCost;

    let paymentProofUrl = null
    if (payment_proof_data) {
      paymentProofUrl = await storeOrderPaymentProof(payment_proof_data);
    }

    const order = await db.sequelize.transaction(async (transaction) => {
      const orderNumber = await generateOrderNumber(transaction);

      const newOrder = await orderRepository.create({
        orderNumber,
        customerName: customer.name,
        customerPhone: customer.phone,
        provinceId: Number(shipping.province_id),
        cityId: Number(shipping.city_id),
        districtId: Number(shipping.district_id),
        address: shipping.address,
        postalCode: shipping.postal_code,
        notes: shipping.notes || null,
        paymentMethodId: payment_method_id,
        courierCode: payment_method === 'cod' ? null : shipping.courier_code,
        subtotal,
        shippingCost,
        total,
        paymentProofUrl,
      }, transaction);

      for (const { product, qty } of lines) {
        await orderRepository.createItem({
          orderId: newOrder.id,
          productId: product.id,
          price: product.price,
          qty,
        }, transaction);

        await productRepository.decrementStock(product.id, qty, transaction);
      }

      return newOrder;
    });

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

  async getPaymentMethod() {
    return orderRepository.findAllPaymentMethod(true);
  },

};

module.exports = orderService;
