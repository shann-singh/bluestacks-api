const connection = require("./mysql");

class Modal {
  async read(query, data) {
    const db = await connection();
    try {
      await db.query("START TRANSACTION");
      const result = await db.query(query, data);
      await db.query("COMMIT");
      return result;
    } catch (error) {
      await db.query("ROLLBACK");
      if (error.sqlMessage) {
        throw { sqlMessage: error.sqlMessage };
      } else {
        throw "Cannot check for avialble username. Something went wrong";
      }
    } finally {
      db.release();
      db.destroy();
    }
  }

  async insert(query, data) {
    const db = await connection();
    try {
      await db.query("START TRANSACTION");
      const result = await db.query(query, data);
      if (result) {
        await db.query("COMMIT");
        return result;
      } else {
        await db.query("ROLLBACK");
        return false;
      }
    } catch (error) {
      await db.query("ROLLBACK");
      if (error.sqlMessage) {
        throw { sqlMessage: error.sqlMessage };
      } else {
        throw "Cannot register user. Something went wrong";
      }
    } finally {
      db.release();
      db.destroy();
    }
  }
}

module.exports = new Modal();
