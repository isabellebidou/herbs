const secret = require("./secret");
const utils = require("./utils");
const db = secret.db;

async function insertSetNamesIntoSetNamesTable(setNames) {
  return new Promise((resolve, reject) => {
    utils.log("setNames.length");
    utils.log(setNames.length);
    try {
      for (var i = 0; i < setNames.length; i++) {
        var photoSetName = setNames[i];
        let sql =
          'INSERT INTO photoSet (photosetName) VALUE ("' + photoSetName + '");';
        utils.log(sql);
        db.query(sql, async (err) => {
          //try {
          if (err) throw err;
          resolve("ok: " + sql);
        });
      }
    } catch (e) {
      console.error(e);
      reject({
        rejectMessage: "failure: " + sql,
      });
    }
  });
}

module.exports = {
  insertSetNamesIntoSetNamesTable,
};
