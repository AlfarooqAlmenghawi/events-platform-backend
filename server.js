const express = require("express");
const app = express();
require("dotenv").config();

const routes = require("./server/index.js");

app.use(express.json());

// Now we can use the routes we defined in index.js by using the /api prefix in our requests to the server
app.use("/", routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
