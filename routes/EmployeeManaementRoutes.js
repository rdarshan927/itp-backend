const express = require('express');
const router = express.Router();

const employeeController = require('../controllers/EmployeeManagementControllers');

// Employee routes
router.post('/employees', employeeController.createEmployee); // Create
router.get('/employee', employeeController.getEmployees); // Read
router.put('/employees/:id', employeeController.updateEmployee); // Update
router.delete('/employees/:id', employeeController.deleteEmployee); // Delete

module.exports = router;
