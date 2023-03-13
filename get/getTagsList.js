const secret = require("../secret");
const db = secret.db;
const utils = require("../utils");

function getTagsList() {

    return new Promise((resolve, reject) => {
        let sql = "SELECT distinct herbTags, herbName, herbNameFrench, herbNameChinese from herb";
         db.query(sql, async (err, list) => {
           try {
             if (err) throw err;
             const dataList = await utils.findTagsList(list);
             resolve(dataList);
           } catch (e) {
             utils.log(e)
           }
         });
       });

}

module.exports = {
    getTagsList,
};