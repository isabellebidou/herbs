const secret = require("../secret");
const db = secret.db;
const utils = require("../utils");
const dataflag = require("../models/dataflag.json");




async function getGlobalGallery(flag) {
  return new Promise((resolve, reject) => {
    let sql = "select herbId, herbName, herbNameFrench, herbNameLatin, herbNameChinese,herbCategory, herbProperties, herbTags , herbPicPath FROM herb ORDER BY herbName ASC; "
    db.query(sql, async (err, gallery) => {
      try {
        if (err) throw err;
        /*for (let pic of gallery) {
          pic.imageUrl = await getObjectSignedUrl("plantpics/" + pic.herbPicPath )
        }*/
        resolve(gallery);

      } catch (e) {
        utils.log(e)
        if (flag === true)
          reject({
            rejectGallery: dataflag,
            rejectOffline: true,
          });
        else
          reject({
            rejectGallery: require("../models/data.json"),
            rejectOffline: true,
          });
      }
    });
  });
}



module.exports = {
  getGlobalGallery,
};
