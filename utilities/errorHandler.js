const ApiError = require("./error");

function errorHandler(err, req, res, next) {
  // if error is found to be an instance of available
  //  erros in error.js the this or else 500
  if (err instanceof ApiError) {
    res.status(err.code).json({ message: err.message });
    return;
  }
  res.status(500).json({ message: "something went wrong" });
}

module.exports = errorHandler;
