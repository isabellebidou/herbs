const express = require("express");
const router = express.Router();
const upload = require("../storage-config");
const utils = require("../utils");
const secret = require("../secret");

var message = "";
// toggle to use
// const { findherbSetValues } = require("../utils");


const db = secret.db;
const fs = require("fs");
var bodyParser = require("body-parser");
//router.use(express.json());
router.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

router.get("/uploadjson", async function (req, res) {
  try {
    await getSetNames
      .getSetNames()
      .then((resolveSetNames) => {
        //session.dbIsOffline = false;
        res.render("uploadjson", {
          setList: resolveSetNames,
          //  session: session,
        });
      })
      .catch((error) => {
        utils.log(error)
      });
  } catch (error) {
    utils.log(error)
  }
});

/*router.get("/uploadherbsjson", upload.single("json"), (req, res) => {
  var newherbs = require(`../models/gallery.json`);
  var jsonIsValid = true;
  var set;
  try {
    JSON.parse(newherbs);
  } catch (e) {
    jsonIsValid = false;
    // res.render(`${e} : ${req.file.filename} is not valid`);
    utils.log(`file is not valid`);
  }

  //if (jsonIsValid) {
  for (i = 0; i < newherbs.length; i++) {
    let herb = newherbs[i];
    let sql =
      'INSERT INTO herb (herbName, herbNameFrench, herbNameLatin, herbNameChinese, herbCategory, herbLinks,herbProducts, herbComments, herbProperties, herbTags) VALUES ("' +
      herb.herbName +
      '","' +
      herb.herbNameFrench +
      '","' +
      herb.herbNameLatin +
      '","' +
      herb.herbNameChinese +
      '","' +
      herb.herbCategory +
      '","' +
      herb.herbLinks +
      '","' +
      herb.herbProducts +
      '","' +
      herb.herbComments +
      '","' +
      herb.herbProperties +
      '","' +
      herb.herbTags +
      '");';
    db.query(sql, (err, res1) => {
      if (err) throw err;
      console.error(res1);
    });
  }
  //}
  try {
    fs.unlinkSync(`../models/models/.json`);
  } catch (error) {
    console.error(error);
  }

  res.redirect("/");
  //return res.json({ status: 'OK' });
});*/

router.post("/uploadjson", upload.single("json"), (req, res) => {
  var newherbs = require(`../models/${req.file.filename}`);
  var jsonIsValid = true;
  var set;
  try {
    JSON.parse(newherbs);
  } catch (e) {
    jsonIsValid = false;
    // res.render(`${e} : ${req.file.filename} is not valid`);
    utils.log(`${req.file.filename} is not valid`);
  }
  //if (jsonIsValid) {
  for (i = 0; i < newherbs.length; i++) {
    let herb = newherbs[i];
    let sql =
      'INSERT INTO herb (herbName, herbThumbnail, herbCategory, herbCountry, herbPlace, herbYear,herbComments, herbTags, herbPath) VALUES ("' +
      herb.name +
      '","' +
      herb.thumbnail +
      '","' +
      herb.category +
      '","' +
      herb.country +
      '","' +
      herb.place +
      '","' +
      herb.year +
      '","' +
      herb.comments +
      '","' +
      herb.tags +
      '","' +
      "http://isabellebidou.com/images/" +
      herb.name +
      '");';
    db.query(sql, (err, res1) => {
      if (err) throw err;
      utils.log(res1)
    });
  }
  //}
  try {
    fs.unlinkSync(`../models/${req.file.filename}`);
  } catch (error) {
    utils.log(error)
  }

  res.redirect("/");
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
  let sql = "select * FROM herb ORDER BY herbName; ";
  db.query(sql, async (err, gallery) => {
    try {
      if (err) throw err;
      var data = JSON.stringify(gallery);
      fs.writeFileSync("./models/data.json", data);
    } catch (e) {
      console.error(e);
      res1
    }
  });
});
router.get("/dbintojsonflag", function (req, res) {
  const fs = require("fs");
  let sql = "select * FROM herb ORDER BY herbName; ";
  db.query(sql, async (err, gallery) => {
    try {
      if (err) throw err;
      gallery.forEach((herb) => {
        herb.herbLinks = utils.stringToArray(herb.herbLinks);
        herb.herbProducts = utils.stringToArray(herb.herbProducts);
      });
      var data = JSON.stringify(gallery);
      fs.writeFileSync("./models/dataflag.json", data);
    } catch (e) {
      utils.log(e)
    }
  });
});

// this is used  exceptionally
// router.get("/creategrouptable", function (req, res) {
//   let sql =
//     "CREATE TABLE herbSet (herbSetId int NOT NULL AUTO_INCREMENT PRIMARY KEY, herbSetName varchar(255)";
//   let query = db.query(sql, (err, res) => {
//     if (err) throw err;
//   });
// });

// router.get("/insertherbsetvalues/", async function (req, res) {
//   // get gallery
//   try {
//     await getGallery
//       .getGlobalGallery()
//       .then(async (resolveGallery) => {
//         try {
//           // get herbset names
//           await findherbSetValues(resolveGallery).then(
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

