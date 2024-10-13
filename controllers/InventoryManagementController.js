const InventoryRecordsModel = require("../models/InventoryRecordsModel");
const ResourceInventoryModel = require("../models/ResourceInventoryModel");
const SalesInventoryModel = require("../models/SalesInventoryModel");
const mongoose = require("mongoose");

// Create a new resource
const createResourceItem = async (req, res) => {
  try {
    const { productID, name, category, quantity } = req.body;
    const alreadyExist = await ResourceInventoryModel.findOne({ productID });

    if (alreadyExist) {
      return res
        .status(400)
        .json({ message: "Product has already been added to the inventory!" });
    }

    const newResource = new ResourceInventoryModel({
      productID,
      name,
      category,
      quantity,
    });

    await newResource.save();
    return res
      .status(201)
      .json({ message: "Product has been added successfully." });
  } catch (error) {
    res.status(500).json({ message: "Failed to add the product." });
    console.log(error);
  }
};

// Get all resources
const getResourceItems = async (req, res) => {
  try {
    const resources = await ResourceInventoryModel.find();
    res.status(200).json(resources);
  } catch (error) {
    res
      .status(500)
      .json({ message: "There was an error while retrieving the resources!" });
    console.log(error);
  }
};

// Get a single resource by ID
const getSingleResourceItem = async (req, res) => {
  try {
    const resource = await ResourceInventoryModel.findById(req.params.id);

    if (!resource) {
      return res
        .status(404)
        .json({ message: "No resource matches the provided ID!" });
    }
    res.status(200).json(resource);
  } catch (error) {
    res.status(500).json({ message: "There was an internal error!" });
    console.log(error);
  }
};

// Update a resource
const updateResourceItem = async (req, res) => {
  try {
    const productID = req.params.id;

    if (!productID) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const { name, category, quantity } = req.body;

    // Validate quantity
    if (
      quantity !== undefined &&
      (typeof quantity !== "number" || quantity <= 0)
    ) {
      return res
        .status(400)
        .json({ message: "Quantity must be a positive number" });
    }

    // Validate name and category
    if (name !== undefined && typeof name !== "string") {
      return res.status(400).json({ message: "Name must be a string" });
    }

    if (category !== undefined && typeof category !== "string") {
      return res.status(400).json({ message: "Category must be a string" });
    }

    // Find the resource item by productID
    const found = await ResourceInventoryModel.findOne({ productID });

    if (!found) {
      return res.status(404).json({ message: "Resource not found" });
    }

    // Update fields
    if (name !== undefined) {
      found.name = name;
    }
    if (category !== undefined) {
      found.category = category;
    }
    if (quantity !== undefined) {
      found.quantity = quantity;
    }

    // Save the updated resource item
    await found.save();
    res.status(200).json(found);
  } catch (error) {
    res.status(500).json({ message: "Error updating resource" });
    console.log(error);
  }
};

module.exports = updateResourceItem;

// Delete a resource
const deleteResourceItem = async (req, res) => {
  try {
    const productID = req.params.id;

    // Check if productID is provided
    if (!productID) {
      return res.status(400).json({ message: "Product ID is required!" });
    }

    // Validate the productID format if necessary (optional, depending on your use case)
    // For example, check if it's a string and matches expected pattern

    // Find and delete the resource item by productID
    const result = await ResourceInventoryModel.findOneAndDelete({ productID });

    // Check if a document was found and deleted
    if (!result) {
      return res.status(404).json({ message: "Resource not found!" });
    }

    res.status(200).json({
      message: "Resource deleted successfully!",
      deletedResource: result,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "There was an error while deleting the resource!" });
    console.log(error);
  }
};

//sales inventory
const createSalesInventoryItem = async (req, res) => {
  try {
    const { productID, name, category, quantity, price, imageData } = req.body;
    const alreadyExist = await SalesInventoryModel.findOne({ productID });

    if (alreadyExist) {
      return res
        .status(400)
        .json({ message: "Product has already been added to the inventory!" });
    }

    const newInventoryItem = new SalesInventoryModel({
      productID,
      name,
      category,
      quantity,
      price,
      imageData,
    });

    await newInventoryItem.save();
    return res
      .status(201)
      .json({ message: "Product has been added successfully." });
  } catch (error) {
    res.status(500).json({ message: "Failed to add the product." });
    console.log(error);
  }
};

