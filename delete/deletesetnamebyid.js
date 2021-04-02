const secret = require("../secret");
const utils = require("../utils");
const db = secret.db;

async function deleteSetNameById(setName, id) {
  return new Promise((resolve, reject) => {
    try {

      let sql = "DELETE from userPhotoSet WHERE userId = "+
      id+ " AND photoSetId = "+setName;
        utils.log(sql);
        db.query(sql, async (err) => {
          //try {
          if (err) throw err;
          resolve("ok: " + sql);
        });

    } catch (e) {
      console.error(e);
      reject({
        rejectMessage: "failure: " + sql,
      });
    }
  });
}


module.exports = {
    deleteSetNameById,
};