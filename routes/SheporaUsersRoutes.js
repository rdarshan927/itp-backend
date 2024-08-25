const express = require("express");
const router = express.Router();

// Insert user controller
const RegisterUserControllers = require("../controllers/SheporaUsersControllers");

// Route for creating users
router.post("/sheporausers/create", RegisterUserControllers.createUsers);
router.post('/forgot-password', RegisterUserControllers.forgotPassword);

// Export the router
module.exports = router;


