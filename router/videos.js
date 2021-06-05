const express = require("express");
const router = express.Router();
const videosController = require("../controller/videos");

router.get("/fetch-popular", (req, res, next) => {
  videosController.fetch(req, res, next);
});

module.exports = router;
