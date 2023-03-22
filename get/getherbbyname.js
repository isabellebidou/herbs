const secret = require("../secret");
const db = secret.db;
const utils = require("../utils");

function getHerbByName(name) {
    return new Promise((resolve, reject) => {
        let sql = `SELECT * FROM herb WHERE herbName = "${name}";`;
         db.query(sql, async (err, herb) => {
           try {
             if (err) throw err;
             resolve(herb);
           } catch (e) {
             utils.log(e)
           }
         });
       });
}

module.exports = {
    getHerbByName,
};