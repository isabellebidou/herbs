const secret = require("../secret");
const db = secret.db;
const utils = require("../utils");

async function getEmails(email) {
  return new Promise((resolve, reject) => {
    // let sql = "select * FROM photoSet; ";
    try {
      let sql = "SELECT userEmail FROM user WHERE userEmail = '" + email + "';";
      db.query(sql, (err, emails) => {
        if (err) throw err;
        if (emails.length == 0) resolve(true);
        else reject(false);
      });
    } catch (e) {
      utils.log(e)
      
    }
  });
}

module.exports = {
  getEmails,
};
