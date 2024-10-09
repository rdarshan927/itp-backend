// controllers/MailController.js
const nodemailer = require('nodemailer');

// Configure Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail', // Use your email service (e.g., Gmail)
    auth: {
        user: process.env.SHEPORA_EMAIL,
        pass: process.env.SHEPORA_EMAIL_PASS,
    },
});

/// Function to send email
const sendEmail = async (recipientEmail, orderId, deliveryStatus) => {
    const mailOptions = {
        from: process.env.SHEPORA_EMAIL,
        to: recipientEmail,
        subject: `Delivery Update for Order ${orderId}`,
        text: `Hello,\n\nYour Order  ${orderId}  ${deliveryStatus} . Thank you for using our service!\n\nBest regards,\nSephora Flowers`,
    };

    return transporter.sendMail(mailOptions);
};


module.exports = { sendEmail };
