const express = require("express");
const config = require("./utilities/config");
const videos = require("./router/videos");
const errorHandler = require("./utilities/errorHandler");
const cors = require("cors");
const app = express();

// cors and json parsing in the req body
app.use(cors());
app.use(express.json());

// a welcome message
app.get("/", (req, res) => {
  res.send("Welcome to bluestacks-api");
});

// all the /video request is handled by the next middleware
app.use("/videos", videos);

// every request if not returned before, 
// goes through the errorHandler middleware
app.use(errorHandler);

// starts the api
app.listen(config.port, () => {
  console.log(`Express server is listening on ${config.port}`);
});
