const mongoose = require("mongoose");

const InventoryRecordsModel = new mongoose.Schema({
  productID: {
    type: String,
    required: true,
  },
  dateTime: {
    type: Date,
    default: Date.now,
  },
  action: {
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
  category: {
    type: String,
  },
  price: {
    type: Number,
    required: false,
    default: 0,
  },
});

module.exports = mongoose.model("InventoryRecordsModel", InventoryRecordsModel);
