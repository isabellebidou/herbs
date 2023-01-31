const secret = require("../secret");
const db = secret.db;

function getHerbIdByname(name) {

    return new Promise((resolve, reject) => {
        let sql = "SELECT herbId FROM herb WHERE herbName = '"+name+"';";
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
    getHerbIdByname,
};