// Get all sales inventory items
const getSalesInventoryItems = async (req, res) => {
  try {
    const inventoryItems = await SalesInventoryModel.find();
    res.status(200).json(inventoryItems);
  } catch (error) {
    res.status(500).json({
      message: "There was an error while retrieving the inventory items!",
    });
    console.log(error);
  }
};

// Get a single sales inventory item by ID
const getSingleSalesInventoryItem = async (req, res) => {
  try {
    const inventoryItem = await SalesInventoryModel.findOne(req.params.id);

    if (!inventoryItem) {
      return res
        .status(404)
        .json({ message: "No inventory item matches the provided ID!" });
    }
    res.status(200).json(inventoryItem);
  } catch (error) {
    res.status(500).json({ message: "There was an internal error!" });
    console.log(error);
  }
};

// Update a sales inventory item
const updateSalesInventoryItem = async (req, res) => {
  try {
    const { name, category, quantity, price, imageData } = req.body;
    const productID = req.params.id;

    if (!productID) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const inventoryItem = await SalesInventoryModel.findOne({ productID });

    if (!inventoryItem) {
      return res.status(404).json({ message: "Inventory item not found" });
    }

    // Updating fields if provided
    if (name) inventoryItem.name = name;
    if (category) inventoryItem.category = category;
    if (quantity) inventoryItem.quantity = quantity;
    if (price) inventoryItem.price = price;
    if (imageData) inventoryItem.imageData = imageData;

    await inventoryItem.save();
    res.status(200).json(inventoryItem);
  } catch (error) {
    res.status(500).json({ message: "Error updating inventory item" });
    console.log(error);
  }
};

// Delete a sales inventory item
const deleteSalesInventoryItem = async (req, res) => {
  try {
    const productID = req.params.id;

    if (!productID) {
      return res.status(400).json({ message: "Product ID is required!" });
    }

    const deletedInventoryItem = await SalesInventoryModel.findOneAndDelete({
      productID,
    });

    if (!deletedInventoryItem) {
      return res.status(404).json({ message: "Inventory item not found!" });
    }

    res.status(200).json({
      message: "Inventory item deleted successfully!",
      deletedInventoryItem: deletedInventoryItem,
    });
  } catch (error) {
    res.status(500).json({
      message: "There was an error while deleting the inventory item!",
    });
    console.log(error);
  }
};

// Get all Inventory Records
const getAllInventoryRecords = async (req, res) => {
  const type = req.params.type;
  try {
    const inventoryRecords = await InventoryRecordsModel.find();
    console.log(inventoryRecords);
    let filteredRecords;
    if (type === "sales") {
      filteredRecords = inventoryRecords.filter(
        (record) =>
          record.category === "flower" || record.category === "bouquet"
      );
    } else if (type === "resource") {
      filteredRecords = inventoryRecords.filter(
        (record) =>
          record.category !== "flower" && record.category !== "bouquet"
      );
    }
    res.status(200).json(filteredRecords);
  } catch (error) {
    res.status(500).json({
      message: "There was an error while retrieving the inventory records!",
    });
    console.log(error);
  }
};

// Create an Inventory Record
const createInventoryRecord = async (req, res) => {
  try {
    const { productID, name, category, action, quantity, price } = req.body;

    const newInventoryRecord = new InventoryRecordsModel({
      productID,
      name,
      action,
      quantity,
      category,
      price,
    });

    await newInventoryRecord.save();
    return res
      .status(201)
      .json({ message: "Record has been added successfully." });
  } catch (error) {
    res.status(500).json({ message: "Failed to add the Record." });
    console.log(error);
  }
};

module.exports = {
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
  getAllInventoryRecords,
  createInventoryRecord,
};
