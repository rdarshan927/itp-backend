const express = require('express');
const router = express.Router();

const employeeController = require('../controllers/EmployeeManagementControllers');


// Employee routes
router.post('/employees', employeeController.createEmployee);

module.exports = router;
