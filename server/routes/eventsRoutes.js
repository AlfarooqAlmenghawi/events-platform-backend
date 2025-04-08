const express = require("express");
const router = express.Router();

const SQL_DATABASE = require("../../database/connection.js");

router.get("/", async (request, response) => {
  try {
    const results = await SQL_DATABASE.query("SELECT * FROM events");
    response.status(200).send(results.rows);
  } catch (error) {
    response.status(500).send("Error retrieving events from database");
  }
});

module.exports = router;
