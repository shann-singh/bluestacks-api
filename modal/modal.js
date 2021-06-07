const connection = require("./mysql");

class Modal {
  // read query transaction
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
        let err = new Error();
        err.sqlMessage = error.sqlMessage;
        throw err;
      } else {
        throw "Something went wrong";
      }
    } finally {
      db.release();
      db.destroy();
    }
  }

  // write query transaction
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
        let err = new Error();
        err.sqlMessage = error.sqlMessage;
        throw err;
      } else {
        throw "Something went wrong";
      }
    } finally {
      db.release();
      db.destroy();
    }
  }
}

module.exports = new Modal();
