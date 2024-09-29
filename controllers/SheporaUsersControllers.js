// Import necessary modules
require('dotenv').config(); // Load environment variables from .env file
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require("../models/SheporaUsersModel");

// Create User Controller
const createUsers = async (req, res, next) => {
    const { email, name, address, phoneNumber, password } = req.body;
    
    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "User already exists with this email." });
        }
        if (!/^\d{10}$/.test(phoneNumber)) {
            return res.status(400).json({ message: "Phone number must be a 10-digit number." });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format." });
        }
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(411).json({
                message: "Password must be at least 8 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character."
            });
        }

        // Encrypt the password
        const salt = await bcrypt.genSalt(10);
        const encryptedPassword = await bcrypt.hash(password, salt);

        // Create a new user
        const newUser = new User({
            email,
            name,
            address,
            phoneNumber,
            password: encryptedPassword
        });

        // Save the user to the database
        await newUser.save();
        return res.status(201).json({ message: "User created successfully!", user: newUser });
        
    } catch (err) {
        console.error(err); // Log the error for debugging
        return res.status(500).json({ message: "Error occurred while processing your request." });
    }

};
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email })

        const errorMsg = 'Auth failed email or password is wrong';
        if (!user) {
            return res.status(403)
                .json({ message: errorMsg, success: false });
        }
        const isPassEqual = await bcrypt.compare(password, user.password);

        if (!isPassEqual) {
            return res.status(403)
                .json({ message: errorMsg, success: false });
        }
        const jwtToken = jwt.sign(
            { email: user.email, _id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        )
        console.log("session created")

        res.status(200)
            .json({
                message: "Login Success",
                success: true,
                jwtToken,
                email,
                name: user.name
            })
            
    } catch (err) {
        res.status(500)
            .json({
                message: "Internal server errror",
                success: false
            })
    }
}


//forgetpassword
const forgotPassword = async (req, res) => {
    console.log("f")
    const { email } = req.body;
    console.log(email, "email")
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ Status: "User not found" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
        console.log("asdfg")
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.SHEPORA_EMAIL,
                pass: process.env.SHEPORA_EMAIL_PASS,
            },
            debug: true, // Enable debug output
        });
        
        const mailOptions = {
            from: process.env.SHEPORA_EMAIL,
            to: user.email,
            subject: 'Reset Password Link',
            text: `Please click on the following link to reset your password: ${process.env.CLIENT_URL}/reset_password/${user._id}/${token}`,
        };
    
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent:", info.response);
        return res.status(200).json({ Status: "Success", message: 'Reset password link sent successfully.' });

    } catch (err) {
        console.error("Error in forgotPassword:", err);
        res.status(500).json({ Status: "Error", message: err.message });
    }
};


// Reset Password
const resetPassword = async (req, res) => {
    console.log("Reset password function called");
    // const {  } = req.params; // Get the id and token from the URL parameters
    const { password,id, token } = req.body; // Get the new password from the request body
   

    try {
        // Verify the token using the secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Token verified:", decoded);

        // Check if the user ID from the token matches the ID in the URL
        if (decoded.id !== id) {
            return res.status(400).json({ Status: "Error", message: "Invalid token or user ID" });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("Password hashed");

        // Update the user's password in the database
        const user = await User.findByIdAndUpdate(id, { password: hashedPassword }, { new: true });
        if (!user) {
            return res.status(404).json({ Status: "User not found" });
        }
        console.log("User password updated");
        
        // Respond with success
        return res.status(200).json({ Status: "Success", message: "Password reset successful." });

    } catch (err) {
        // Handle errors, including invalid tokens
        console.error("Error in resetPassword:", err);
        res.status(500).json({ Status: "Error", message: err.message });
    }
};


// Export the controllers
module.exports = { createUsers, login, forgotPassword , resetPassword};
