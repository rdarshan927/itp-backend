const jwt = require('jsonwebtoken');
const Admin = require('../models/AdminLogin');

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await Admin.findOne({ email });
        const errorMsg = 'Auth failed email or password is wrong';
        if (!user) {
            return res.status(403).json({ message: errorMsg, success: false });
        }

        if (password !== user.password) {
            return res.status(403).json({ message: errorMsg, success: false });
        }

        const jwtToken = jwt.sign(
            { email: user.email, _id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(200).json({
            message: "Login Success",
            success: true,
            jwtToken,
            email,
            name: user.name
        });
    } catch (err) {
        res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

// Ensure it's exporting the function, not an object
module.exports = { login };
