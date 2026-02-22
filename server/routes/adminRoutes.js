// server/routes/adminRoutes.js
const express        = require('express');
const router         = express.Router();
const adminCtrl      = require('../controllers/adminController');
const { login, logout, getSession, requireAdmin } = require('../middleware/adminAuth');

// Auth (public)
router.post('/login',  login);
router.post('/logout', logout);
router.get('/session', getSession);

// All routes below require authenticated admin session
router.use(requireAdmin);

// Dashboard
router.get('/dashboard', adminCtrl.getDashboard);

// Orders
router.get('/orders',          adminCtrl.getOrders);
router.get('/orders/:id',      adminCtrl.getOrder);
router.patch('/orders/:id',    adminCtrl.updateOrderStatus);

// Products
router.get('/products',        adminCtrl.getProducts);
router.post('/products',       adminCtrl.createProduct);
router.put('/products/:id',    adminCtrl.updateProduct);
router.delete('/products/:id', adminCtrl.deleteProduct);

// Product Categories
router.get('/product-categories',          adminCtrl.getProductCategories);
router.post('/product-categories', adminCtrl.createProductCategory);
router.put('/product-categories/:id',      adminCtrl.updateProductCategory);
router.delete('/product-categories/:id',   adminCtrl.deleteProductCategory);

module.exports = router;
