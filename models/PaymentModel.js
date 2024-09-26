const mongoose = require('mongoose');

const PaymentData = new mongoose.Schema({
    uniqueId: {
        type: String,
        default: () => new mongoose.Types.ObjectId().toString(),
        unique: true
    },
    userID: {
        type: String,
        required: true
        // ref: 'User'
    },
    products: [{
       type: new mongoose.Schema({
            productID: String,
            productName: String,
            quantity: Number,
            price: Number,
            image: String
        }, { _id: false })
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const PaymentDataModel = mongoose.model('PaymentData', PaymentData);

module.exports = PaymentDataModel;
