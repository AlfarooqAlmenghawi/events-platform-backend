const express = require("express");
const router = express.Router();

const SQL_DATABASE = require("../../database/connection.js");
const authenticateJWT = require("../../utils/authenticateJWT.js");

router.get("/", async (request, response) => {
  try {
    const results = await SQL_DATABASE.query("SELECT * FROM events");
    response.status(200).send(results.rows);
  } catch (error) {
    response.status(500).send("Error retrieving events from database");
  }
});

router.post("/", authenticateJWT, async (request, response) => {
  try {
    const {
      event_title,
      event_description,
      event_date,
      event_location,
      event_organizer,
      event_organizer_phone,
      event_organizer_website,
    } = request.body;

    const data = {
      event_title,
      event_description,
      event_date,
      event_location,
      event_organizer,
      event_organizer_email: request.user.email,
      event_organizer_phone,
      event_organizer_website,
    };

    console.log("Data received:", data);

    if (request.user.role !== "staff") {
      return response.status(403).send("Only staff can create events");
    }

    await SQL_DATABASE.query(
      "INSERT INTO events (event_title, event_description, event_date, event_location, event_organizer, event_organizer_email, event_organizer_phone, event_organizer_website) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
      [
        data.event_title,
        data.event_description,
        data.event_date,
        data.event_location,
        data.event_organizer,
        data.event_organizer_email,
        data.event_organizer_phone,
        data.event_organizer_website,
      ]
    );
    // response.status(200).send(request.user.role);
    response.status(201).send("Event created successfully");
  } catch (error) {
    console.error("Error creating event:", error);

    if (error.code === "23505") {
      // Unique violation error code
      return response.status(409).send("Event already exists");
    }
    if (error.code === "23502") {
      // Not null violation error code
      return response.status(400).send("Missing required fields");
    }

    response.status(500).send("Error creating event");
  }
});

module.exports = router;
