const secret = require("../secret");
const db = secret.db;

function getHerbById(id) {

    return new Promise((resolve, reject) => {
        let sql = "SELECT * FROM herb WHERE herbId = "+id+";";
         db.query(sql, async (err, herb) => {
           try {
             if (err) throw err;
             resolve(herb);
           } catch (e) {
             console.error(e);
           }
         });
       });

}

module.exports = {
    getHerbById,
};