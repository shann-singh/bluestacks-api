const { google } = require("googleapis");
const config = require("../utilities/config");
const ApiError = require("../utilities/error");
const modal = require("../modal/modal");
const { get, set } = require("../modal/redis");
const moment = require("moment");

class Videos {
  // creates an instance of youtube api object using the API key
  constructor() {
    this.youtube = google.youtube({
      version: "v3",
      auth: config.googleAPIKey,
    });
  }
  // serves the /video/fetch-popular endpoint
  async fetch(req, res, next) {
    const format = "YYYY-MM-DD HH:mm:ss";
    try {
      const { maxResults } = req.body;
      // validation
      if (maxResults < 10) {
        let err = new Error("maxResults cannot be less than 10");
        err.maxResults = true;
        throw err;
      }
      if (maxResults > 50) {
        let err = new Error("maxResults cannot be more than 50");
        err.maxResults = true;
        throw err;
      }
      // fetching the list from youtube
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
        // saves them in database
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
        // calculates the new entries and duplicates updated
        // and sends the info back
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
      if (error.maxResults) {
        // if maxResults is less than 10 or more than 50
        next(ApiError.badRequest(error.message));
        return;
      }
      next(ApiError.internal(error.message));
    }
  }

  // serves the /videos/list-all endpoint
  async list(req, res, next) {
    // destructing the page query param
    const { page } = req.query;
    // retrieving 20 videos info at a time
    try {
      let query = `SELECT * FROM video 
        ORDER BY id DESC
        LIMIT 20
        OFFSET ?`;
      let data = [page * 20];
      const result = await modal.read(query, data);
      const resultsArr = result[0];
      // sends the result back to the user
      res.status(200).json({
        list: resultsArr,
        message: "successfully fetch all the videos",
      });
    } catch (error) {
      next(ApiError.internal("something went wrong"));
    }
  }

  // serves the /videos/video-details endpoint
  async details(req, res, next) {
    try {
      // destructing the videoId query param
      let { videoId } = req.query;
      // CACHING
      // checks for the videoId info in the redis first
      const reply = await get(videoId).catch((err) => {
        if (err) console.error(err);
      });
      // if info found in redis, sends that back to the user
      if (reply) {
        const json = JSON.parse(reply);
        res.status(200).json({
          videoDetail: json.videoDetail,
          channelDetail: json.channelDetail,
          message: "fetched video details successfully",
        });
        return;
      }
      // if no info is found in the cache, then get the info
      // from the YouTube api
      const videoResult = await this.youtube.videos.list({
        part: "snippet, contentDetails, statistics",
        id: videoId,
        maxResults: 1,
      });
      const videoDetail = videoResult.data.items[0];
      // get the channel info as well
      const channelResult = await this.youtube.channels.list({
        part: "snippet, contentDetails, statistics",
        id: videoDetail.snippet.channelId,
        maxResults: 1,
      });
      const channelDetail = channelResult.data.items[0];
      // set the obtained video and channel info in the cache
      // for a period of 10 mins
      // the key-value in the cache will expire automatically
      //  after 10 mins
      await set(
        videoId,
        JSON.stringify({
          videoDetail: videoDetail,
          channelDetail: channelDetail,
        }),
        "EX",
        10 * 60
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
