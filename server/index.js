const express = require("express");
const router = express.Router();

const authenticationRoutes = require("./routes/authenticationRoutes.js");
const eventsRoutes = require("./routes/eventsRoutes.js");
const usersRoutes = require("./routes/usersRoutes.js");

router.use("/", authenticationRoutes);
router.use("/events", eventsRoutes);
router.use("/users", usersRoutes);

module.exports = router;
