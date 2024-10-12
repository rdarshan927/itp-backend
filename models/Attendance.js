const mongoose = require('mongoose');

// Define schema for attendance
const attendanceSchema = new mongoose.Schema({
  employeeId: { type: String, required: true },
  checkinTime: { type: Date, required: true },
  checkoutTime: { type: Date, default: null },
  otHours: { type: Number, default: 0 },
});

// Create the Attendance model
const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance;
