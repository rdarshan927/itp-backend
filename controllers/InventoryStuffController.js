const inventoryStuff = require('../models/InventoryStuff');

const createStuff = async (req, res) => {
    try{
            //get the information from req
            const { stuffID, stuffName, price, amount, totalPrice } = req.body;

            //create a new inventory stuff
            const newStuff = await inventoryStuff.create({
                stuffID,
                stuffName,
                price,
                amount,
                totalPrice
            });

            //send the inventory stuff as a response
            res.json({ newStuff });
    }catch(error){
            res.json({message: error.message});
    }

};

const fetchInventoryStuffs = async (req, res) => {
    try{
            //get all the information from the database
            const inventoryStuffs = await inventoryStuff.find();

             //send the information as a response
            res.json({ inventoryStuffs });

    }catch(error){
        res.json({message: error.message});
    }

};

const fetchInventoryStuff = async (req, res) => {
    try{
        //get the id from the url
        const id = req.params.id;

        //find the information with the given ID
        const inventoryStuff = await inventoryStuff.findById(id);

        //send the information as a response
        res.json({ inventoryStuff });
    }catch(error){
        res.json({message: error.message});
    }

};

const updateInventoryStuff = async (req, res) => {
    //get the id from the url
    const id = req.params.id;

    //get the information from the request
    const { stuffID, stuffName, price, amount, totalPrice } = req.body;

    //find and update the information with the given id
    await inventoryStuff.findByIdAndUpdate(id, {
        stuffID,
        stuffName,
        price,
        amount,
        totalPrice
    });

    //find the updated inventory stuff
    const updatedStuff = await inventoryStuff.findById(id);

    //respond with the updated information
    res.json({ updatedStuff });
};

const deleteInventoryStuff = async (req, res) => {
    //get the id from the url
    const id = req.params.id;

    //delete the inventory stuff with the given id
    await inventoryStuff.findByIdAndDelete(id);

    //send a response
    res.json({ message: "Inventory Stuff deleted!" });
};

module.exports = {
    createStuff,
    fetchInventoryStuffs,
    fetchInventoryStuff,
    updateInventoryStuff,
    deleteInventoryStuff
};
