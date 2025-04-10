const express = require("express");
const router = express.Router();

const eventsRoutes = require("./routes/eventsRoutes.js");
const usersRoutes = require("./routes/usersRoutes.js");

router.use("/events", eventsRoutes);
router.use("/users", usersRoutes);

module.exports = router;
