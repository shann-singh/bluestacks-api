const { google } = require("googleapis");
const config = require("../utilities/config");
const ApiError = require("../utilities/error");
const modal = require("../modal/modal");
const { get, set } = require("../modal/redis");
const moment = require("moment");

class Videos {
  constructor() {
    this.youtube = google.youtube({
      version: "v3",
      auth: config.googleAPIKey,
    });
  }

  async fetch(req, res, next) {
    const format = "YYYY-MM-DD HH:mm:ss";
    try {
      const { maxResults } = req.body;
      const list = await this.youtube.videos.list({
        part: "snippet",
        regionCode: "IN",
        chart: "mostPopular",
        type: "video",
        maxResults: maxResults,
      });
      if (list.data.items.length === 0) {
        res.status(200).json({
          newEntries: 0,
          duplicates: 0,
          message: "No videos fetched from YouTube",
        });
        return;
      } else {
        const videosList = list.data.items;
        const data = videosList.map((item, index) => {
          return [
            item.id,
            item.snippet.channelId,
            item.snippet.title,
            item.snippet.description,
            item.snippet.channelTitle,
            item.snippet.thumbnails.medium.url,
            moment(item.snippet.publishedAt).format(format),
          ];
        });
        const query = `INSERT INTO video
          (videoId, channelId, title, description, channelTitle, thumbnail, publishedAt)
          VALUES 
          ? ON DUPLICATE KEY UPDATE videoId=VALUES(videoId),
          channelId=VALUES(channelId),
          title=VALUES(title),
          description=VALUES(description),
          channelTitle=VALUES(channelTitle),
          thumbnail=VALUES(thumbnail),
          publishedAt=VALUES(publishedAt);`;
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
    const { page } = req.query;
    try {
      let query = `SELECT * FROM video 
        ORDER BY id DESC
        LIMIT 20
        OFFSET ?`;
      let data = [page * 20];
      const result = await modal.read(query, data);
      const resultsArr = result[0];
      res.status(200).json({
        list: resultsArr,
        message: "successfully fetch all the videos",
      });
    } catch (error) {
      next(ApiError.internal("something went wrong"));
    }
  }

  async details(req, res, next) {
    try {
      let { videoId } = req.query;
      const reply = await get(videoId).catch((err) => {
        if (err) console.error(err);
      });
      if (reply) {
        const json = JSON.parse(reply);
        res.status(200).json({
          videoDetail: json.videoDetail,
          channelDetail: json.channelDetail,
          message: "fetched video details successfully",
        });
        return;
      }
      const videoResult = await this.youtube.videos.list({
        part: "snippet, contentDetails, statistics",
        id: videoId,
        maxResults: 1,
      });
      const videoDetail = videoResult.data.items[0];
      const channelResult = await this.youtube.channels.list({
        part: "snippet, contentDetails, statistics",
        id: videoDetail.snippet.channelId,
        maxResults: 1,
      });
      const channelDetail = channelResult.data.items[0];
      await set(
        videoId,
        JSON.stringify({
          videoDetail: videoDetail,
          channelDetail: channelDetail,
        })
      ).catch((err) => {
        if (err) console.error(err);
      });
      res.status(200).json({
        videoDetail: videoDetail,
        channelDetail: channelDetail,
        message: "fetched video details successfully",
      });
    } catch (error) {
      console.log(error);
      next(ApiError.internal("something went wrong"));
    }
  }
}

module.exports = new Videos();
