const redis = require("redis");
const config = require("../utilities/config");
const { promisify } = require("util");

const client = redis.createClient({
  // host: config.redis.host,
  // port: config.redis.port,
  // password: config.redis.password,
  url: config.redis.url,
});

client.on("connect", () => {
  console.log("connected to redis server");
});

client.on("error", (error) => {
  console.log(error.message);
});

const get = promisify(client.get).bind(client);
const set = promisify(client.set).bind(client);
const getList = promisify(client.lrange).bind(client);

module.exports = {
  get,
  set,
  getList,
};
