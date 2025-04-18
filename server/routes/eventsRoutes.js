const express = require("express");
const router = express.Router();

const SQL_DATABASE = require("../../database/connection.js");
const authenticateJWT = require("../../utils/authenticateJWT.js");
const optionalCheckIfSignedInJWT = require("../../utils/optionalCheckIfSignedInJWT.js");
const e = require("express");

router.get("/", async (request, response) => {
  try {
    const results = await SQL_DATABASE.query("SELECT * FROM events");
    response.status(200).send(results.rows);
  } catch (error) {
    response.status(500).send("Error retrieving events from database");
  }
});

router.get("/:id", optionalCheckIfSignedInJWT, async (request, response) => {
  try {
    const { id } = request.params;

    const result = await SQL_DATABASE.query(
      "SELECT * FROM events WHERE id = $1",
      [id]
    );

    if (result.rowCount === 0) {
      return response.status(404).send("Event not found");
    }

    // Check if user is signed up for the event
    const userId = request.user ? request.user.id : null;
    if (userId) {
      const userEventResult = await SQL_DATABASE.query(
        "SELECT * FROM user_events WHERE user_id = $1 AND event_id = $2",
        [userId, id]
      );
      if (userEventResult.rowCount > 0) {
        result.rows[0].is_signed_up = true;
      } else {
        result.rows[0].is_signed_up = false;
      }

      if (result.rows[0].event_organizer_email === request.user.email) {
        result.rows[0].is_owner = true;
      } else {
        result.rows[0].is_owner = false;
      }
    } else {
      result.rows[0].is_signed_up = false;
      result.rows[0].is_owner = false;
    }

    // Check if the user is the event organizer

    response.status(200).send(result.rows[0]);
  } catch (error) {
    response.status(500).send("Error retrieving event");
  }
});

router.post("/", authenticateJWT, async (request, response) => {
  try {
    const {
      event_title,
      event_description,
      event_date,
      event_location,
      event_organizer_phone,
      event_organizer_website,
      event_date_end,
    } = request.body;

    const data = {
      event_title,
      event_description,
      event_date,
      event_location,
      event_organizer: request.user.first_name + " " + request.user.last_name,
      event_organizer_email: request.user.email,
      event_organizer_phone,
      event_organizer_website,
      event_date_end,
    };

    const results = await SQL_DATABASE.query(
      "INSERT INTO events (event_title, event_description, event_date, event_location, event_organizer, event_organizer_email, event_organizer_phone, event_organizer_website, event_date_end) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *",
      [
        data.event_title,
        data.event_description,
        data.event_date,
        data.event_location,
        data.event_organizer,
        data.event_organizer_email,
        data.event_organizer_phone,
        data.event_organizer_website,
        data.event_date_end,
      ]
    );
    response.status(201).send(results.rows[0]);
  } catch (error) {
    if (error.code === "23505") {
      // Unique violation error code
      return response.status(409).send("Event already exists");
    }
    if (error.code === "23502") {
      // Not null violation error code
      return response.status(400).send("Missing required fields");
    }
    if (error.code === "22001") {
      // String data, right truncation error code
      return response.status(400).send("Data too long for one of the fields");
    }
    console.error("Error creating event:", error);
    response.status(500).send("Error creating event");
  }
});

router.delete("/:id", authenticateJWT, async (request, response) => {
  try {
    const { id } = request.params;

    const eventToDelete = await SQL_DATABASE.query(
      "SELECT * FROM events WHERE id = $1",
      [id]
    );

    if (eventToDelete.rowCount === 0) {
      return response.status(404).send("Event not found");
    }

    // Check if the user is the event organizer
    // Assuming the event_organizer_email is stored in the database
    // and matches the user's email

    if (eventToDelete.rows[0].event_organizer_email !== request.user.email) {
      return response
        .status(403)
        .send("You are not authorized to delete this event");
    }

    if (eventToDelete.rowCount === 0) {
      console.log("Event not found");
      return response.status(404).send("Event not found");
    }

    const result = await SQL_DATABASE.query(
      "DELETE FROM events WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rowCount === 0) {
      return response.status(404).send("Event not found");
    }

    response.status(200).send("Event deleted successfully");
  } catch (error) {
    response.status(500).send("Error deleting event");
  }
});

