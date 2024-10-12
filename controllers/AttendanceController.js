const Attendance = require('../models/Attendance');


// Handle check-in
exports.checkin = async (req, res) => {
    const { employeeId } = req.body;

    try {
        // Check if there's an existing record without checkout time
        const existingRecord = await Attendance.findOne({ employeeId, checkoutTime: null });

        if (!existingRecord) {
            // Create a new attendance entry
            const newAttendance = new Attendance({
                employeeId,
                checkinTime: new Date(),
            });

            await newAttendance.save();
            return res.status(201).json({ message: 'Check-in successful', attendance: newAttendance });
        } else {
            return res.status(400).json({ message: 'Employee has already checked in and not checked out yet.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Handle checkout
exports.checkout = async (req, res) => {
    const { employeeId } = req.body;

    try {
        // Find the attendance record with no checkout time
        const existingRecord = await Attendance.findOne({ employeeId, checkoutTime: null });

        if (existingRecord) {
            const checkoutTime = new Date();
            const checkinTime = new Date(existingRecord.checkinTime);

            // Calculate the hours worked
            const workedHours = (checkoutTime - checkinTime) / (1000 * 60 * 60); // Milliseconds to hours
            const otHours = Math.max(0, workedHours - 8); // OT is anything over 8 hours

            // Update the checkout time and OT hours
            existingRecord.checkoutTime = checkoutTime;
            existingRecord.otHours = otHours;

            await existingRecord.save();
            return res.status(200).json({ message: 'Checkout successful', attendance: existingRecord });
        } else {
            return res.status(400).json({ message: 'No active check-in found for this employee.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Handle fetching attendance records
exports.getAttendanceRecords = async (req, res) => {
    try {
        const records = await Attendance.find(); // Fetch all attendance records
        return res.status(200).json(records); // Send records as a response
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
