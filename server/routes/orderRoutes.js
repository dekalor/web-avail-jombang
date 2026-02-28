const express = require('express');
const router = express.Router();
const validator = require('../middleware/validator')

// controller
const orderController = require('../controllers/orderController');

// validation schemas
const orderSchema = require('../schemas/orderSchema')

router.get('/get-payment-method', orderController.getPaymentMethod);
router.get('/', orderController.index);
router.get('/:id', orderController.show);
router.post('/', validator(orderSchema), orderController.createOrder);

module.exports = router;
