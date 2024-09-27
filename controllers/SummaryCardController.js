const InventoryStuff = require('./models/inventoryStuff'); // Adjust path as needed

// Controller to get all inventory data and calculate total cost
const getAllInventoryItems = async (req, res) => {
    try {
        // Retrieve all inventory items
        const items = await InventoryStuff.find();

        // Calculate total cost for each item
        const updatedItems = items.map(item => {
            const totalPrice = item.price * item.amount; // Total cost calculation
            return {
                ...item._doc, // Destructure the document to keep original fields
                totalPrice // Add the totalPrice field
            };
        });

        // Send the updated items with calculated totalPrice
        res.status(200).json({
            success: true,
            data: updatedItems,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Error retrieving inventory items',
            error: err.message,
        });
    }
};

module.exports = {
    getAllInventoryItems
};
