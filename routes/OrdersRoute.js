const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/OrdersController');

// Fetch all orders
router.get('/orders', OrderController.getOrders);

// Fetch and generate PDF
router.get('/orders/download-pdf', OrderController.getOrdersPDF);

module.exports = router;
