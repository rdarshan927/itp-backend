const InventoryStuff = require('../models/InventoryStuff'); // Adjust the path to your model

// Controller to get bar chart data (stuffName and totalPrice)
const getBarChartData = async (req, res) => {
    try {
        // Retrieve all inventory items
        const items = await InventoryStuff.find();

        // Prepare bar chart data
        const labels = [];
        const data = [];

        items.forEach(item => {
            labels.push(item.stuffName); // Add the stuff name as the label
            const totalPrice = item.price * item.amount; // Calculate total price
            data.push(totalPrice); // Add the total price to the data array
        });

        // Send the formatted data for the bar chart
        res.status(200).json({
            success: true,
            data: {
                labels, // The x-axis (stuff names)
                datasets: [{
                    label: 'Total Price',
                    data, // The y-axis (total price values)
                    backgroundColor: 'rgba(75, 192, 192, 0.6)', // Bar color (optional)
                    borderColor: 'rgba(75, 192, 192, 1)', // Bar border (optional)
                    borderWidth: 1
                }]
            }
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Error retrieving bar chart data',
            error: err.message,
        });
    }
};

module.exports = {
    getBarChartData
};
