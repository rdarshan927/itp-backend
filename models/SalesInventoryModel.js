const mongoose = require("mongoose");

const SalesInventoryModel = new mongoose.Schema({
  productID: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  imageData: {
    type: String, // Base64-encoded image data
    required: true,
  },
});

module.exports = mongoose.model("SalesInventory", SalesInventoryModel);
