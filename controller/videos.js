const { google } = require("googleapis");
const config = require("../utilities/config");
const ApiError = require("../utilities/error");
const modal = require("../modal/modal");

class Videos {
  constructor() {
    this.youtube = google.youtube({
      version: "v3",
      auth: config.googleAPIKey,
    });
  }

  async fetch(req, res, next) {
    try {
      const { maxResults } = req.body;
      const list = await this.youtube.search.list({
        regionCode: "in",
        part: "snippet",
        chart: "mostPopular",
        type: "video",
        maxResults: maxResults,
      });
      if (list.data.items.length === 0) {
        //
      } else {
        const videosList = list.data.items;
        const data = videosList.map((item, index) => {
          return [
            item.id.videoId,
            item.snippet.channelId,
            item.snippet.title,
            item.snippet.description,
            item.snippet.channelTitle,
            item.snippet.thumbnails.default.url,
            item.snippet.publishedAt,
          ];
        });
        const query = `INSERT INTO video
          (videoId, channelId, title, description, channelTitle, thumbnail, publishedAt)
          VALUES 
          ? ON DUPLICATE KEY UPDATE videoId=videoId;`;
        const result = await modal.insert(query, [data]);
        if (!result) {
          ApiError.internal("Cannot update DB with updated videos list");
        }
        const info = result[0].info.split("  ");
        const duplicates = parseInt(info[1].split(":")[1]);
        const newEntries = result[0].affectedRows - duplicates;
        res.status(200).json({
          newEntries: newEntries,
          duplicates: duplicates,
          message: "videos list updated",
        });
      }
    } catch (error) {
      next(ApiError.internal(error.message));
    }
  }

  async list(req, res, next) {
    try {
    } catch (error) {}
  }
  async details(req, res, next) {}
}

module.exports = new Videos();
