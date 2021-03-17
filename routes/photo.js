//photo
const express = require("express");

const router = express.Router();
//var globalGallery = require('./gallery.js');
const getGallery = require("../getgallery")
var globalGallery = [];
const utils = require("../utils");
const secret = require("../secret");
const db = secret.db;

var dbIsOffline = false;
const passport = require("passport");
const initializePassport = require("../passport-config").initialize;
const getUserByEmail = require("../passport-config").getUserByEmail;
const getUserById = require("../passport-config").getUserbyId;
const session = require("express-session");
var MemoryStore = require('memorystore')(session)
var bodyParser = require("body-parser");
router.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
router.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new MemoryStore({
      //https://github.com/HubSpot/oauth-quickstart-nodejs/issues/15
      //https://www.npmjs.com/package/memorystore
      checkPeriod: 86400000 // prune expired entries every 24h
    }),
  })
);

router.use(passport.initialize());
router.use(passport.session());

initializePassport(passport, getUserByEmail, getUserById);


router.get("/displayphoto/:index", async function (req, res) {
  function choosephoto(indOne) {
    return indOne.photoId === parseInt(req.params.index);
  }
  try {
    await getGallery.getGlobalGallery().then(resolveGallery => {
      //session.filter = true;
      session.dbIsOffline = false;
      globalGallery = resolveGallery;
    }).catch(error => {
      //session.filter = false;
      session.dbIsOffline = true;
      globalGallery = error.rejectGallery;
    })
  } catch (e) {
    console.error(e);
  }
  try {
    if (globalGallery && Array.isArray(globalGallery))
      var indOne = globalGallery.filter(choosephoto);
    else res.redirect("/gallery");
  } catch (e) {
    console.error(e);
    res.redirect("/gallery");
  }
  if (indOne == [] || indOne == undefined || !indOne) {
    res.redirect("/gallery");
  } else {
    //var myIndex = getIndOnePhotoId(indOne);
    res.render("displayphoto", {
      indOne: indOne,
      galleryLength: globalGallery.length,
      session: session,
      //filter: filter,
      //dbIsOffline: dbIsOffline,
    });
  }
});

//edit

router.get("/editphoto/:index", async function (req, res) {
  function choosephoto(indOne) {
    return indOne.photoId === parseInt(req.params.index);
  }
  if (!globalGallery|| globalGallery ==[]|| globalGallery === undefined){
    try {
      await getGallery.getGlobalGallery().then(resolveGallery => {
        req.session.filter = false;
        req.session.dbIsOffline = false;
        globalGallery = resolveGallery;
      }).catch(error => {
        req.session.filter = false;
        req.session.dbIsOffline = true;
        globalGallery = error.rejectGallery;
      })
    } catch (e) {
      console.error(e);
    }
  }
 //globalGallery = await getGlobalGallery();
  var indOne = globalGallery.filter(choosephoto);
  index = indOne.photoId;
  res.render("editphoto", {
    indOne: indOne,
    session: req.session,
  });
});
router.post("/editphoto/:index", utils.checkAuthenticated, function (req, res) {
  //photoName, photoThumbnail, photoCategory, photoCountry, photoPlace, photoComments, photoTags, photoPath

  let sql =
    'UPDATE photo SET photoCategory = "' +
    req.body.newcategory +
    '", photoCountry = "' +
    req.body.newcountry +
    '",photoPlace = "' +
    req.body.newplace +
    '", photoYear = "' +
    req.body.newyear +
    '", photoTags = "' +
    req.body.newtags +
    '" WHERE photoId = "' +
    req.params.index +
    '" ;';

  db.query(sql, (err, res1) => {
    if (err) throw err;
  });
  if (parseInt(req.params.index) - 1 > 1)
    res.redirect(`/editphoto/${parseInt(req.params.index) - 1}`);
  //res.redirect("/uploadphoto/" + nextIndex);
  else res.redirect(`/gallery`);
});

async function getGlobalGallery (){
  return new Promise((resolve, reject) => {
  utils.log('getGlobalGallery shouldnt show .. oops');

  try {
  let sql = "select * FROM photo ORDER BY photoId DESC; ";
  db.query(sql, async (err, gallery) => {
    try {
      if (err) throw err;
      globalGallery = gallery;
      dbIsOffline = false;
      resolve(globalGallery);
    } catch (e) {
      console.error(e);
      let jsonGallery = require("../models/data.json");
      reject(jsonGallery);

    }
  });
  
} catch (error) {
  next(error);
  // there was an error retreiving data from the db, using JSON file instead
  dbIsOffline = true;
  globalGallery = require("../models/data.json");

}
//resolve (globalGallery);

})
}

module.exports = router;
