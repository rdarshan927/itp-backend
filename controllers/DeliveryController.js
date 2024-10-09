const PDFDocument = require('pdfkit'); // Declare PDFDocument once
const fs = require('fs');
const path = require('path');
const { sendEmail } = require('./MailController');

const Delivery = require('../models/DeliveryModel');
const Packing = require('../models/PackingModel');

// Add Delivery
const AddDelivery = async (req, res) => {
    try {
        const { orderId, senderEmail, receivername, receiveraddress, receivercontact, delivererName, currentStatus, deliveryDate } = req.body;
        console.log(req.body);
        // You can choose to keep the order ID check if you want unique orders but allow same emails
        const alreadyExist = await Delivery.findOne({ orderId: new RegExp(`^${orderId}$`, 'i') });
        console.log(alreadyExist);


        if (alreadyExist) {
            return res.status(400).json({ message: 'Order ID already exists!' });
        }

        const delivery = new Delivery({ 
            orderId, 
            senderEmail, 
            receivername,
            receiveraddress,
            receivercontact,
            delivererName,
            currentStatus, 
            deliveryDate
        });

        await delivery.save();
        res.status(201).json({ message: 'Delivery added successfully!' });
    } catch (error) {
        console.error("Error adding delivery:", error);  // More detailed error log
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get All Deliveries
const getAllDeliveries = async (req, res) => {
    try {
        const deliveries = await Delivery.find({});
        res.json(deliveries);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get delivery by orderId
const getDeliveryByOrderId = async (req, res) => {
    try {
        const packing = await Packing.findOne({ orderId: req.params.orderId });
        if (!packing) {
            return res.status(404).json({ message: 'Packing not found' });
        }
        res.json({
            orderId: packing.orderId,
            receiverContactNo: packing.receivercontact,
            receiverName: packing.receivername,
            senderEmail: packing.senderemail,
            receiverAddress: packing.receiveraddress,
            currentStatus: packing.currentstatus
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Update delivery status and date
const updateDelivery = async (req, res) => {
    try {
        const { currentStatus, deliveryDate } = req.body;
        const delivery = await Delivery.findByIdAndUpdate(req.params.id, { currentStatus, deliveryDate }, { new: true });
        if (!delivery) {
            return res.status(404).json({ message: 'Delivery not found' });
        }
        res.json(delivery);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Delete delivery
const deleteDelivery = async (req, res) => {
    try {
        const delivery = await Delivery.findByIdAndDelete(req.params.id);
        if (!delivery) {
            return res.status(404).json({ message: 'Delivery not found' });
        }
        res.json({ message: 'Delivery deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};


// Download receipt
// Download receipt
const downloadReceipt = async (req, res) => {
    try {
        const delivery = await Delivery.findById(req.params.id);
        if (!delivery) {
            return res.status(404).json({ message: 'Delivery not found' });
        }

        // Create a PDF document
        const doc = new PDFDocument({ margin: 50 });
        const filePath = path.join(__dirname, '../receipts', `${delivery.orderId}.pdf`); // Use order ID as PDF name

        // Check if the 'receipts' directory exists, if not, create it
        if (!fs.existsSync(path.join(__dirname, '../receipts'))) {
            fs.mkdirSync(path.join(__dirname, '../receipts'), { recursive: true });
        }

        // Pipe the PDF to a writable stream
        const stream = fs.createWriteStream(filePath);
        doc.pipe(stream);

        // Header
        doc.fillColor('green'); // Set the text color to green
        doc.fontSize(25).text('Sephora Flowers', { align: 'center' }).moveDown(1);
        doc.lineWidth(1).moveTo(50, 90).lineTo(550, 90).stroke().moveDown(1);

        // Reset color to default for subsequent text
        doc.fillColor('black'); // Set back to default color

        // Order Information
        doc.fontSize(14);
        const columnWidth = 300; // Define column width

        // Create a table header
        const data = [
            { label: 'Order ID:', value: delivery.orderId },
            { label: 'Receiver Name:', value: delivery.receivername },
            { label: 'Receiver Address:', value: delivery.receiveraddress },
            { label: 'Receiver Contact:', value: delivery.receivercontact },
            { label: 'Deliverer Name:', value: delivery.delivererName },
            { label: 'Delivery Date:', value: new Date(delivery.deliveryDate).toLocaleDateString() },
            { label: 'Current Status:', value: delivery.currentStatus }
        ];

        // Loop through the data and print it
        data.forEach(item => {
            // Print label and value in one line with minimized gap
            doc.text(item.label, { continued: true, align: 'left' });
            doc.text(' ', { continued: true }); // Optional: Add a small space between label and value
            doc.text(item.value, { align: 'right', width: columnWidth });
            doc.moveDown(0.3); // Adjust spacing between rows (0.3 can be changed to fit your needs)
        });

        // Footer
        doc.moveDown(2);
        doc.lineWidth(1).moveTo(50, doc.y).lineTo(550, doc.y).stroke();
        doc.moveDown(1);
        doc.fontSize(13).text('Thank you for using our delivery service!', { align: 'center' });

        // Add current date in the bottom right corner with minimized font size
        doc.fontSize(10); // Set font size to 10 for the generated date
        const currentDate = new Date().toLocaleDateString();
        doc.text(`Generated on: ${currentDate}`, { align: 'right', baseline: 'bottom' });

        // Finalize the PDF and end the stream
        doc.end();

        // Once the PDF is finished, send it to the client
        stream.on('finish', () => {
            res.download(filePath, `${delivery.orderId}.pdf`, (err) => { // Ensure the download uses the order ID as the name
                if (err) {
                    console.error('Error downloading the PDF:', err);
                }
                // Optionally, you can delete the file after sending
                fs.unlinkSync(filePath);
            });
        });

    } catch (error) {
        console.error('Error generating receipt:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const sendEmailToSender = async (req, res) => {
    try {
        const delivery = await Delivery.findById(req.params.id);
        if (!delivery) {
            return res.status(404).json({ message: 'Delivery not found' });
        }

        // Send email
        await sendEmail(delivery.senderEmail, delivery.orderId,delivery.currentStatus);
        res.status(200).json({ message: 'Email sent successfully!' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};



module.exports = {
    AddDelivery,
    getAllDeliveries,
    getDeliveryByOrderId,
    updateDelivery,
    deleteDelivery,
    downloadReceipt,
    sendEmailToSender,
};
