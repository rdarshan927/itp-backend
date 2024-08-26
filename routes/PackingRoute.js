
const express = require('express');
const router = express.Router();
const Packing = require("../models/PackingModel"); 
const PackingController = require('../controllers/PackingController');

router.get("/get", PackingController.getAllpacking);
router.post("/ádd", PackingController.addpacking);

module.exports = router; 