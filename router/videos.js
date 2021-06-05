const express = require("express");
const router = express.Router();
const videosController = require("../controller/videos");

router.get("/fetch-popular", (req, res, next) => {
  videosController.fetch(req, res, next);
});

router.get("/videos-list", (req, res, next) => {
  videosController.list(req, res, next);
});

router.get("/video-details", (req, res, next) => {
  videosController.details(req, res, next);
});

module.exports = router;
