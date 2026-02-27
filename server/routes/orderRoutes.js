// server/routes/orderRoutes.js
const express = require('express');
const router  = express.Router();
const orderController = require('../controllers/orderController');

router.get('/',    orderController.index);
router.get('/get-payment-method', orderController.getPaymentMethod);
router.get('/:id', orderController.show);
router.post('/',   orderController.store);

module.exports = router;
