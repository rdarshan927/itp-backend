
const express = require('express');
const router = express.Router();

const PackingController = require('../controllers/PackingController');

// Packing routes
router.get("/packing/get", PackingController.getpacking);//read
router.get('/packing/get/single/:id', PackingController.getPackingById)
router.post("/packing/add", PackingController.createpacking);//create
router.put('/packing/update/:id', PackingController.editpacking); // Update
router.delete('/packing/delete/:id', PackingController.removepacking); // Delete
router.get('/packing/qrcode/:id', PackingController.generateQRCodePDF);




module.exports = router; 