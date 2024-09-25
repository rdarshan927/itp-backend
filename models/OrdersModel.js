const mongoose = require('mongoose');

const OrdersSchema = new mongoose.Schema({
    orderID: {
        type: String,
        required: true,
        unique: true
    },
    userEmail: {
        type: String,
        required: true
    },
    receiverName: {
        type: String,
        required: true
    },
    receiverContact: {
        type: String,
        required: true
    },
    receiverAddress: {
        type: String,
        required: true
    },
    products: [{
        productID: {
            type: String
        },
        quantity: {
            type: Number,
            required: true
        },
        price: {
            type: Number,
            required: true
        }
    }],
    totalAmount: {
        type: Number,
    },
    orderDate: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        default: 'Processing'
    }
}, { timestamps: true });

const Orders = mongoose.model('Orders', OrdersSchema);

module.exports = Orders;
