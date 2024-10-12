const express = require('express');
const route = express.Router();
const { getInvoice, getSingleInvoice, updateInvoice, deleteInvoice, getMonthlyTotals, getSalesComparison, getCustomerStats } = require('../controllers/SalesController')

route.get('/sales/invoice/get', getInvoice);
route.get('/sales/invoice/gets/:id', getSingleInvoice);
route.patch('/sales/invoice/update/:id', updateInvoice);
route.delete('/sales/invoice/delete/:id', deleteInvoice);
route.get('/sales/monthly', getMonthlyTotals);
route.get('/sales/yearly', getSalesComparison);
route.get('/sales/customerarrival', getCustomerStats);

module.exports = route;