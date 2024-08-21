const User = require("../models/SheporaUsersModel");
const bcrypt = require("bcryptjs");

const createUsers = async (req, res, next) => {
    const { email, name, address, phoneNumber, password } = req.body;
    
    
    const salt = await bcrypt.genSalt(10);
    encryptedPassword = await bcrypt.hash(password, salt);
        

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "User already exists with this email." });
        }
        if (!/^\d{10}$/.test(phoneNumber)) {
            return res.status(408).json({ message: "Phone number must be a 10-digit number." });
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

module.exports = { createUsers };
