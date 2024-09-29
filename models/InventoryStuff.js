const mongoose = require('mongoose');

const rolesModel = new mongoose.Schema({
    stuffID: {
        type: String,
        required: [true, 'Stuff ID is required'],
        unique: true, 
        min: [5, 'Stuff ID must be 5 digits long'], 
    },
    stuffName: {
        type: String,
        required: [true, 'Stuff Name is required'],
        minlength: [2, 'Stuff Name must be at least 2 characters long'], 
        maxlength: [20, 'Stuff Name cannot exceed 20 characters'] 
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
    }
});

module.exports = mongoose.model('inventoryStuff', rolesModel);
