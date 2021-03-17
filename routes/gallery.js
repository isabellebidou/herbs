const express = require("express");

const router = express.Router();
var globalGallery = [];
const utils = require("../utils");
const secret = require("../secret");
const getGallery = require("../getgallery");
const db = secret.db;
var searchItem = " ";
//var dbIsOffline = false;
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
//https://www.npmjs.com/package/node-localstorage
// if (typeof localStorage === "undefined" || localStorage === null) {
//     var LocalStorage = require('node-localstorage').LocalStorage;
//     localStorage = new LocalStorage('./scratch');
//   }
//gallery page

router.get("/gallery", async (req, res, next) => {
  req.session.dbIsOffline = false;
  try {
    await getGallery
      .getGlobalGallery()
      .then((resolveGallery) => {
        session.filter = false;
        session.dbIsOffline = false;
        globalGallery = resolveGallery;
        utils.log(session);
      })
      .catch((error) => {
        session.filter = false;
        session.dbIsOffline = true;
        globalGallery = error.rejectGallery;
        utils.log(session);
      });
    const dataList = await utils.findTagsList(globalGallery);
    res.render("gallery", {
      gallery: globalGallery,
      session: session,
      datalist: dataList,
    });
  } catch (e) {
    console.error(e);
  }
});

// router.get("/gallerys", async (req, res, next) => {
//   //https://stackoverflow.com/questions/53940043/unhandledpromiserejectionwarning-this-error-originated-either-by-throwing-insid

//   try {
//     let sql = "select * FROM photo ORDER BY photoId DESC; ";
//     db.query(sql, async (err, gallery) => {
//       try {
//         if (err) throw err;
//         globalGallery = gallery;
//         req.session.filter = false;
//         const dataList = await utils.findTagsList(globalGallery);
//         dbIsOffline = false;
//         //localStorage.setItem('globalGallery', JSON.stringify(globalGallery));
//         res.render("gallery", {
//           gallery: globalGallery,
//           session: session,
//           datalist: dataList,
//         });
//       } catch (e) {
//         console.error(e);
//       }
//     });
//   } catch (error) {
//     next(error);
//     // there was an error retreiving data from the db, using JSON file instead
//     dbIsOffline = true;
//     globalGallery = require("./models/data.json");
//     try {
//       const dataList = await utils.findTagsList(globalGallery);
//       //localStorage.setItem('globalGallery', JSON.stringify(globalGallery));
//       res.render("gallery", {
//         gallery: globalGallery,
//         session: session,
//         datalist: dataList,
//       });
//     } catch (e) {
//       console.error(e);
//     }
//   }
// });

// filter
router.get("/filterphotos", function (req, res) {
  let sql =
    'select * FROM photo WHERE photoTags LIKE  "%' +
    searchItem +
    '%" OR photoPlace LIKE "%' +
    searchItem +
    '%" OR photoCountry LIKE "%' +
    searchItem +
    '%" OR photoName LIKE "%' +
    searchItem +
    '%" OR photoCategory LIKE "%' +
    searchItem +
    '%" ORDER BY photoId DESC;';
  //console.log(sql);

  db.query(sql, (err, gallery) => {
    if (err) throw err;
    console.error(err);
    globalGallery = gallery;
    res.render("filterphotos", {
      gallery: globalGallery,
      searchItem: req.session.lastSearchItem,
    });
  });
});

router.post("/filterphotos", function (req, res) {
  session.filter = true;
  let sql =
    'select * FROM photo WHERE photoTags LIKE  "%' +
    req.body.search +
    '%" OR photoPlace LIKE "%' +
    req.body.search +
    '%" OR photoCountry LIKE "%' +
    req.body.search +
    '%" OR photoName LIKE "%' +
    req.body.search +
    '%" OR photoCategory LIKE "%' +
    req.body.search +
    '%"  ORDER BY photoId DESC;';
    searchItem = req.body.search;

  db.query(sql, (err, gallery) => {
    if (err) throw err;
    globalGallery = gallery;
    res.render("filterphotos", {
      gallery: globalGallery,
      searchItem: searchItem,
    });
  });
});

module.exports = router;
