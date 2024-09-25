const mongoose = require('mongoose');
const PackingModel = require('../models/PackingModel');
const PDFDocument = require('pdfkit');
//const fs = require('fs');
const QRCode = require('qrcode');  // Import the QRCode library





//data display
const getpacking = async (req, res) => {
   

    try {
        const packing = await PackingModel.find();
        res.status(200).json(packing);
        
    } catch (error) {
        console.error("Error retrieving packing:", error);
        res.status(500).json({ message: 'Failed to retrieve packing!', error: error.message });
    }


}

//data Insert
const createpacking = async (req, res) => {
try {
    console.log('aawaaaa')
    const { orderId, receivername, receiveraddress, receivercontact, senderemail,packingdate, currentstatus } = req.body;


    // Check if orderId or email already exists (case insensitive)
      const alreadyExist = await PackingModel.findOne({ 
        $or: [{ orderId: new RegExp(`^${orderId}$`, 'i') }, { senderemail: new RegExp(`^${senderemail}$`, 'i') }] 
    });
    console.log('aawaaaa')
    if (alreadyExist) {
        return res.status(400).json({ message: 'Order ID or Email already exists!' });
    }
    console.log('aawaaaa')
    const  newpacking = new PackingModel({
            orderId,
            receivername,
            receiveraddress,
            receivercontact,
            senderemail,
            packingdate,
            currentstatus
        });
        console.log('aawaaaa')
        await newpacking.save();

        res.status(201).json({ message: 'Order  has been successfully added!' });
        console.log('aawaaaa')

    } catch (error) {
        console.error("Error adding order:", error);
        res.status(500).json({ message: 'Failed to add package!', error: error.message });
    }

    
    
}

//data update

const editpacking = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ message: 'Invalid order ID!' });
        }

        const updatedpacking = await PackingModel.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedpacking) {
            return res.status(404).json({ message: 'Package not found!' });
        }

        res.status(200).json({ message: 'Order successfully updated!', updatedpacking });

    } catch (error) {
        console.error("Error updating package:", error);
        res.status(500).json({ message: 'Failed to update the order!', error: error.message });
    }
}

//data delete
const removepacking = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ message: 'Invalid order ID!' });
        }

        const deletedpacking = await PackingModel.findByIdAndDelete(id);

        if (!deletedpacking) {
            return res.status(404).json({ message: 'Package not found!' });
        }

        res.status(200).json({ message: 'package successfully deleted!' });

    } catch (error) {
        console.error("Error deleting package:", error);
        res.status(500).json({ message: 'Failed to delete the package!', error: error.message });
    }
}
const generateQRCodePDF = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the packing data by ID
        const packingData = await PackingModel.findById(id);
        if (!packingData) {
            return res.status(404).json({ message: 'Packing not found!' });
        }

        // Data to encode into the QR code
        const dataToEncode = `
        Order ID: ${packingData.orderId}
        Receiver Name: ${packingData.receivername}
        Receiver Address: ${packingData.receiveraddress}
        Receiver Contact: ${packingData.receivercontact}
        Sender Email: ${packingData.senderemail}
        Packing Date: ${packingData.packingdate}
        Current Status: ${packingData.currentstatus}
        `;

        // Generate the QR code as a Data URL
        const qrCodeUrl = await QRCode.toDataURL(dataToEncode);

        // Create a new PDF document
        const doc = new PDFDocument();

        // Set the headers to indicate a file download (PDF)
        res.setHeader('Content-Disposition', 'attachment; filename=packing-qrcode.pdf');
        res.setHeader('Content-Type', 'application/pdf');

        // Pipe the PDF to the response
        doc.pipe(res);

        // Add content to the PDF
        doc.fontSize(18).text(`Packing QR Code for Order ID: ${packingData.orderId}`, { align: 'center' });
        doc.image(qrCodeUrl, {
            fit: [200, 200],
            align: 'center',
            valign: 'center'
        });

        // Finalize the PDF document
        doc.end();
    } catch (error) {
        console.error("Error generating QR code as PDF:", error);
        res.status(500).json({ message: 'Failed to generate QR code PDF!', error: error.message });
    }
};

module.exports = {
    getpacking,
    createpacking,
    editpacking,
    removepacking,
    generateQRCodePDF  // Export the QR code PDF generation function
};