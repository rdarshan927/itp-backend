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
            return res.status(400).json({message: "Failed to create the salary!"});
            console.log("Failed to create the salary!");
        }

        //send the salary as a response
        res.json({ newEmployeeSalary });
    }catch(error){
        res.json({message: error.message});
    }
}