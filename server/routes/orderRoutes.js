const express = require('express');
const router = express.Router();
const validator = require('../middleware/validator')
const {
  issueCheckoutProtection,
  verifyCheckoutProtection,
  orderCreateRateLimiter,
} = require('../middleware/orderCheckoutProtection');

// controller
const orderController = require('../controllers/orderController');

// validation schemas
const orderSchema = require('../schemas/orderSchema')

router.get('/get-payment-method', orderController.getPaymentMethod);
router.get('/checkout-config', orderController.getCheckoutConfig);
router.get('/checkout-protection', issueCheckoutProtection);
router.post(
  '/create',
  orderCreateRateLimiter,
  validator(orderSchema),
  verifyCheckoutProtection,
  orderController.createOrder
);
router.get('/', orderController.index);
router.get('/:id', orderController.show);

module.exports = router;
