const express = require("express");
const router = express.Router();
const upload = require("../storage-config");
const utils = require("../utils");
const secret = require("../secret");
const getGallery = require("../getgallery");
var message = "";
// toggle to use
// const { findPhotoSetValues } = require("../utils");
// const { insertSetNamesIntoSetNamesTable } = require("../insertsetnames");
// const { getSetNames } = require("../getsetnames");
// const { updateSetIdInPhotoTable  } = require("../updatesetId");
const db = secret.db;
const fs = require("fs");
//var bodyParser = require("body-parser");
router.get("/uploadjson", function (req, res) {
  res.render("uploadjson");
});

router.post("/uploadjson", upload.single("json"), (req, res) => {
  utils.log(req.file.originalname);
  utils.log(req.file.filename);
  var newPhotos = require(`../models/${req.file.filename}`);
  var jsonIsValid = true;
  try {
    JSON.parse(newPhotos);
  } catch (e) {
    jsonIsValid = false;
    // res.render(`${e} : ${req.file.filename} is not valid`);
    utils.log(`${req.file.filename} is not valid`);
  }
  //if (jsonIsValid) {
  for (i = 0; i < newPhotos.length; i++) {
    let photo = newPhotos[i];
    let sql =
      'INSERT INTO photo (photoName, photoThumbnail, photoCategory, photoCountry, photoPlace, photoYear,photoComments, photoTags, photoPath) VALUES ("' +
      photo.name +
      '","' +
      photo.thumbnail +
      '","' +
      photo.category +
      '","' +
      photo.country +
      '","' +
      photo.place +
      '","' +
      photo.year +
      '","' +
      photo.comments +
      '","' +
      photo.tags +
      '","' +
      "http://isabellebidou.com/images/" +
      photo.name +
      '");';
    db.query(sql, (err, res1) => {
      if (err) throw err;
      console.error(res1);
    });
  }
  //}
  try {
    fs.unlinkSync(`../models/${req.file.filename}`);
  } catch (error) {
    console.error(error);
  }

  res.redirect("/gallery");
  //return res.json({ status: 'OK' });
});

router.post("/updatedb", async (req, res) => {
  try {
    let sql = req.body.sql;
    db.query(sql, (err, res1) => {
      if (err) res.render(err.toString());
      //  else res.send(`status ok: ${JSON.stringify(res1)}`);
      else {
        message = `status ok: ${JSON.stringify(res1)}`;
        res.render("updatedb", {
          message: message,
        });
      }
      utils.log(sql);
      utils.log(res1);
    });
  } catch (error) {
    res.render(error);
  }
});

router.get("/updatedb", function (req, res) {
  res.render("updatedb", {
    message: message,
  });
});
router.get("/dbintojson", function (req, res) {
  const fs = require("fs");
  let sql = "select * FROM photo ORDER BY photoId DESC; ";
  db.query(sql, async (err, gallery) => {
    try {
      if (err) throw err;
      var data = JSON.stringify(gallery);
      fs.writeFileSync("./models/data.json", data);
    } catch (e) {
      console.error(e);
    }
  });
});
// no longer used
router.get("/uploadphotos/", utils.checkAuthenticated, function (req, res) {
  for (i = 54; i < gallery.length; i++) {
    let photo = gallery[i];
    let sql =
      'INSERT INTO photo (photoName, photoThumbnail, photoCategory, photoCountry, photoPlace, photoYear,photoComments, photoTags, photoPath) VALUES ("' +
      photo.name +
      '","' +
      photo.thumbnail +
      '","' +
      photo.category +
      '","' +
      photo.country +
      '","' +
      photo.place +
      '","' +
      photo.year +
      '","' +
      photo.comments +
      '","' +
      photo.tags +
      '","' +
      "http://isabellebidou.com/images/" +
      photo.name +
      '");';
    db.query(sql, (err, res1) => {
      if (err) throw err;
      console.error(res1);
    });
  }
  res.redirect("/");
});
// this is used  exceptionally
// router.get("/creategrouptable", function (req, res) {
//   let sql =
//     "CREATE TABLE photoSet (photoSetId int NOT NULL AUTO_INCREMENT PRIMARY KEY, photoSetName varchar(255)";
//   let query = db.query(sql, (err, res) => {
//     if (err) throw err;
//   });
// });

