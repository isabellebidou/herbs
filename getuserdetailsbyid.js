const secret = require("./secret");
const db = secret.db;

function getUserDetails(id) {

    return new Promise((resolve, reject) => {
        // let sql = "select * FROM photoSet; ";
        let sql = "SELECT * FROM user WHERE user.userid = "+ id+ " ;";
         db.query(sql, async (err, user) => {
           try {
             if (err) throw err;
             resolve(user);
           } catch (e) {
             console.error(e);
           }
         });
       });

}

module.exports = {
    getUserDetails,
};