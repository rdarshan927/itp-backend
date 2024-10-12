const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/AttendanceController');

// Check-in route (POST)
router.post('/checkin', attendanceController.checkin);

// Checkout route (PUT)
router.put('/checkout', attendanceController.checkout);

router.get('/', attendanceController.getAttendanceRecords);

module.exports = router;
