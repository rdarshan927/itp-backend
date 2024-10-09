const nodemailer = require("nodemailer");

// Create a transporter object using SMTP transport
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com", // Use the appropriate SMTP host
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SHEPORA_EMAIL, // Your email
        pass: process.env.SHEPORA_EMAIL_PASS, // Your email password
    },
});

// Function to send an email
const sendEmailNotification = async (scheduleDetails) => {
    const mailOptions = {
        from: process.env.SHEPORA_EMAIL, // Sender address
        to: "nuveen.r@icloud.com", // List of recipients
        subject: "New Plant Schedule Created",
        text: `A new plant schedule has been created:\n\n${JSON.stringify(scheduleDetails, null, 2)}`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully.");
    } catch (error) {
        console.error("Error sending email:", error);
    }
};

module.exports = {
    sendEmailNotification,
};
