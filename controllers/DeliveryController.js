const Delivery = require('../models/DeliveryModel');
const Packing = require('../models/PackingModel');

// Add Delivery
const AddDelivery = async (req, res) => {
    try {
        const { orderId, senderEmail, receivername, receiveraddress, receivercontact, delivererName, currentStatus, deliveryDate } = req.body;

        // Check if the order ID already exists
        const alreadyExist = await Delivery.findOne({ orderId: new RegExp(`^${orderId}$`, 'i') });

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

module.exports = {
    AddDelivery,
    getAllDeliveries,
    getDeliveryByOrderId,
    updateDelivery,
    deleteDelivery
};
