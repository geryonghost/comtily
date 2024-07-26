const smtpDomain = process.env.smtpDomain
const smtpEmail = process.env.smtpEmail
const smtpPass = process.env.smtpPass

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: smtpDomain,
    port: 587,
    secure: false,
    auth: {
        user: smtpEmail,
        pass: smtpPass,
    },
});

async function sendMail(emailTo = 'cyb3rsteven@gmail.com', emailSubject, emailHTML) {
    const info = await transporter.sendMail({
        from: 'no-reply@itsweatheroutside.com',
        to: emailTo,
        subject: emailSubject,
        html: emailHTML,
    });

    console.log("Message sent: %s", info.messageId);
}

module.exports = {
    sendMail,
}
