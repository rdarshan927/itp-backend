const express = require('express');
const route = express.Router();
const { getInvoice, updateInvoice, deleteInvoice, getMonthlyTotals, getSalesComparison } = require('../controllers/SalesController')

route.get('/sales/invoice/get', getInvoice);
route.patch('/sales/invoice/update/:id', updateInvoice);
route.delete('/sales/invoice/delete/:id', deleteInvoice);
route.get('/sales/monthly', getMonthlyTotals);
route.get('/sales/yearly', getSalesComparison);

module.exports = route;