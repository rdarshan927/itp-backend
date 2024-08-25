const employeeModel = require('../models/EmployeeManagementModel');

const createEmployee = async (req, res) => {
    try {
        const { employeeId, firstName, lastName, role, contactNumber, email, startDate } = req.body;

        // Check if role exists
        const roleExists = await rolesModel.findById(role);
        if (!roleExists) {
            return res.status(400).json({ message: 'Role does not exist!' });
        }

        const alreadyExist = await employeeModel.findOne({ $or: [{ employeeId }, { email }] });
        if (alreadyExist) {
            return res.status(400).json({ message: 'Employee ID or Email already exists!' });
        }

        const newEmployee = new employeeModel({
            employeeId, firstName, lastName, role, contactNumber, email, startDate
        });

        await newEmployee.save();
        res.status(201).json({ message: 'Employee has been Successfully created!' });

    } catch (error) {
        res.status(500).json({ message: 'Failed to create the Employee!' });
        console.error(error);
    }
}

module.exports = {
    createEmployee,
}
