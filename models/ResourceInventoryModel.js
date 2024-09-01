const mongoose = require("mongoose");

const ResourceInventoryModel = new mongoose.Schema({
  productID: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("ResourceInventory", ResourceInventoryModel);
