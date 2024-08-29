
const express = require('express');
const router = express.Router();

const PackingController = require('../controllers/PackingController');

// Packing routes
router.get("/packing/get", PackingController.getpacking);//read
router.post("/packing/add", PackingController.createpacking);//create
router.put('packing/update/:id', PackingController.editpacking); // Update
router.delete('packing/delete/:id', PackingController.removepacking); // Delete


module.exports = router; 