const ResourceInventoryModel = require("../models/ResourceInventoryModel");
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
    const resourceId = req.params.id;
    if (!resourceId) {
      return res.status(400).json({ message: "Resource ID is required" });
    }

    const { quantity } = req.body;

    if (
      quantity !== undefined &&
      (typeof quantity !== "number" || quantity <= 0)
    ) {
      return res
        .status(400)
        .json({ message: "Quantity must be a positive number" });
    }

    const found = await ResourceInventoryModel.findById(resourceId);

    if (!found) {
      return res.status(404).json({ message: "Resource not found" });
    }

    // Update fields
    if (quantity !== undefined) {
      found.quantity = quantity;
    }

    // Add other fields if necessary, e.g., name, category

    await found.save();
    res.status(200).json(found);
  } catch (error) {
    res.status(500).json({ message: "Error updating resource" });
    console.log(error);
  }
};

// Delete a resource
const deleteResourceItem = async (req, res) => {
  try {
    const resourceId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(resourceId)) {
      return res.status(404).json({ error: "The ID provided isn't valid!" });
    }

    if (!resourceId) {
      return res.status(400).json({ message: "Resource ID is required!" });
    }

    const existResource = await ResourceInventoryModel.findByIdAndDelete(
      resourceId
    );

    if (!existResource) {
      return res.status(404).json({ message: "Resource not found!" });
    }

    res.status(200).json(existResource);
  } catch (error) {
    res
      .status(500)
      .json({ message: "There was an error while deleting the resource!" });
    console.log(error);
  }
};

module.exports = {
  createResourceItem,
  getResourceItems,
  getSingleResourceItem,
  updateResourceItem,
  deleteResourceItem,
};
