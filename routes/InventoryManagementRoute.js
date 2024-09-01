const {
  createResourceItem,
  getResourceItems,
  getSingleResourceItem,
  updateResourceItem,
  deleteResourceItem,
} = require("../controllers/InventoryManagementController");
const express = require("express");

const route = express.Router();

route.post("/inventory/addresourceitem", createResourceItem);
route.get("/inventory/getresourceitems", getResourceItems);
route.get("/inventory/get/idresourceitem/:id", getSingleResourceItem);
route.patch("/inventory/updateresourceitem/:id", updateResourceItem);
route.delete("/inventory/deleteresourceitem/:id", deleteResourceItem);

module.exports = route;
