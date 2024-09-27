const express = require('express');
const router = express.Router();
const { getAllInventoryItems } = require('../controllers/SummaryCardController');

// Route to get all inventory items and calculate the total cost
router.get('/inventory', getAllInventoryItems);

module.exports = router;
