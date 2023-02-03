const secret = require("../secret");
const db = secret.db;
const utils = require("../utils");
const dataflag = require("../models/dataflag.json");
//const getHerbPic = require("./getpicdata");



async function getGlobalGallery(flag) {
  return new Promise((resolve, reject) => {
    let sql = "select * FROM herb ORDER BY herbName ASC; "
    db.query(sql, async (err, gallery) => {
      try {
        if (err) throw err;


        await gallery.forEach(async (herb) => {
          herb.herbName = herb.herbName === "null" ? "" : herb.herbName;
          herb.herbCategory = herb.herbCategory === "null" ? "" : herb.herbCategory;
          herb.herbProperties = herb.herbProperties === "null" ? "" : herb.herbProperties;
          herb.herbNameLatin = herb.herbNameLatin === "null" ? "" : herb.herbNameLatin;
          herb.herbNameFrench = herb.herbNameFrench === "null" ? "" : herb.herbNameFrench;
          herb.herbNameChinese = herb.herbNameChinese === "null" ? "" : herb.herbNameChinese;
          herb.herbComments = herb.herbComments === "null" ? "" : herb.herbComments;
          if (flag === true) {
            herb.herbLinks = herb.herbLinks === "null" ? "" : utils.stringToArray(herb.herbLinks);
            herb.herbProducts = herb.herbProducts === "null" ? "" : utils.stringToArray(herb.herbProducts);
          } else {
            herb.herbLinks = herb.herbLinks === "null" ? "" : herb.herbLinks;
            herb.herbProducts = herb.herbProducts === "null" ? "" : herb.herbProducts;

          }
          herb.herbTags = herb.herbTags === "null" ? "" : herb.herbTags;
          herb.herbPicPath = herb.herbPicPath === "null" ? "" : herb.herbPicPath;
          herb.herbText = herb.herbText === "null" ? "" : herb.herbText;

        });

        //await mapPic(gallery);

        resolve(gallery);

      } catch (e) {
        console.error(e);
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

//not used
async function mapPic(g) {
  return new Promise((resolve, reject) => {
    g.map(async (herb) => {
      await getHerbPic.getHerbPic(herb.herbId).then(async (resolvePicData) => {
        herb.herbPicData = resolvePicData;
      })
    });

    resolve(g)

  });

}



module.exports = {
  getGlobalGallery,
};
