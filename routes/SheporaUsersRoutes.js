const express = require("express");
const router = express.Router();
const {loginValidation} = require('../middlewares/AuthValidation')

// Insert user controller
// const RegisterUserControllers = require("../controllers/SheporaUsersControllers");
const {login, createUsers} = require('../controllers/SheporaUsersControllers')

// Route for creating users
router.post("/sheporausers/create", RegisterUserControllers.createUsers);
router.post('/forgot-password', RegisterUserControllers.forgotPassword);
router.post("/sheporausers/create", createUsers);

router.post('/login', loginValidation, login)


// Export the router
module.exports = router;


