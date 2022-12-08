const secret = require("../secret");
const db = secret.db;
const utils = require("../utils");

async function getGlobalGallery(flag) {
  return new Promise((resolve, reject) => {
    let sql = "select * FROM herb ORDER BY herbName ASC; "
    db.query(sql, async (err, gallery) => {
      try {
        if (err) throw err;
        
          gallery.forEach((herb) => {
            herb.herbName = herb.herbName === "null"? "" : herb.herbName;
            herb.herbCategory = herb.herbCategory === "null"? "" : herb.herbCategory;
            herb.herbProperties = herb.herbProperties === "null"? "" : herb.herbProperties;
            herb.herbNameLatin = herb.herbNameLatin === "null"? "" : herb.herbNameLatin;
            herb.herbNameFrench = herb.herbNameFrench === "null"? "" : herb.herbNameFrench;
            herb.herbNameChinese = herb.herbNameChinese === "null"? "" : herb.herbNameChinese;
            herb.herbComments = herb.herbComments === "null"? "" : herb.herbComments;
            if (flag === true) {
            herb.herbLinks = herb.herbLinks === "null"? "": utils.stringToArray(herb.herbLinks);
            herb.herbProducts = herb.herbProducts === "null"? "": utils.stringToArray(herb.herbProducts);
            } else {
              herb.herbLinks = herb.herbLinks === "null"? "": herb.herbLinks;
              herb.herbProducts = herb.herbProducts === "null"? "": herb.herbProducts;

            }
            herb.herbComments = herb.herbComments === "null"? "" : herb.herbComments;
            herb.herbTags = herb.herbTags === "null"? "" : herb.herbTags;
          });
        

        resolve(gallery);
      } catch (e) {
        console.error(e);
        if (flag === true)
        reject({
          rejectGallery: require("./models/dataflag.json"),
          rejectOffline: true,
        });
        else
        reject({
          rejectGallery: require("./models/data.json"),
          rejectOffline: true,
        });
      }
    });
  });
}





module.exports = {
  getGlobalGallery,
};
