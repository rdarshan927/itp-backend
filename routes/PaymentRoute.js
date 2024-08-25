const express = require('express');
const route = express.Router();
const { handlePayment, stripepay, handlePaymentSuccess } = require('../controllers/PaymentController');

route.post('/paid', handlePayment);
route.post('/webhook', express.raw({ type: 'application/json' }), stripepay);
route.post('/paymentsuccess', handlePaymentSuccess);

module.exports = route