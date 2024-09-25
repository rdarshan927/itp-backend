const Delivery = require('../models/DeliveryModel');
const Packing = require('../models/PackingModel'); // Add this import

// Get delivery details by orderId from Packing model
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

// Update deliverer's name in Delivery model
const updateDelivererName = async (req, res) => {
    try {
        const { delivererName } = req.body;
        const delivery = await Delivery.findOneAndUpdate(
            { orderId: req.params.orderId },
            { senderEmail: req.params.senderEmail },
            { delivererName },
            {deliveryDate},
            { new: true }
        );
        if (!delivery) {
            return res.status(404).json({ message: 'Delivery not found' });
        }
        res.json(delivery);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

module.exports = {
    getDeliveryByOrderId,
    updateDelivererName,
     
};