const bunyan = require("bunyan");

const log = bunyan.createLogger({
  name: "api",
  level: "debug",
  streams: [
    {
      type: "rotating-file",
      path: __dirname + "/../logs/api.log",
      period: "1w", // weekly rotation
      count: 5, // keep 5 back copies
    },
  ],
});

module.exports = { log };
