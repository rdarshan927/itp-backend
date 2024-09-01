const Invoice =  require('../models/InvoiceModel')

const getInvoice = async(req, res) => {
    try {
        const Invoices = await Invoice.find();

        res.status(200).json({Invoices});
    } catch(error) {
        console.log(error);
    }
}

const deleteInvoice = async(req, res) => {
    const ID = req.params.id;
    console.log('came : ', ID);
    try {
        const Invoices = await Invoice.findByIdAndDelete(ID);

        if(!Invoices){
            res.status(200).json({message: 'Deletion was not success!'});
        }
    } catch(error){
        console.log(error);
    }
}

const updateInvoice = async(req, res) => {
    const ID = req.params.id;
    const {hello} = req.body;
    console.log();
    try {
        const Invoices = await Invoice.findByIdAndUpdate(ID);
    } catch(error) {
        console.log(error);
    }
}

module.exports = { getInvoice, deleteInvoice };