const EmployeeSalary = require('../models/EmployeeSalary');


const createEmpoyeeSalary = async (req, res) => {
    try{
        //get the information from req
        const { salaryID, userID, basicSalary, allowance, epf, etf, totalSalary } = req.body;

        console.log(req.body);
        
        
        //create a new salary
        const newEmployeeSalary = await EmployeeSalary.create({
            salaryID,
            userID,
            basicSalary,
            allowance,
            epf,
            etf,
            totalSalary
        });

        if(!newEmployeeSalary){
            console.log("Failed to create the salary!");
            return res.status(400).json({message: "Failed to create the salary!"});
        }

        //send the salary as a response
        res.status(200).json({ message: "Salary successfully added", newEmployeeSalary });
    }catch(error){
        res.json({message: error.message});
    }
}

const fetchEmpoyeeSalaries = async (req, res) => {
    console.log("hello 1")
    try{
        //get all the information from the database
        const getEmployeeSalary = await EmployeeSalary.find();
        console.log(getEmployeeSalary, "hello");
        res.json({ getEmployeeSalary });
    }catch(error){
        res.json({message: error.message});
    }
}

const fetchEmpoyeeSalary = async (req, res) => {
    try{
        //get the id from the url
        const id = req.params.id;

        //find the information with the given ID
        const EmployeeSalary = await InventoryStuff.findById(id);

        //send the information as a response
        res.json({ EmployeeSalary });

    }catch(error){
        res.json({message:error.message});
    }
}

const updateEmployeeSalary = async (req, res) => {
    const id = req.params.id;
    const { salaryID, userID, basicSalary, allowance, epf, etf, totalSalary } = req.body;

    try{
        const updatedEmployeeSalary = await EmployeeSalary.findByIdAndUpdate(id, {
            salaryID,
            userID,
            basicSalary,
            allowance,
            epf,
            etf,
            totalSalary
        }, {new: true});
        res.json({ EmployeeSalary });
    }catch(error){
        res.json({message: error.message});
    }
}

const deleteEmployeeSalary = async (req,res) => {
    //get the id from the url
    const id = req.params.id;

    //delete the salary with the given id
    await EmployeeSalary.findByIdAndDelete(id);

    //send a response
    res.json({message:"Employee Salary Deleted!"});
}

module.exports = {
    createEmpoyeeSalary,
    fetchEmpoyeeSalaries,
    fetchEmpoyeeSalary,
    updateEmployeeSalary,
    deleteEmployeeSalary
}