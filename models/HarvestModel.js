const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    harvestId:{
        type:String,
        required:true, // validation
    },
    cropType:{
        type:String,
        required:true,//validation
       
    },
    harvestDate:{
        type:Date,
        required:true, // validation
    },
    quantity:{
        type:Number,
        required:true, // validation
    },
    quality:{
        type:String,
        required:true, // validation
    },
    unit:{
        type:String,
        required:true, // validation
    },
});

module.exports = mongoose.model(
    "HarvestModel",
    userSchema
)