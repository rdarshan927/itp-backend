const Attendance = require('../models/Attendance');
const EmployeeSalary = require('../models/EmployeeSalary')


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

exports.getMatchingAttendanceWithSalary = async (req, res) => {
  try {
    // Step 1: Get the salary ID from the request
    const  salaryId  = req.params.id; // Accessing salaryId from the URL parameters
    console.log(salaryId)

    // Step 2: Fetch the salary using the provided salary ID
    // const salary = await EmployeeSalary.findOne({ salaryID: salaryId }); // Using salaryID to find the salary record
    const salary = await EmployeeSalary.findById(salaryId);

    if (!salary) {
      return res.status(404).json({ error: 'Salary record not found' });
    }

    // Step 3: Get the userID associated with the salary
    const userId = salary.userID;

    // Step 4: Get the start and end of the current month
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1); // First day of the current month
    const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0); // Last day of the current month

    // Step 5: Fetch all attendance records for the current month that match the user ID
    const attendances = await Attendance.find({
      employeeId: userId,
      checkinTime: {
        $gte: startOfMonth,
        $lte: endOfMonth
      }
    });

    // Step 6: Initialize the result array
    const result = [];

    // Step 7: Loop through each attendance and calculate OT price
    // Step 7: Loop through each attendance and calculate OT price
for (const attendance of attendances) {
  // Calculate OT price based on logic
  const otPrice = (salary.basicSalary / 240) * attendance.otHours; // Adjust logic as needed

  // Format date and time
  const date = attendance.checkinTime.toISOString().split('T')[0]; // Format date as YYYY-MM-DD
  const startTime = attendance.checkinTime.toTimeString().split(' ')[0]; // Get time part without timezone
  const endTime = attendance.checkoutTime ? attendance.checkoutTime.toTimeString().split(' ')[0] : 'N/A'; // Get time part without timezone

  // Push relevant data to the result array
  result.push({
    date: date, // Attendance date in YYYY-MM-DD
    startTime: startTime, // Check-in time without timezone
    endTime: endTime, // Checkout time without timezone
    otHours: attendance.otHours, // Overtime hours
    otPrice: otPrice.toFixed(2) // Calculated OT price
  });
}


    // Step 8: Return the filtered result to the frontend
    return res.status(200).json(result);

  } catch (error) {
    console.error('Error fetching data:', error);
    return res.status(500).json({ error: 'Server error while fetching data' });
  }
};
