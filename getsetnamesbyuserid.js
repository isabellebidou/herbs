const secret = require("./secret");
const utils = require("./utils");
const db = secret.db;

function getSetNamesByUserId(userId) {
  return new Promise((resolve, reject) => {
    let sql =
      "SELECT photoSet.photoSetId, photoSet.photoSetName FROM user INNER JOIN userPhotoSet ON user.userId = userPhotoSet.userId INNER JOIN photoSet ON userPhotoSet.photoSetId = photoSet.photoSetId WHERE user.userId =" +
      userId +
      " ORDER by photoSet.photoSetName ASC;";
    db.query(sql, async (err, setNames) => {
      try {
        if (err) throw err;
        resolve(setNames);
      } catch (e) {
        console.error(e);
      }
    });
  });
}

module.exports = {
  getSetNamesByUserId,
};
