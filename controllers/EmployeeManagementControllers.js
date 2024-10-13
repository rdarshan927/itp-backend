const mongoose = require('mongoose');
const employeeModel = require('../models/EmployeeManagementModel'); // Ensure correct import

// CREATE Employee
const createEmployee = async (req, res) => {
    try {
        
        const { employeeId, firstName, lastName, role, contactNumber, email, startDate } = req.body;

        // Check if employeeId or email already exists (case insensitive)
        const alreadyExist = await employeeModel.findOne({ 
            $or: [{ employeeId: new RegExp(`^${employeeId}$`, 'i') }, { email: new RegExp(`^${email}$`, 'i') }] 
        });
       
        if (alreadyExist) {
            return res.status(400).json({ message: 'Employee ID or Email already exists!' });
        }
        
        const newEmployee = new employeeModel({
            employeeId, firstName, lastName, role, contactNumber, email, startDate
        });
        
        await newEmployee.save();
        res.status(201).json({ message: 'Employee has been successfully created!' });
        
    } catch (error) {
        console.error("Error creating employee:", error);
        res.status(500).json({ message: 'Failed to create the Employee!', error: error.message });
    }
}

// READ Employees
const getEmployees = async (req, res) => {
    try {
        const employees = await employeeModel.find();
        res.status(200).json(employees);
    } catch (error) {
        console.error("Error retrieving employees:", error);
        res.status(500).json({ message: 'Failed to retrieve employees!', error: error.message });
    }
}

// UPDATE Employee
const updateEmployee = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ message: 'Invalid Employee ID!' });
        }

        const updatedEmployee = await employeeModel.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedEmployee) {
            return res.status(404).json({ message: 'Employee not found!' });
        }

        res.status(200).json({ message: 'Employee successfully updated!', updatedEmployee });

    } catch (error) {
        console.error("Error updating employee:", error);
        res.status(500).json({ message: 'Failed to update the Employee!', error: error.message });
    }
}

// DELETE Employee
const deleteEmployee = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ message: 'Invalid Employee ID!' });
        }

        const deletedEmployee = await employeeModel.findByIdAndDelete(id);

        if (!deletedEmployee) {
            return res.status(404).json({ message: 'Employee not found!' });
        }

        res.status(200).json({ message: 'Employee successfully deleted!' });

    } catch (error) {
        console.error("Error deleting employee:", error);
        res.status(500).json({ message: 'Failed to delete the Employee!', error: error.message });
    }
}

module.exports = {
    createEmployee,
    getEmployees,
    updateEmployee,
    deleteEmployee,
}
