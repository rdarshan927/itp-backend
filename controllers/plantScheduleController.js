const getBloomingDuration = require("../models/getBloomingDuration");
const PlantSchedule = require("../models/PlantScheduleModel");
const { sendEmailNotification } = require("./MailController");


// display part
const getAllPlantSchedules = async (req, res , next) => {
    let plantSchedules;

    try{
        plantSchedules = await PlantSchedule.find();
    }catch(err){
        console.error(err);
        return res.status(500).json({ message: "Error fetching plant schedules" }); // Send a 500 error for any server-side issues
    }

    //if schedules not available
    if(!plantSchedules || plantSchedules.length === 0){
        return res.status(404).json({message: "Plant schedules not available"});
    }

    //display Schedules
    return res.status(200).json({plantSchedules});
};



//insert part
const addPlantSchedules = async (req, res, next) => {
    const { ScheduleID, PlantName, Field, Resources, WeatherCondition } = req.body;
    
    console.log("Request Body:", req.body);

    if (!ScheduleID || !PlantName || !Field) {
        return res.status(400).json({ message: "ScheduleID, PlantName, and Field are required" });
    }

    let newplantSchedule;

    try {
        const existingSchedule = await PlantSchedule.findOne({ ScheduleID });
        console.log("Existing Schedule:", existingSchedule);
       
        if (existingSchedule) {
            return res.status(400).json({ message: "ScheduleID already exists." });
        }

        // Convert timestamp to a Date object
        const plantedDate = new Date();

        if (PlantName) {
            const bloomingDuration = await getBloomingDuration(PlantName);
            
            // Clone the plantedDate and calculate expected blooming date
            const expectedBloomingDate = new Date(plantedDate);
            expectedBloomingDate.setDate(plantedDate.getDate() + bloomingDuration);
            
            console.log(bloomingDuration, "Expected Blooming Duration");
            
            
            newplantSchedule = new PlantSchedule({
                ScheduleID,
                PlantName,
                Field,
                Resources,
                WeatherCondition,
                PlantedDate: plantedDate,  // Save the planted date
                ExpectedBloomingDate: expectedBloomingDate // Save the expected blooming date
            });

            console.log("Saving Plant Schedule:", newplantSchedule);
            
            await newplantSchedule.save();

            await sendEmailNotification(newplantSchedule);
        }

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Error adding plant schedule" });
    }

    if (!newplantSchedule) {
        return res.status(404).json({ message: "Unable to add plant schedule" });
    }

    return res.status(200).json({ newplantSchedule });
};


//get by id
const getById = async(req ,res, next) => {
    const id = req.params.id;

    let plantSchedule;

    try{
        plantSchedule = await PlantSchedule.findById(id);
    }catch(err){
        console.log(err);
        return res.status(500).json({ message: "Error fetching plant schedule" }); // Send a 500 error for any server-side issues
    }
    //If schedule not availble
    if(!plantSchedule){
        return res.status(404).json({message: "Plant schedule not available"});
    }
    return res.status(200).json({plantSchedule});
};

//update Schedule
const updatePlantSchedule = async(req ,res, next) => {
    const id = req.params.id;
    const  {ScheduleID,PlantName,Field,Resources,WeatherCondition,PlantedDate,ExpectedBloomingDate} = req.body;

    let plantSchedule;

    try{
        plantSchedule = await PlantSchedule.findByIdAndUpdate(id,
            {
                ScheduleID:ScheduleID,
                PlantName:PlantName,
                Field:Field,
                Resources:Resources,
                WeatherCondition:WeatherCondition,
                PlantedDate: PlantedDate, 
                ExpectedBloomingDate: ExpectedBloomingDate
            });
            plantSchedule = await plantSchedule.save();
    }catch(err){
        console.log(err);
        return res.status(500).json({ message: "Error updating plant schedule" });
    }
    if(!plantSchedule){
        return res.status(404).json({message: "Unable to Update Plant Schedule"});
    }
    return res.status(200).json({plantSchedule});
};

//delete Schedule
const deletePlantSchedule = async (req, res, next) => {
    const id = req.params.id;

    let plantSchedule;

    try{
        plantSchedule = await PlantSchedule.findByIdAndDelete(id)
    }catch(err){
        console.log(err);
        return res.status(500).json({ message: "Error deleting plant schedule" });
    }
    if(!plantSchedule){
        return res.status(404).json({message: "Unable to Delete User Delete (user not found) "})
    }
    return res.status(200).json({plantSchedule});
};

// Search by ScheduleID or PlantName
const searchPlantSchedules = async (req, res , next)  => {
    const {query} = req.query;

    let plantSchedules;

    try{
        plantSchedules = await PlantSchedules.findByIdAndDelete({
            $or: [
                {ScheduleID: { $regex:query, $options: 'i'}},
                {PlantName: {$regex: query, $options: 'i'}}
            ]
        });
    } catch (err){
        console.error(err);
        return res.status(500).json({message: "Error fetching plant schedules"});
    }

    if(!plantSchedules || plantSchedules.length === 0 ){
        return res.status(404).json({message: "No matching plant Schedules"})
    }

    return res.status(200).json({plantSchedules});
}





exports.getAllPlantSchedules = getAllPlantSchedules;
exports.addPlantSchedules = addPlantSchedules;
exports.getById = getById;
exports.updatePlantSchedule = updatePlantSchedule;
exports.deletePlantSchedule = deletePlantSchedule;
exports.searchPlantSchedules = searchPlantSchedules;