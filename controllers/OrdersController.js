const PDFDocument = require('pdfkit');
const Orders = require('../models/OrdersModel');

// Fetch all orders
exports.getOrders = async (req, res) => {
    try {
        const orders = await Orders.find(); // Fetch from MongoDB
        console.log('Fetched Orders:', orders); 
        res.json(orders); // Send back as JSON
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: error.message });
    }
};

