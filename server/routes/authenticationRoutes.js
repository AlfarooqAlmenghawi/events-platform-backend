const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const sendVerificationEmail = require("../../utils/sendEmail.js");
const JWT = require("jsonwebtoken");

const SQL_DATABASE = require("../../database/connection.js");

router.post("/register", async (request, response) => {
  try {
    const { first_name, last_name, email, password, role } = request.body;

    const existingUser = await SQL_DATABASE.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (existingUser.rowCount > 0) {
      return response.status(400).send("Email already registered");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString("hex");

    await SQL_DATABASE.query(
      "INSERT INTO users (first_name, last_name, email, password_hash, role, verification_token, email_verified) VALUES ($1, $2, $3, $4, $5, $6, $7)",
      [
        first_name,
        last_name,
        email,
        hashedPassword,
        role,
        verificationToken,
        false,
      ]
    );

    await sendVerificationEmail(email, verificationToken);

    response.json({ message: "User registered! Please verify your email." });
  } catch (error) {
    response.status(500).send("Error registering user");
  }
});

module.exports = router;
