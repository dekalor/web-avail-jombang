// server/routes/productRoutes.js
const express = require('express');
const router  = express.Router();
const productController = require('../controllers/productController');

router.get('/',    productController.index);
router.get('/featured', productController.featured);
router.get('/categories', productController.getCategories);

router.get('/:id', productController.show);

module.exports = router;
