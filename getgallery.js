const secret = require("./secret");
const db = secret.db;

async function getGlobalGallery() {
  return new Promise((resolve, reject) => {
    let sql = "select * FROM photo ORDER BY photoId DESC; ";
    db.query(sql, async (err, gallery) => {
      try {
        if (err) throw err;
        resolve(gallery);
      } catch (e) {
        console.error(e);
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
