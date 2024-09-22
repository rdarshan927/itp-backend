const {
  createResourceItem,
  getResourceItems,
  getSingleResourceItem,
  updateResourceItem,
  deleteResourceItem,
  createSalesInventoryItem,
  getSalesInventoryItems,
  getSingleSalesInventoryItem,
  updateSalesInventoryItem,
  deleteSalesInventoryItem,
} = require("../controllers/InventoryManagementController");
const express = require("express");

const route = express.Router();

// Resource Inventory Routes
route.post("/inventory/addresourceitem", createResourceItem);
route.get("/inventory/getresourceitems", getResourceItems);
route.get("/inventory/get/idresourceitem/:id", getSingleResourceItem);
route.patch("/inventory/updateresourceitem/:id", updateResourceItem);
route.delete("/inventory/deleteresourceitem/:id", deleteResourceItem);

// Sales Inventory Routes
route.post("/inventory/addsalesitem", createSalesInventoryItem);
route.get("/inventory/getsalesitems", getSalesInventoryItems);
route.get("/inventory/get/idsalesitem/:id", getSingleSalesInventoryItem);
route.patch("/inventory/updatesalesitem/:id", updateSalesInventoryItem);
route.delete("/inventory/deletesalesitem/:id", deleteSalesInventoryItem);

module.exports = route;
