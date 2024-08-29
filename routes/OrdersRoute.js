const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/OrdersController');

// Get all orders
router.get('/orders', OrderController.getOrders);

module.exports = router;