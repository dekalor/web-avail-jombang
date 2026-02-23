const express = require('express');
const router  = express.Router();
const shippingController = require('../controllers/shippingController');

router.get('/provinces',    shippingController.getAllProvinces);
router.get('/cities', shippingController.getAllCities);
router.get('/couriers', shippingController.getAllCouriers);

module.exports = router;
