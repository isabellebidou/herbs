const secret = require("../secret");
const utils = require("../utils").default;
const db = secret.db;

async function insertHerbPic(picId, herbId) {
  return new Promise((resolve, reject) => {

    try {
        let sql =
          'UPDATE herb SET herbPic ="' + picId + '" WHERE herbId = ' + herbId + ';';
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
  insertHerbPic,
};
