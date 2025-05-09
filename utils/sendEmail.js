const nodemailer = require("nodemailer");

const sendVerificationEmail = async (email, token) => {
  const transporter = nodemailer.createTransport({
    service: "gmail", // Or use SendGrid, SMTP, etc.
    auth: {
      user: process.env.EMAIL_USER, // Add this to .env
      pass: process.env.EMAIL_PASS, // Add this to .env
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Verify your Events Platform account",
    html: `<p>Click the link below to verify your email:</p>
           <a href="https://alfarooq-events-platform.netlify.app/verify/${token}">Verify Email</a> <p>Or copy and paste this link into your browser:</p>
           <p>https://alfarooq-events-platform.netlify.app/verify/${token}</p>
           <p>If you did not create an account, please ignore this email.</p>`,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendVerificationEmail;