router.put("/:id", authenticateJWT, async (request, response) => {
  try {
    const { id } = request.params;
    const {
      event_title,
      event_description,
      event_date,
      event_location,
      event_organizer_phone,
      event_organizer_website,
    } = request.body;

    const eventToUpdate = await SQL_DATABASE.query(
      "SELECT * FROM events WHERE id = $1",
      [id]
    );

    if (eventToUpdate.rows[0].event_organizer_email !== request.user.email) {
      return response
        .status(403)
        .send("You are not authorized to touch this event");
    }

    const result = await SQL_DATABASE.query(
      "UPDATE events SET event_title = $1, event_description = $2, event_date = $3, event_location = $4, event_organizer_phone = $5, event_organizer_website = $6 WHERE id = $7 RETURNING *",
      [
        event_title,
        event_description,
        event_date,
        event_location,
        event_organizer_phone,
        event_organizer_website,
        id,
      ]
    );

    if (result.rowCount === 0) {
      return response.status(404).send("Event not found");
    }

    response.status(200).send("Event updated successfully");
  } catch (error) {
    if (error.code === "23505") {
      return response.status(409).send("Event already exists");
    }

    response.status(500).send("Error updating event");
  }
});

router.get("/:id/attendees", async (request, response) => {
  try {
    const { id } = request.params;

    const result = await SQL_DATABASE.query(
      `
      SELECT u.id, u.first_name, u.last_name, u.email, u.join_date, u.email_verified
      FROM users u
      JOIN user_events ue ON u.id = ue.user_id
      WHERE ue.event_id = $1
    `,
      [id]
    );

    // Remove this check if you want to return an empty array instead of a 404, in this case we want to do so to handle empty arrays in the frontend
    // if (result.rowCount === 0) {
    //   return response.status(404).send("No attendees found for this event");
    // }

    response.status(200).json(result.rows);
  } catch (error) {
    console.log("Error retrieving event's attendees:", error);
    response.status(500).send("Error retrieving event's attendees");
  }
});

router.delete(
  "/:id/attendees/:attendee_id",
  authenticateJWT,
  async (request, response) => {
    try {
      const { id, attendee_id } = request.params;

      // Check if the user is the event organizer
      const eventToUpdate = await SQL_DATABASE.query(
        "SELECT * FROM events WHERE id = $1",
        [id]
      );

      if (eventToUpdate.rows[0].event_organizer_email !== request.user.email) {
        return response
          .status(403)
          .send("You are not authorized to remove attendees from this event");
      }

      const result = await SQL_DATABASE.query(
        `
      DELETE FROM user_events
      WHERE event_id = $1 AND user_id = $2
      RETURNING *
    `,
        [id, attendee_id]
      );

      if (result.rowCount === 0) {
        return response.status(404).send("Attendee not found");
      }

      response.status(200).send("Attendee removed successfully");
    } catch (error) {
      console.error("Error removing attendee:", error);
      response.status(500).send("Error removing attendee");
    }
  }
);

router.post("/:id/signup", authenticateJWT, async (request, response) => {
  try {
    const user_id = request.user.id;
    const event_id = request.params.id;

    const result = await SQL_DATABASE.query(
      `
      INSERT INTO user_events (user_id, event_id)
      VALUES ($1, $2)
      ON CONFLICT DO NOTHING
      RETURNING *
    `,
      [user_id, event_id]
    );

    if (result.rowCount === 0) {
      return response.status(409).send("User already signed up for this event");
    }

    return response.status(201).json({ message: "Signup successful" });
  } catch (err) {
    return response.status(500).json({ error: "Signup failed" });
  }
});

router.delete("/:id/signup", authenticateJWT, async (request, response) => {
  try {
    const user_id = request.user.id;
    const event_id = request.params.id;

    const result = await SQL_DATABASE.query(
      `
        DELETE FROM user_events
        WHERE user_id = $1 AND event_id = $2
        RETURNING *
      `,
      [user_id, event_id]
    );

    if (result.rowCount === 0) {
      return response.status(404).send("User not signed up for this event");
    }

    return response.status(200).json({ message: "Unsignup successful" });
  } catch (err) {
    return response.status(500).json({ error: "Unsignup failed" });
  }
});

module.exports = router;
