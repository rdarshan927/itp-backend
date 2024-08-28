const mongoose = require('mongoose');

const rolesModel = new mongoose.Schema({
    stuffID: {
        type: Number,
        required: [true, 'Stuff ID is required'],
        unique: true, 
        min: [4, 'Stuff ID must be at least 4'] 
    },
    stuffName: {
        type: String,
        required: [true, 'Stuff Name is required'],
        minlength: [5, 'Stuff Name must be at least 5 characters long'], 
        maxlength: [100, 'Stuff Name cannot exceed 100 characters'] 
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price must be at least 0'], 
        validate: {
            validator: function (value) {
                return value > 0; 
            },
            message: 'Price must be greater than 0'
        }
    },
    amount: {
        type: Number,
        default: 0,
        min: [0, 'Amount cannot be negative'], 
        validate: {
            validator: function(value) {
                return value >= 0; 
            },
            message: 'Amount must be greater than or equal to 0'
        }
    },
    totalPrice: {
        type: Number,
        default: 0,
        validate: {
            validator: function (value) {
                return value >= this.price * this.amount; 
            },
            message: 'Total Price must be at least equal to price multiplied by amount'
        }
    }
});

module.exports = mongoose.model('inventoryStuff', rolesModel);
