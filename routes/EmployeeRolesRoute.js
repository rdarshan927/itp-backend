const express = require('express')
const { createRole } = require('../controllers/EmployeeRolesController')


const router = express.Router()

router.post('/createrole/', createRole)


module.exports = router