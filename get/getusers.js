const secret = require("../secret");
const db = secret.db;

function getUsers() {

    return new Promise((resolve, reject) => {
        // let sql = "select * FROM photoSet; ";
        let sql = "SELECT * FROM user ORDER by userLastName ASC;";
         db.query(sql, async (err, users) => {
           try {
             if (err) throw err;
             resolve(users);
           } catch (e) {
             console.error(e);
           }
         });
       });

}

module.exports = {
  getUsers,
};
