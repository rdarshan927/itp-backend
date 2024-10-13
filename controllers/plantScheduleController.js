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
    const { PlantName, Field, Resources, WeatherCondition } = req.body;

    let newScheduleID;
    try {
        const lastSchedule = await PlantSchedule.findOne().sort({ ScheduleID: -1 });
        if (lastSchedule && lastSchedule.ScheduleID) {
            const lastIDNumber = parseInt(lastSchedule.ScheduleID.replace('S', '')); // Extract number
            newScheduleID = 'S' + (lastIDNumber + 1).toString().padStart(3, '0');   // Increment and format
        } else {
            newScheduleID = 'S001';  // Start from S001 if no schedules exist
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Error fetching last schedule ID" });
    }

    if (!PlantName || !Field) {
        return res.status(400).json({ message: "PlantName and Field are required" });
    }

    let newplantSchedule;

    try {
        const plantedDate = new Date();
        let bloomingDuration = await getBloomingDuration(PlantName);
        if (!bloomingDuration) {
            return res.status(400).json({ message: "Invalid plant name. Unable to retrieve blooming duration." });
        }

        // Calculate expected blooming date
        const expectedBloomingDate = new Date(plantedDate);
        expectedBloomingDate.setDate(plantedDate.getDate() + bloomingDuration);

        newplantSchedule = new PlantSchedule({
            ScheduleID: newScheduleID,
            PlantName,
            Field,
            Resources,
            WeatherCondition,
            PlantedDate: plantedDate,
            ExpectedBloomingDate: expectedBloomingDate,
        });

        await newplantSchedule.save();
        await sendEmailNotification(newplantSchedule);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Error adding plant schedule" });
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
            },{ new: true }); // Use `new: true` to return the updated document

            if (!plantSchedule) {
                return res.status(404).json({ message: "Unable to Update Plant Schedule" });
            }


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
};




exports.getAllPlantSchedules = getAllPlantSchedules;
exports.addPlantSchedules = addPlantSchedules;
exports.getById = getById;
exports.updatePlantSchedule = updatePlantSchedule;
exports.deletePlantSchedule = deletePlantSchedule;
exports.searchPlantSchedules = searchPlantSchedules;