const secret = require("./secret");
const utils = require("./utils");
const db = secret.db;

async function getUserGallery(user) {
  return new Promise((resolve, reject) => {
    let sql =
      "select * FROM photo INNER JOIN photoSet ON photo.photoSetId = photoSet.photoSetId INNER JOIN userPhotoSet ON photoSet.photoSetId = userPhotoSet.photoSetId WHERE userPhotoSet.userId = " +
      user.userId +
      " ORDER BY photo.photoId DESC;";

    db.query(sql, async (err, gallery) => {
      try {
        if (err) throw err;
        resolve(gallery);
      } catch (e) {
        console.error(e);
        // reject({
        //   rejectGallery: require("./models/data.json"),
        //   rejectOffline: true,
        // });
      }
    });
  });
}

module.exports = {
  getUserGallery,
};
