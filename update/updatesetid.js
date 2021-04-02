const secret = require("../secret");
const utils = require("../utils");
const db = secret.db;

async function updateSetIdInPhotoTable(photoId, setNameId) {
  return new Promise((resolve, reject) => {
    utils.log("photoId, setNameId");
    utils.log(photoId + "  " + setNameId);
    try {
      let sql =
        'UPDATE photo SET photosetID = "' +
        setNameId +
        '" WHERE photoID = "' +
        photoId +
        '";';
      utils.log(sql);
      db.query(sql, async (err) => {
        //try {
        if (err) throw err;
        resolve("ok: " + sql);
      });
    } catch (e) {
      console.error(e);
    }
  });
}

module.exports = {
  updateSetIdInPhotoTable,
};
