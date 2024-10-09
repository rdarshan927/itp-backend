const express = require('express');
const router = express.Router();
const { getCropEstimatesHandler, getAnnualCropCountHandler } = require('../controllers/HarvestCalculationController');

// Route to get crop estimates data (change to POST if that's the intended method)
router.post('/harvestchart', getCropEstimatesHandler); 
router.get('/harvestannual', getCropEstimatesHandler); 

module.exports = router;
