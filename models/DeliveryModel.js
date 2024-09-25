const mongoose = require('mongoose');

const DeliverySchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: true,
        unique: true
    },
    senderEmail: {
        type: String,
        required: true
    },
    receivername: {
        type: String,
        required: true
    },
    receiveraddress: {
        type: String,
        required: true
    },
    receivercontact: {
        type: Number,
        required: true
    },
    delivererName: {
        type: String,
        required: true
    },
    currentStatus: {
        type: String,
        required: true
    },
    deliveryDate: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Delivery', DeliverySchema);