// router.get("/insertphotosetvalues/", async function (req, res) {
//   // get gallery
//   try {
//     await getGallery
//       .getGlobalGallery()
//       .then(async (resolveGallery) => {
//         try {
//           // get photoset names
//           await findPhotoSetValues(resolveGallery).then(
//             async (resolveSetNames) => {
//               utils.log(resolveSetNames);
//               insertSetNamesIntoSetNamesTable(resolveSetNames);
//             }
//           );

//         } catch (error) {
//           console.error(error);
//         }
//       })
//       .catch(async (error) => {
//         console.error(error);
//       });
//   } catch (e) {
//     console.error(e);
//   }
// });

// insert names for each existing photo in photo table
// router.get( "/updatephotosetvalues", async (req,res) => {
//   var gallery = [];

//    // get gallery
//    try {
//     await getGallery
//       .getGlobalGallery()
//       .then(async (resolveGallery) => {
//         gallery = resolveGallery
//         await getSetNames().then(
//           async (resolveSetNames) => {
//             try {
//               const setNamesArray = resolveSetNames
//               var setNamesMap = new Map(setNamesArray.map(j => [j.photoSetId, j.photoSetName]));
//               //utils.log(setNamesMap)
//               //for (var i = 0; i < 5; i++ ){
//               for (var i = 0; i < gallery.length; i++ ){
//                 const photo = gallery[i]
//                 const setNameId = utils.getKey(utils.stripPhotoName(photo.photoName), setNamesMap)
//                 //utils.log(setNameId)
//                 updateSetIdInPhotoTable(photo.photoId, setNameId)
//               }
//             } catch (error) {
//               console.error(error);
//             }
//           }
//         )
//       })
//       .catch(async (error) => {
//         console.error(error);
//       });
//   } catch (e) {
//     console.error(e);
//   }

//   // for each photo in gallery update photosetvalue

// });
let sql =
  "CREATE TABLE userPhotoSet (userPhotoSet int NOT NULL AUTO_INCREMENT PRIMARY KEY, userId int(255),photoSetId int(255),FOREIGN KEY (userId) REFERENCES user(userId), FOREIGN KEY (photoSetId) REFERENCES photoSet(photoSetId))";

router.get("/createphototable", function (req, res) {
  //name, thumbnail, category, country, place, comments, tags, path
  let sql =
    "CREATE TABLE photo (photoId int NOT NULL AUTO_INCREMENT PRIMARY KEY, photoName varchar(255), photoThumbnail varchar(255), photoCategory varchar(255),  photoCountry varchar(255),  photoPlace varchar(255), photoComments varchar(255), photoTags varchar(255), photoPath varchar(255));";
  let query = db.query(sql, (err, res) => {
    if (err) throw err;
  });
});
router.get("/createusertable", function (req, res) {
  let sql =
    "CREATE TABLE user (userId int NOT NULL AUTO_INCREMENT PRIMARY KEY, userFirstName varchar(255), userLastName varchar(255),userEmail varchar(255), userPassword varchar(255));";
  let query = db.query(sql, (err, res) => {
    if (err) throw err;
  });
});
router.post(
  "/uploadphoto/:index",
  utils.checkAuthenticated,
  function (req, res) {
    let sql =
      'INSERT INTO photo (photoName, photoThumbnail, photoCategory, photoCountry, photoPlace, photoComments, photoTags, photoPath) VALUES ("' +
      req.body.name +
      '","' +
      req.body.thumbnail +
      '","' +
      req.body.category +
      '","' +
      req.body.country +
      '","' +
      req.body.place +
      '","' +
      req.body.comments +
      '","' +
      req.body.tags +
      '","' +
      "http://isabellebidou.com/images/" +
      req.body.name +
      '");';
    db.query(sql, (err, res1) => {
      if (err) throw err;
      console.error(res1);
    });
    if (req.params.index <= gallery.length) {
      let index = parseInt(req.params.index);
      let nextIndex = index + 1;
      res.redirect("/uploadphoto/" + nextIndex);
    } else {
      res.redirect("/");
    }
  }
);
module.exports = router;
