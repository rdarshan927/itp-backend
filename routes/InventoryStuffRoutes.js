const express = require('express');
const InventoryStuffController = require('../controllers/InventoryStuffController');

const router = express.Router();

// Create inventory stuff
router.post("/inventorystuff/create", InventoryStuffController.createStuff);

// Fetch all inventory stuffs
router.get("/inventorystuff/getall", InventoryStuffController.fetchInventoryStuffs);

// Fetch a single inventory stuff by ID
router.get("/inventorystuff/get/:id", InventoryStuffController.fetchInventoryStuff);

// Update an inventory stuff by ID
router.put("/inventorystuff/update/:id", InventoryStuffController.updateInventoryStuff);

// Delete an inventory stuff by ID
router.delete("/inventorystuff/delete/:id", InventoryStuffController.deleteInventoryStuff);

module.exports = router;
