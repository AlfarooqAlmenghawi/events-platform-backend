const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");

const SQL_DATABASE = require("../../database/connection.js");

router.get("/", async (request, response) => {
  try {
    const results = await SQL_DATABASE.query(
      "SELECT id, first_name, last_name, email, role, join_date, email_verified FROM users"
    );
    response.status(200).send(results.rows);
  } catch (error) {
    response.status(500).send("Error retrieving users from database");
  }
});

module.exports = router;
