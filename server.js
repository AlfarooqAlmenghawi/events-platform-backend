const express = require("express");
const app = express();
const cors = require("cors");

app.use(
  cors({
    origin: "*",
    credentials: true, // include this if you're using cookies or authorization headers
  })
);

const ENV = process.env.NODE_ENV || "development";
require("dotenv").config({
  path: `${__dirname}/.env.${ENV}`,
});

const routes = require("./server/index.js");

app.use(express.json());

// Now we can use the routes we defined in index.js by using the /api prefix in our requests to the server
app.use("/", routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
