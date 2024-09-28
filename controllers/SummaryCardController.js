const InventoryStuff = require('../models/InventoryStuff'); // Adjust path as needed
const Invoice = require('../models/InvoiceModel'); // Assuming your sales data is stored in the Invoice model

// Controller to get all inventory data and calculate total cost and total sales
const getSummaryCardData = async (req, res) => {
    try {
        // Step 1: Retrieve all inventory items
        const inventoryItems = await InventoryStuff.find();

        // Initialize total cost and total sales variables
        let totalCost = 0;
        let totalSales = 0;

        // Step 2: Calculate total cost for each inventory item and accumulate the total cost
        const updatedInventoryItems = inventoryItems.map(item => {
            const totalPrice = item.price * item.amount; // Calculate total cost per item
            totalCost += totalPrice; // Accumulate the total cost

            return {
                ...item._doc, // Keep original fields
                totalPrice // Add the totalPrice field for each item
            };
        });

        // Step 3: Retrieve all sales (from Invoice model) and calculate total sales
        const salesData = await Invoice.aggregate([
            { 
                $group: {
                    _id: null, // No specific grouping, just calculate the total
                    totalSales: { $sum: "$amountPaid" } // Sum up the amountPaid field
                }
            }
        ]);

        // If there are no sales, default totalSales will be 0
        totalSales = salesData.length > 0 ? salesData[0].totalSales : 0;

        // Step 4: Return the calculated total cost, total sales, and the inventory items with total cost per item
        res.status(200).json({
            success: true, // Return inventory items with totalPrice
            totalCost, // Return total cost of inventory
            totalSales, // Return total sales
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Error retrieving summary card data',
            error: err.message,
        });
    }
};

module.exports = {
    getSummaryCardData
};
