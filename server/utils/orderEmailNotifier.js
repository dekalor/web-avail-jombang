const nodemailer = require('nodemailer');
const { EMAIL } = require('../config/config');
const orderRepository = require('../repositories/orderRepository');

let cachedTransporter = null;

function isConfigured() {
  return Boolean(
    EMAIL.SMTP_HOST &&
    EMAIL.SMTP_PORT &&
    EMAIL.SMTP_USER &&
    EMAIL.SMTP_PASS &&
    EMAIL.SMTP_FROM &&
    EMAIL.ORDER_NOTIFICATION_EMAIL
  );
}

function getTransporter() {
  if (cachedTransporter) return cachedTransporter;

  cachedTransporter = nodemailer.createTransport({
    host: EMAIL.SMTP_HOST,
    port: EMAIL.SMTP_PORT,
    secure: EMAIL.SMTP_SECURE,
    auth: {
      user: EMAIL.SMTP_USER,
      pass: EMAIL.SMTP_PASS,
    },
  });

  return cachedTransporter;
}

function formatCurrency(value) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

async function notifyOrderReceived(order) {
  if (!isConfigured()) return { skipped: true, reason: 'email_not_configured' };

  const transporter = getTransporter();
  const totalItems = Array.isArray(order.items)
    ? order.items.reduce((sum, item) => sum + Number(item.qty || 0), 0)
    : 0;

  const paymentMethod = await orderRepository.findPaymentMethodById(order.paymentMethodId)

  const subject = `Order Baru Diterima - ${order.orderNumber}`;
  const text = [
    'Order baru telah diterima.',
    '',
    `No. Order: ${order.orderNumber}`,
    `Order ID: ${order.id}`,
    `Pelanggan: ${order.customerName}`,
    `Whatsapp: ${order.customerPhone}`,
    `Jumlah Item: ${totalItems}`,
    `Subtotal: ${formatCurrency(order.subtotal)}`,
    `Ongkir: ${formatCurrency(order.shippingCost)}`,
    `Total: ${formatCurrency(order.total)}`,
    `Metode Pembayaran: ${paymentMethod?.name}`,
    `Status: ${order.status}`,
    '',
    `Alamat: ${order.address}`,
    `Catatan: ${order.notes || '-'}`,
  ].join('\n');

  await transporter.sendMail({
    from: EMAIL.SMTP_FROM,
    to: EMAIL.ORDER_NOTIFICATION_EMAIL,
    subject,
    text,
  });

  return { skipped: false };
}

module.exports = { notifyOrderReceived };
