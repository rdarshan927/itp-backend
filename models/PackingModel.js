
const mongoose = require('mongoose');
const Schema = mongoose.Schema;4

const PackingSchema = new Schema({
    orderId: {
        type: String,//datatype
        required: true//validate
    },
    receiverName: {
        type: Number,
        required: true
    },
    receiverAddress: {
        type: String,
        required: true
    },
    receiverContactNo: {
        type: Number,
        required: true
    },
    senderEmail: {
        type: String,
        required: true
    },
    packingDate: {
        type: Date,
        required: true
    
    }
});

module.exports = mongoose.model('Packing', PackingSchema);