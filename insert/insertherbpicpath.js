const secret = require("../secret");
const utils = require("../utils");
const db = secret.db;

async function insertHerbPicPath(picPath, herbId) {
  return new Promise((resolve, reject) => {

    try {
        let sql =
          'UPDATE herb SET herbPicPath ="' + picPath + '" WHERE herbId = ' + herbId + ';';
        utils.log(sql);
        db.query(sql, (err) => {
            if (err) throw err;
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
  insertHerbPicPath,
};
