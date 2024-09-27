const express = require('express');
const router = express.Router();
const { getBarChartData } = require('../controllers/BarChartController');

// Route to get bar chart data
router.get('/barchart', getBarChartData);

module.exports = router;
