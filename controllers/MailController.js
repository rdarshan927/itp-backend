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
        from: process.env.SHEPORA_EMAIL, 
        to: "nuveen.r@icloud.com", 
        subject: "New Plant Schedule Created",
        html: `
            <h2>A new plant schedule has been created</h2>
            <p><strong>Schedule ID:</strong> ${scheduleDetails.ScheduleID}</p>
            <p><strong>Plant Name:</strong> ${scheduleDetails.PlantName}</p>
            <p><strong>Field:</strong> ${scheduleDetails.Field}</p>
            <p><strong>Resources:</strong> ${scheduleDetails.Resources}</p>
            <p><strong>Weather Condition:</strong> ${scheduleDetails.WeatherCondition}</p>
            <p><strong>Planted Date:</strong> ${new Date(scheduleDetails.PlantedDate).toLocaleDateString()}</p>
            <p><strong>Expected Blooming Date:</strong> ${new Date(scheduleDetails.ExpectedBloomingDate).toLocaleDateString()}</p>
            <br>
            <p>This is an automated notification from ShePora Flowers.</p>
        `,
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
