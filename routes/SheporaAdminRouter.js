const express = require('express');
const router = express.Router();
const { login } = require('../controllers/SheporaAdminController');

// Route definition for login
router.post('/alogin', login);

module.exports = router;
