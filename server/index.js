const express = require("express");
const router = express.Router();

const eventsRoutes = require("./routes/eventsRoutes.js");

router.use("/events", eventsRoutes);

module.exports = router;
