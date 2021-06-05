const {createPool} = require("mysql2/promise");
const config = require("../utilities/config");

const connection = async () => {
  try {
    const pool = createPool({
      connectionLimit: config.mysql.connectionLimit,
      host: config.mysql.host,
      port: config.mysql.port,
      user: config.mysql.user,
      password: config.mysql.password,
      database: config.mysql.database,
    });
    try {
      const connection = await pool.getConnection();
      console.log(`mysql connection established, connection ID : ${connection.threadId}`)
      return connection;
    } catch (error) {
      throw error;
    }
  } catch (error) {
    throw error;
  }
};

module.exports = connection;
