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

// Fetch and generate PDF
exports.getOrdersPDF = async (req, res) => {
    try {
        const orders = await Orders.find();

        // Set response headers for PDF download
        res.setHeader('Content-Disposition', 'attachment; filename=orders.pdf');
        res.setHeader('Content-Type', 'application/pdf');

        const doc = new PDFDocument();
        doc.pipe(res);

        doc.fontSize(20).text('Orders Report', { align: 'center' });
        doc.moveDown(2);

        // Define column widths and X positions
        const columnWidths = [90, 150, 250, 100, 150];
        const xPositions = [50, 140, 290, 390, 490]; // Adjusted X positions to fit the widths

        // Function to draw table header
     function drawTableHeader() {
    doc.fontSize(12).font('Helvetica-Bold');

    // Table headers
    doc.text('Order ID', xPositions[0], doc.y, { width: columnWidths[0], align: 'left' });
    doc.text('Receiver Name', xPositions[1], doc.y, { width: columnWidths[1], align: 'left' });
    doc.text('Receiver Address', xPositions[2], doc.y, { width: columnWidths[2], align: 'left' });
    doc.text('Receiver Contact', xPositions[3], doc.y, { width: columnWidths[3], align: 'left' });
    doc.text('User Email', xPositions[4], doc.y, { width: columnWidths[4], align: 'left' });

    // Draw header line
    doc.moveTo(xPositions[0], doc.y + 15) // Adjusted y position for the line
       .lineTo(xPositions[0] + columnWidths.reduce((a, b) => a + b, 0), doc.y + 15) // End line position
       .stroke();

    doc.moveDown(1); // Move down after header line
  }

        // Function to draw a table row
        function drawTableRow(order) {
            doc.fontSize(10).font('Helvetica');

            // Table rows
            doc.text(order.orderID, xPositions[0], doc.y, { width: columnWidths[0], align: 'left' });
            doc.text(order.receiverName, xPositions[1], doc.y, { width: columnWidths[1], align: 'left' });
            doc.text(order.receiverAddress, xPositions[2], doc.y, { width: columnWidths[2], align: 'left' });
            doc.text(order.receiverContact, xPositions[3], doc.y, { width: columnWidths[3], align: 'left' });
            doc.text(order.userEmail, xPositions[4], doc.y, { width: columnWidths[4], align: 'left' });
            
            doc.moveDown();
        }

        // Draw table header
        drawTableHeader();

        // Draw table rows
        orders.forEach(order => {
            drawTableRow(order);
        });

        doc.end();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
