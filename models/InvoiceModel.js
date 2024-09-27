const mongoose = require('mongoose');

const InvoiceModel = new mongoose.Schema({
    userID: {
        type: String,
        required: true
    },
    invoiceID: {
        type: String,
        required: true,
        unique: true
    },
    userInfo: {
        type: String,
        required: true
    },
    amountPaid: {
        type: Number,
        required: true
    },
    paidOn: {
        type: Date,
        default: Date.now
    },
    paymentMethod: {
        type: String,
        required: true
    },
    stripeSessionID: {
        type: String,
        required: true
    },
    items: [{
        productID: {
            type: String,
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
    validity: {
        type: String,
        default: "valid"
    },
    orderID: {
        type: String,
        required: true,
        unique: true
    }
}, { timestamps: true });

const Invoice = mongoose.model('Invoice', InvoiceModel);
module.exports = Invoice;