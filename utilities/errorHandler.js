const ApiError = require("./error");

function errorHandler(err, req, res, next) {
  console.log(err);
  if (err instanceof ApiError) {
    res.status(err.code).json({ message: err.message });
    return;
  }
  console.log(err);
  res.status(500).json({ message: "something went wrong" });
}

module.exports = errorHandler;
