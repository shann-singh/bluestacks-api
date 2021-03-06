const express = require("express");
const router = express.Router();
const videosController = require("../controller/videos");

// to fetch most popular videos from the YouTube api
// accepts a maxResults parameter in the request body
router.post("/fetch-popular", (req, res, next) => {
  videosController.fetch(req, res, next);
});

router.get("/list-all", (req, res, next) => {
  videosController.list(req, res, next);
});

router.get("/video-details", (req, res, next) => {
  videosController.details(req, res, next);
});

module.exports = router;
