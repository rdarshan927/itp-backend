const mongoose = require('mongoose')

const userSchema = new mongoose.Schema ({
    employeeId: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
    },
    contactNumber: {
        type: Number,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
})

module.exports = mongoose.model('SheporaEmployee', userSchema)