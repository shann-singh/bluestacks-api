const express = require("express");
const config = require("./utilities/config");
const videos = require("./router/videos");
const errorHandler = require("./utilities/errorHandler");
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to bluestacks-api");
});

app.use("/videos", videos);

app.use(errorHandler);
app.listen(config.port, () => {
  console.log(`Express server is listening on ${config.port}`);
});
