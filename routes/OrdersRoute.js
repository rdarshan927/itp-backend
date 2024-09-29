const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/OrdersController');

// Fetch all orders
router.get('/orders', OrderController.getOrders);




module.exports = router;
