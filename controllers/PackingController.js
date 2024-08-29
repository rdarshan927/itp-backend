const mongoose = require('mongoose');
const PackingModel = require('../models/PackingModel');


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
    const { orderId, receivername, receiveraddress, receivercontact, senderemail,packingdate } = req.body;


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
            packingdate
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

        const updatedpacking = await packingModel.findByIdAndUpdate(id, req.body, { new: true });

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
module.exports = {
    getpacking,
    createpacking,
    editpacking,
    removepacking,
}
