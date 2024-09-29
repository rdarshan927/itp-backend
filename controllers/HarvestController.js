const Harvest =require("../models/HarvestModel");
//Read data
const getHarvestData = async (req, res, next) => {
    
    let harvestData;
    
    try{
        harvestData = await Harvest.find();
    }catch (err) {
        console.log(err);
    }
    if(!harvestData){
        return res.status(404).json({message:"No Harvest data found"});
    }
    // Display all users
    return res.status(200).json({harvestData});
};
// Insert data
const addHarvest = async (req, res, next) =>{

    const {harvestId,cropType,harvestDate,quantity,quality,unit} = req.body;

    try{
        harvest = new Harvest({harvestId,cropType,harvestDate,quantity,quality,unit});
        await harvest.save();
    }catch (err) {
        console.log(err);
    }
    //if not inserted

    if (!harvest){
        return res.status(404).json({message:"unable to add Harvest"});
    }
    return res.status(200).json({harvest});

}
//Get by Id

const getByID = async (req, res, next) =>{

    const id = req.params.id;

    let harvest

    try {
        harvest = await Harvest.findById(id);
    } catch (err) {
        console.log(err);
    }
    if (!harvest){
        return res.status(404).json({message:"Harvest Id not available"});
    }
    return res.status(200).json({harvest});
};

const updateHarvest = async (req, res, next) => {
    
    const id = req.params.id;
    const {harvestId,cropType,harvestDate,quantity,quality,unit} = req.body;

    let harvest;

    try{
        harvest = await Harvest.findByIdAndUpdate(id,
            {harvestId:harvestId, cropType:cropType, harvestDate:harvestDate, quantity:quantity, quality:quality, unit:unit});
            harvest = await harvest.save();
    }catch{
        console.log(err);
    }
    if (!harvest){
        return res.status(404).json({message:"Unable to update hatvest data"});
    }
    return res.status(200).json({harvest});

};
//Delete harvest
const deleteHarvest = async (req, res, next) =>{
    const id = req.params.id;
    let harvest;

    try{
        harvest = await Harvest.findByIdAndDelete(id)
    }catch(err){
        console.log(err);
        return res.status(500).json({ message: "An error occurred while deleting harvest data" });
    }
    if (!harvest){
        return res.status(404).json({message : "Uanable to Delete harvest data "});
    }
    return res.status(200).json({harvest});

}


exports.getHarvestData = getHarvestData;
exports.addHarvest = addHarvest;
exports.getByID = getByID;
exports.updateHarvest = updateHarvest;
exports.deleteHarvest = deleteHarvest;