const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const sendVerificationEmail = require("../../utils/sendEmail.js");
const authenticateJWT = require("../../utils/authenticateJWT.js");
const JWT = require("jsonwebtoken");

const SQL_DATABASE = require("../../database/connection.js");

router.post("/register", async (request, response) => {
  try {
    const { first_name, last_name, email, password } = request.body;

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
      "INSERT INTO users (first_name, last_name, email, password_hash, verification_token, email_verified) VALUES ($1, $2, $3, $4, $5, $6)",
      [first_name, last_name, email, hashedPassword, verificationToken, false]
    );

    await sendVerificationEmail(email, verificationToken);

    response.json({ message: "User registered! Please verify your email." });
  } catch (error) {
    console.error("Error registering user:", error);
    response.status(500).send("Error registering user");
  }
});

router.get("/verify/:token", async (request, response) => {
  try {
    const { token } = request.params;

    const user = await SQL_DATABASE.query(
      "SELECT * FROM users WHERE verification_token = $1",
      [token]
    );

    if (user.rowCount === 0) {
      return response.status(400).send("Invalid token");
    }

    await SQL_DATABASE.query(
      "UPDATE users SET email_verified = true, verification_token = NULL WHERE verification_token = $1",
      [token]
    );

    response.json({ message: "Email verified successfully!" });
  } catch (error) {
    response.status(500).send("Error verifying email");
  }
});

router.post("/login", async (request, response) => {
  try {
    const { email, password } = request.body;

    const result = await SQL_DATABASE.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return response.status(400).json({ error: "Invalid email or password" });
    }

    const user = { ...result.rows[0] };
    // Check if the password matches
    // Use bcrypt to compare the hashed password with the provided password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      return response.status(400).json({ error: "Invalid email or password" });
    }

    if (!user.email_verified) {
      return response.status(400).json({ error: "Email not verified" });
    }

    // Delete sensitive keys for security before sending user object
    delete user.verification_token;
    delete user.password_hash;

    const token = JWT.sign(
      { id: user.id }, // keep it minimal
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return response
      .status(200)
      .json({ message: "Login successful!", user, token });
  } catch (error) {
    console.error("Error logging in:", error);
    return response.status(500).json({ error: "Error logging in" });
  }
});

router.get("/profile", authenticateJWT, async (request, response) => {
  try {
    const result = await SQL_DATABASE.query(
      "SELECT * FROM users WHERE id = $1",
      [request.user.id]
    );

    if (result.rowCount === 0) {
      return response.status(404).json({ error: "User not found" });
    }

    delete result.rows[0].verification_token;
    delete result.rows[0].password_hash;

    return response.json(result.rows[0]);
  } catch (error) {
    console.error("Database error:", error);
    return response.status(500).json({ error: "Error retrieving profile" });
  }
});

module.exports = router;
