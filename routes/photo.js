//photo
const express = require("express");

const router = express.Router();
//var globalGallery = require('./gallery.js');
const getGallery = require("../get/getgallery");
const getUserGallery = require("../get/getusergallery");
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
var MemoryStore = require("memorystore")(session);
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
      checkPeriod: 86400000, // prune expired entries every 24h
    }),
  })
);

router.use(passport.initialize());
router.use(passport.session());

initializePassport(passport, getUserByEmail, getUserById);

router.get("/displayphoto/:index", async function (req, res) {
  // function choosephoto(indOne) {
  //   return indOne.photoId === parseInt(req.params.index);
  // }
  try {
    await getGallery
      .getGlobalGallery()
      .then((resolveGallery) => {
        session.dbIsOffline = false;
        globalGallery = resolveGallery;
      })
      .catch((error) => {
        session.dbIsOffline = true;
        globalGallery = error.rejectGallery;
      });
  } catch (e) {
    console.error(e);
  }
  try {
    if (globalGallery && Array.isArray(globalGallery)) {
      //var indOne = globalGallery.filter(choosephoto);
      var photo = utils.findPhotoInJsonArray(
        parseInt(req.params.index),
        globalGallery
      );
      if (photo == undefined) {
        photo = utils.findPhotoInJsonArray2(
          parseInt(req.params.index),
          globalGallery
        );
      }

      var index = globalGallery.indexOf(photo);
      var nextPhotoId =
        index + 1 < globalGallery.length
          ? globalGallery[index + 1].photoId
          : null;

        var previousPhotoId =
        index - 1 >= 0
          ? globalGallery[index - 1].photoId
          : null;
      //var myIndex = getIndOnePhotoId(indOne);
      res.render("displayphoto", {
        //indOne: indOne,
        photo: photo,
        galleryLength: globalGallery.length,
        session: session,
        next: nextPhotoId,
        back: previousPhotoId
        //filter: filter,
        //dbIsOffline: dbIsOffline,
      });
    } else res.redirect("/gallery");
  } catch (e) {
    console.error(e);
    res.redirect("/gallery");
  }
  // if (indOne == [] || indOne == undefined || !indOne) {
  //   res.redirect("/gallery");
  // } else {


  // }
});

//edit

router.get("/editphoto/:index", async function (req, res) {
  function choosephoto(indOne) {
    return indOne.photoId === parseInt(req.params.index);
  }
  if (session.user.userRole == "standard") {
    try {
      await getUserGallery
        .getUserGallery(session.user)
        .then((resolveGallery) => {
          req.session.filter = false;
          req.session.dbIsOffline = false;
          globalGallery = resolveGallery;
        })
        .catch((error) => {
          req.session.filter = false;
          req.session.dbIsOffline = true;
        });
    } catch (e) {
      console.error(e);
    }
  } else {
    try {
      await getGallery
        .getGlobalGallery()
        .then((resolveGallery) => {
          req.session.filter = false;
          req.session.dbIsOffline = false;
          globalGallery = resolveGallery;
        })
        .catch((error) => {
          req.session.filter = false;
          req.session.dbIsOffline = true;
          globalGallery = error.rejectGallery;
        });
    } catch (e) {
      console.error(e);
    }
  }
  var photo = utils.findPhotoInJsonArray(
    parseInt(req.params.index),
    globalGallery
  );
  if (photo == undefined) {
    photo = utils.findPhotoInJsonArray2(
      parseInt(req.params.index),
      globalGallery
    );
  }

  //utils.log(photo);

  var index = globalGallery.indexOf(photo);
  var nextPhotoId =
    index + 1 < globalGallery.length
      ? globalGallery[index + 1].photoId
      : globalGallery[0];
  res.render("editphoto", {
    photo: photo,
    session: session,
    nextId: nextPhotoId,
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
  else res.redirect(`/gallery`);
});

module.exports = router;
