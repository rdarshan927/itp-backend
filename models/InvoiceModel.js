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
    orderID: {
        type: String,
        required: true,
        unique: true
    }
}, { timestamps: true });

const Invoice = mongoose.model('Invoice', InvoiceModel);
module.exports = Invoice;

// const InvoiceSchema = new Schema({
//     userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
//     invoiceNumber: { type: String, required: true, unique: true },
//     amountPaid: { type: Number, required: true },
//     paymentDate: { type: Date, default: Date.now },
//     paymentMethod: { type: String, required: true },  // e.g., "Credit Card"
//     stripeSessionId: { type: String, required: true },  // To track with Stripe
//     items: [
//         {
//             productId: { type: Schema.Types.ObjectId, ref: 'Product' },
//             quantity: { type: Number, required: true },
//             price: { type: Number, required: true },
//         }
//     ]
// });