const mongoose = require('mongoose')

const rolesModel = new mongoose.Schema ({
    salaryID: {
        type: String,
        unique: true, 
        required: true,
    },
    userID: {
        type: String,
        unique: true, 
        required: true,
    },
    basicSalary: {
        type: Number,
        required: true,
    },
    allowance: {
        type: Number,
        default: '0',
    },
    epf: {
        type: Number,
        default: '0'
    },
    etf:{
        type:Number,
        default:'0'
    },
    totalSalary:{
        type:Number,
        default:'0'
    }


})

module.exports = mongoose.model('EmployeeSalary', rolesModel)