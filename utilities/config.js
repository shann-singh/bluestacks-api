const dotenv = require('dotenv')
dotenv.config(__dirname + "/.env");

const config = {
  port: process.env.PORT,
  googleAPIKey: process.env.GOOGLE_API_KEY,
  mysql: {
    connectionLimit: process.env.MS_CONNECTION_LIMIT,
    host: process.env.MS_HOST,
    port: process.env.MS_PORT,
    user: process.env.MS_USER,
    password: process.env.MS_PWD,
    database: process.env.MS_DB,
  }
};

module.exports = config;
