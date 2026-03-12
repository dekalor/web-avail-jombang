const db = require('../models');
const orderRepository = require('../repositories/orderRepository');
const productRepository = require('../repositories/productRepository');
const shippingRepository = require('../repositories/shippingRepository');
const generateOrderNumber = require("../utils/generateOrderNumber")
const { storeOrderPaymentProof } = require('../utils/cloudinaryStore');
const { notifyOrderReceived } = require('../utils/orderEmailNotifier');
const { FREE_SHIPPING_MIN } = require('../config/config');

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
        throw Object.assign(new Error(`ID Produk ${productId} tidak ditemukan`), { status: 400 });
      }
      if (!product.active) {
        throw Object.assign(new Error(`Produk "${product.name}" sedang tidak tersedia`), { status: 400 });
      }
      let unit = null;
      if (item.product_unit_id) {
        unit = await productRepository.findUnitById(Number(item.product_unit_id));
        if (unit && unit.productId !== product.id) unit = null;
        
      } else {
        unit = await productRepository.findUnit(product.id, 'pcs');
        if (!unit) {
          unit = await productRepository.findFirstUnit(product.id);
        }
      }

      if (!unit || !unit.active) {
        throw Object.assign(new Error(`Unit produk untuk "${product.name}" tidak ditemukan`), { status: 400 });
      }

      const qtyPerUnit = Number(unit.qtyPerUnit);
      const qtyInPcs = qty * qtyPerUnit;
      if (product.stock < qtyInPcs) {
        throw Object.assign(
          new Error(`Stok tidak cukup untuk produk "${product.name}" (tersedia: ${product.stock} pcs)`),
          { status: 400 }
        );
      }

      const lineTotal = Number(unit.price) * qty;
      calc_subtotal += lineTotal;
      lines.push({
        product,
        qty,
        qtyInPcs,
        lineTotal,
        unit,
      });
    }

    if (calc_subtotal != subtotal) {
      throw Object.assign(new Error(`Terdapat perubahan harga, silahkan refresh halaman`), { status: 400 });
    }

    const shippingCost =
      payment_method === 'cod' || calc_subtotal >= FREE_SHIPPING_MIN
        ? 0
        : Number(shipping.cost || 0);
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

      for (const { product, qty, qtyInPcs, unit } of lines) {
        await orderRepository.createItem({
          orderId: newOrder.id,
          productId: product.id,
          productUnitId: unit.id,
          price: unit.price,
          qty,
        }, transaction);

        await productRepository.decrementStock(product.id, qtyInPcs, transaction);
      }

      return newOrder;
    });

    const createdOrder = await orderRepository.findById(order.id);

    try {
      await notifyOrderReceived(createdOrder);
    } catch (emailErr) {
      console.error(`[OrderEmail] Failed to send notification for order ${createdOrder.orderNumber}: ${emailErr.message}`);
    }

    return createdOrder;
  },

  async getOrderById(id) {
    const order = await orderRepository.findById(id);
    if (!order) throw Object.assign(new Error('Order not found'), { status: 404 });

    const [province, city, district, paymentMethod] = await Promise.all([
      shippingRepository.provinceFindById(order.provinceId),
      shippingRepository.cityFindById(order.cityId),
      shippingRepository.districtFindById(order.districtId),
      orderRepository.findPaymentMethodById(order.paymentMethodId)
    ]);

    const data = typeof order.toJSON === 'function' ? order.toJSON() : order;
    data.provinceName = province?.name || null;
    data.cityName = city?.name || null;
    data.districtName = district?.name || null;
    data.paymentMethodName = paymentMethod?.name || null;

    return data;
  },

  async listOrders({ status, limit, offset, sortBy, sortDir } = {}) {
    return orderRepository.findAll({ status, limit, offset, sortBy, sortDir });
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
    const [total_orders, unique_customers, total_revenue, pending, today, revenue7d, topProducts, todayStatusRows] = await Promise.all([
      orderRepository.countAll(),
      orderRepository.countUniqueCustomers(),
      orderRepository.sumRevenue(),
      orderRepository.countByStatus('pending'),
      orderRepository.countToday(),
      orderRepository.getRevenueLast7Days(),
      orderRepository.getTopProducts(),
      orderRepository.getTodayStatusCounts(),
    ]);

    const today_status_counts = {
      pending: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
    };

    for (const row of todayStatusRows || []) {
      const key = row.status;
      if (!Object.prototype.hasOwnProperty.call(today_status_counts, key)) continue;
      today_status_counts[key] = Number(row.count || 0);
    }

    return {
      total_orders,
      unique_customers,
      total_revenue: total_revenue || 0,
      pending,
      today,
      today_status_counts,
      revenue7d,
      topProducts,
    };
  },

  async getPaymentMethod() {
    return orderRepository.findAllPaymentMethod(true);
  },

};

module.exports = orderService;
