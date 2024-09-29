const express = require('express');
const router = express.Router();
const { getSummaryCardData } = require('../controllers/SummaryCardController'); // Use the combined controller

// Route to get the summary of inventory items and sales (total cost + total sales)
router.get('/summary', getSummaryCardData);

module.exports = router;
