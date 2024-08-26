//data display
const Packing = require('../models/PackingModel');

const getAllpacking = async (req, res) => {
    let packing;

    try {
        packing = await Packing.find();
    } catch (error) {
       console.log(error);
    }

    if(!packing) {
        return res.status(404).json({ message: 'No  packing found' });
    }
    return res.status(200).json(packing);

};

//data Insert
const addpacking = async (req, res) => {
    const { orderId, ReceiverName, ReceiverAddress, ReceiverContactNo, SenderEmail,packingDate } = req.body;
  
    
    

    let packing;

    try {
        packing = new Packing({
            orderId,
            ReceiverName,
            ReceiverAddress,
            ReceiverContactNo,
            SenderEmail,
            packingDate
        });
        await packing.save();

    } catch (error) {
        console.log(error);
    }

    if(!packing) {
        return res.status(404).json({ message: 'Failed to add packing' });
    }
     return res.status(200).json(packing);
    

    
};
exports.getAllpacking = getAllpacking;
exports.addpacking = addpacking;