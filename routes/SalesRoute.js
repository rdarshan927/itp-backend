const express = require('express');
const route = express.Router();
const { getInvoice, deleteInvoice } = require('../controllers/SalesController')

route.get('/sales/invoice/get', getInvoice);
route.delete('/sales/invoice/delete/:id', deleteInvoice);

module.exports = route;