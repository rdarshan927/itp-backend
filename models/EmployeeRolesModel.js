const mongoose = require('mongoose')

const rolesModel = new mongoose.Schema ({
    roleID: {
        type: String,
        required: true,
    },
    roleName: {
        type: String,
        required: true,
    },
    basicSalary: {
        type: Number,
        required: true,
    },
    annualLeave: {
        type: String,
        default: '0',
    },
    shortLeave: {
        type: String,
        default: '0'
    },


})

module.exports = mongoose.model('employeeRoles', rolesModel)