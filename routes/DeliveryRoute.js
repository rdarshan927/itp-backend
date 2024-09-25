const express = require('express');
const router = express.Router();
const DeliveryController = require('../controllers/DeliveryController');

// Route to get packing details by orderId
router.get('/packings/:orderId', DeliveryController.getDeliveryByOrderId);

// Route to update the deliverer's name
router.put('/deliveries/:orderId', DeliveryController.updateDelivererName);

module.exports = router;



