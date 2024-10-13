const express = require('express');
const router = express.Router();
const DeliveryController = require('../controllers/DeliveryController');

// Route to get all deliveries
router.get('/deliveries/get', DeliveryController.getAllDeliveries);

// Route to get delivery by orderId
router.get('/deliveries/:orderId', DeliveryController.getDeliveryByOrderId);

// Route to create a new delivery
router.post("/deliveries/add", DeliveryController.AddDelivery);

// Route to update delivery status and date
router.put('/deliveries/:id', DeliveryController.updateDelivery);

// Route to delete a delivery by ID
router.delete('/deliveries/:id', DeliveryController.deleteDelivery);

// Route to download delivery receipt
router.get('/deliveries/:id/receipt', DeliveryController.downloadReceipt);

// Add this line in your delivery routes
router.post('/deliveries/:id/send-email', DeliveryController.sendEmailToSender);


module.exports = router;