// insert names for each existing herb in herb table
// router.get( "/updateherbsetvalues", async (req,res) => {
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
//               var setNamesMap = new Map(setNamesArray.map(j => [j.herbSetId, j.herbSetName]));
//               //utils.log(setNamesMap)
//               //for (var i = 0; i < 5; i++ ){
//               for (var i = 0; i < gallery.length; i++ ){
//                 const herb = gallery[i]
//                 const setNameId = utils.getKey(utils.stripherbName(herb.herbName), setNamesMap)
//                 //utils.log(setNameId)
//                 updateSetIdInherbTable(herb.herbId, setNameId)
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

//   // for each herb in gallery update herbsetvalue

// });
//let sql =
// "CREATE TABLE userherbSet (userherbSet int NOT NULL AUTO_INCREMENT PRIMARY KEY, userId int(255),herbSetId int(255),FOREIGN KEY (userId) REFERENCES user(userId), FOREIGN KEY (herbSetId) REFERENCES herbSet(herbSetId))";
/*
"herbId": 3,
        "herbName": "Ashwaganda",
        "herbNameFrench": "Ginseng Indien",
        "herbNameLatin": "Withania somnifera",
        "herbNameChinese": "",
        "herbCategory": "ayurveda",
        "herbLinks": "",
        "herbProducts": "",
        "herbComments": " ",
        "herbProperties": "",
        "herbTags": " "
*/
/*router.get("/createherbtable", function (req, res) {
  
  let sql =
    "CREATE TABLE herb (herbId int NOT NULL AUTO_INCREMENT PRIMARY KEY, herbName varchar(255), herbNameFrench varchar(255), herbNameLatin varchar(255),  herbNameChinese varchar(255), herbCategory varchar(255),herbLinks varchar(255),  herbProducts varchar(255), herbComments varchar(255),herbProperties varchar(255),herbTags varchar(255));";
  let query = db.query(sql, (err, res) => {
    if (err) throw err;
  });
});*/
router.get("/createusertable", function (req, res) {
  let sql =
    "CREATE TABLE user (userId int NOT NULL AUTO_INCREMENT PRIMARY KEY, userFirstName varchar(255), userLastName varchar(255),userEmail varchar(255), userPassword varchar(255));";
  let query = db.query(sql, (err, res) => {
    if (err) throw err;
  });
});

router.get(
  "/uploadherb",
  utils.checkAuthenticated,
  function (
    req,
    res
  ) {

    res.render('uploadherb');
  }
);

router.post(
  "/uploadherb",
  utils.checkAuthenticated,
  function (
    /*{
      newCategory,
      newName,
      newProperties,
      newLinks,
      newTags,
      newNameLatin,
      newNameChinese,
      newNameFrench,
      newProducts,
      newComments,
    }*/req,
    res
  ) {
    let sqlStart = 'INSERT INTO herb (';
    let sqlValues = ') VALUES ("';

    if (req.body.newName) { sqlStart += 'herbName,'; sqlValues += req.body.newName + '","'; }
    if (req.body.newCategory) { sqlStart += 'herbCategory,'; sqlValues += req.body.newCategory + '","'; }
    if (req.body.newProperties) { sqlStart += 'herbProperties,'; sqlValues += req.body.newProperties + '","'; }
    if (req.body.newLinks) { sqlStart += 'herbLinks,'; sqlValues += req.body.newLinks + '","'; }
    if (req.body.newNameLatin) { sqlStart += 'herbNameLatin,'; sqlValues += req.body.newNameLatin + '","'; }
    if (req.body.newNameChinese) { sqlStart += 'herbNameChinese,'; sqlValues += req.body.newNameChinese + '","'; }
    if (req.body.newNameFrench) { sqlStart += 'herbNameFrench,'; sqlValues += req.body.newNameFrench + '","'; }
    if (req.body.newProducts) { sqlStart += 'herbProducts,'; sqlValues += req.body.newProducts + '","'; }
    if (req.body.newComments) { sqlStart += 'herbComments,'; sqlValues += req.body.newComments + '","'; }
    if (req.body.newTags) { sqlStart += 'herbTags,'; sqlValues += req.body.newTags + '"'; }
    if (req.body.newText) { sqlStart += 'herbText,'; sqlValues += req.body.newText + '"'; }
    sqlStart = sqlStart.substring(0, sqlStart.length - 1);
    sqlValues = sqlValues.substring(0, sqlValues.length - 1);
    const sql = sqlStart += sqlValues += '");';
    utils.log(sql)


    db.query(sql, (err, res1) => {
      if (err) throw err;
      utils.log(res1)
    });

   /* db.herbs.insertOne({
      herbName: req.body.newName,
      herbCategory: req.body.newCategory,
      herbProperties: req.body.newProperties,
      herbLinks: req.body.newLinks,
      herbNameLatin: req.body.newNameLatin,
      herbNameChinese: req.body.newNameChinese,
      herbNameFrench: req.body.newNameFrench,
      herbProducts: req.body.newProducts,
      herbComments: req.body.newComments,
      herbTags: req.body.newTags,
      herbText: req.body.newText
    });*/
    res.redirect(`/api/herbpic`);
  }
);
module.exports = router;
