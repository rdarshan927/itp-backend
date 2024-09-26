const express = require("express");
const router = express.Router();
const {loginValidation} = require('../middlewares/AuthValidation')

// Insert user controller
// const RegisterUserControllers = require("../controllers/SheporaUsersControllers");
const {createUsers, login, forgotPassword, resetPassword} = require('../controllers/SheporaUsersControllers')

// Route for creating users
router.post("/sheporausers/create", createUsers);
router.post('/forgot-password', forgotPassword);
router.post('/login', loginValidation, login);
router.post('/reset-password', resetPassword);


// Export the router
module.exports = router;


