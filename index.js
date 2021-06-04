const express = require("express");
const config = require("./utilities/config");
const { log } = require("./utilities/logger");
const app = express();

app.get("/", (req, res) => {
  res.send("Welcome to bluestacks-api");
});

app.listen(config.port, () => {
  console.log(`Express server is listening on ${config.port}`);
});
