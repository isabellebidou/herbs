const secret = require("../secret");
const db = secret.db;
const utils = require("../utils");

function getHerbById(id) {

    return new Promise((resolve, reject) => {
        let sql = "SELECT * FROM herb WHERE herbId = "+id+";";
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
    getHerbById,
};