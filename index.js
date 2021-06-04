const express = require("express");
const config = require("./utilities/config");
const { log } = require("./utilities/logger");
const app = express();

app.listen(config.port, () => {
  console.log(`Express server is listening on ${config.port}`);
});
