const dotenv = require('dotenv')
dotenv.config(__dirname + "/.env");

const config = {
  port: process.env.PORT || 3001,
  googleAPIKey: process.env.GOOGLE_API_KEY,
  mysql: {
    connectionLimit: process.env.MS_CONNECTION_LIMIT,
    host: process.env.MS_HOST,
    port: process.env.MS_PORT,
    user: process.env.MS_USER,
    password: process.env.MS_PWD,
    database: process.env.MS_DB,
  },
  redis: {
    host: process.env.REDIS_HOST,
    port:process.env.REDIS_PORT,
    password:process.env.REDIS_PASSWORD,
    url: process.env.REDIS_URL
  }
};

module.exports = config;
