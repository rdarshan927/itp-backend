const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const adminsSchema = new Schema({
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    name: {
        type: String,
        required: [true, "Name is required"],
        minlength: [2, "Name must be at least 2 characters long"],
        maxlength: [50, "Name cannot exceed 50 characters"],
    },
    address: {
        type: String,
        required: [true, "Address is required"],
        minlength: [10, "Address must be at least 10 characters long"],
    },
    phoneNumber: {
        type: String,
        required: [true, "Phone number is required"],
        validate: {
            validator: function(v) {
                return /^\d{10}$/.test(v); // Use regex to check for exactly 10 digits
            },
            message: props => `${props.value} is not a valid 10-digit phone number!` // Fixing the template literal here
        }
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [8, "Password must be at least 8 characters long"],
    }
});

module.exports = mongoose.model("sheporaadmins", adminsSchema);
