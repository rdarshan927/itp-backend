
const mongoose = require('mongoose')


const PackingSchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: true,
        unique: true
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
        type: String,
        required: true
    },
    senderemail: {
        type: String,
        required: true
    },
    packingdate: {
        type: Date,
        required: true,
        validate: {
            validator: function (value) {
                return value <= new Date();
            },
            message: props => `Packing date (${props.value}) cannot be in the future!`
        }
    
    },
    currentstatus: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Packing', PackingSchema);

