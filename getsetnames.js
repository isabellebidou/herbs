const secret = require("./secret");
const db = secret.db;

async function getSetNames() {
  return new Promise((resolve, reject) => {
   // let sql = "select * FROM photoSet; ";
    let sql = "SELECT * FROM `photoSet` ORDER by photoSetName ASC;";
    db.query(sql, async (err, names) => {
      try {
        if (err) throw err;
        resolve(names);
      } catch (e) {
        console.error(e);
      }
    });
  });
}

module.exports = {
  getSetNames,
};
