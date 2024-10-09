const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const getBloomingDuration = require('./getBloomingDuration');

const floweringDurations = {
    "Roses": 50, // Roses bloom in 50 days
    "Lilies": 40, // Lilies bloom in 40 days
    "Tulips": 30, // Tulips bloom in 30 days
    
  };

const plantScheduleSchema =new Schema({
    ScheduleID:{
        type:String,
        required:true,//validate
        unique:true
    },
    PlantName: {
        type: String,
        required:true,//validate
    },
    Field:{
        type:String,
        required:true,//validate
        enum: ['A101', 'A102', 'A103', 'A104', 'A105'], // Validate field with enum
        message: '{VALUE} is not a valid field' // Optional message for invalid field
    },
    Resources:{
        type:String,
        required:true,//validate
    },
    WeatherCondition:{
        type:String,
        required:true,//validate
    },
    PlantedDate:{
        type:Date,
        //required:true,//validate
        default: () => new Date(new Date().setHours(0, 0, 0, 0)), // Set default to current date at midnight
    },
    ExpectedBloomingDate:{
        type:Date
    }
}, {
    timestamps: true
});

plantScheduleSchema.pre('save', async function (next){
    const plantSchedule = this;

    try{
        const bloomingDuration = await getBloomingDuration(plantSchedule.PlantName);
        const today = new Date(plantSchedule.PlantedDate);// use user entered planted date

        plantSchedule.ExpectedBloomingDate = new Date(today.setDate(today.getDate() +  bloomingDuration)); // adding blooming duration to the user entered date
        plantSchedule.ExpectedBloomingDate.setHours(0, 0, 0, 0);

        next();
    }catch (err){
        next(err);
    }
});

const PlantSchedule = mongoose.model('PlantSchedule', plantScheduleSchema);

module.exports = PlantSchedule;