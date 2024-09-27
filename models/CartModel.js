const mongoose = require('mongoose')

const CartModel = new mongoose.Schema ({
    productID: {
        type: String,
        required: true,
    },
    productName: {
        type: String,
        required: true,
    },
    quantity: {
        type: String,
        required: true,
    },
    price: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    userEmail: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('cart', CartModel)