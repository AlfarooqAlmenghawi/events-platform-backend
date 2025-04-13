const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");

const SQL_DATABASE = require("../../database/connection.js");
const authenticateJWT = require("../../utils/authenticateJWT.js");

router.get("/", async (request, response) => {
  try {
    const results = await SQL_DATABASE.query(
      "SELECT id, first_name, last_name, email, join_date, email_verified FROM users"
    );
    response.status(200).send(results.rows);
  } catch (error) {
    response.status(500).send("Error retrieving users from database");
  }
});

router.get("/:id/events", authenticateJWT, async (request, response) => {
  try {
    const { id } = request.params;

    const result = await SQL_DATABASE.query(
      `
      SELECT e.*
      FROM events e
      JOIN user_events ue ON e.id = ue.event_id
      WHERE ue.user_id = $1
    `,
      [id]
    );

    if (result.rowCount === 0) {
      return response.status(404).send("No events found for this user");
    }

    response.status(200).json({ user: request.user, events: result.rows });
  } catch (error) {
    console.log("Error retrieving user's events:", error);
    response.status(500).send("Error retrieving user's events");
  }
});

module.exports = router;
