const express = require('express');

const EmployeeSalaryController = require('../controllers/EmployeeSalaryController')

const router = express.Router()

router.post("/employeesalary/create",EmployeeSalaryController.createEmpoyeeSalary)
router.get("/employeesalary/getall",EmployeeSalaryController.fetchEmpoyeeSalaries)
router.get("/employeesalary/get",EmployeeSalaryController.fetchEmpoyeeSalary)
router.put("/employeesalary/update",EmployeeSalaryController.updateEmployeeSalary)
router.delete("/employeesalary/delete",EmployeeSalaryController.deleteEmployeeSalary)

module.exports = router