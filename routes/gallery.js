const express = require("express");

const router = express.Router();
var globalGallery = [];
const utils = require("../utils");
const secret = require("../secret");
const getGallery = require("../get/getgallery");
const db = secret.db;
var searchItem = " ";
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
//https://www.npmjs.com/package/node-localstorage
// if (typeof localStorage === "undefined" || localStorage === null) {
//     var LocalStorage = require('node-localstorage').LocalStorage;
//     localStorage = new LocalStorage('./scratch');
//   }
//gallery page

router.get("/", async (req, res, next) => {

  req.session.dbIsOffline = false;
  try {
    await getGallery
      .getGlobalGallery(true)
      .then((resolveGallery) => {
        session.filter = false;
        session.dbIsOffline = false;
        globalGallery = resolveGallery;
        
      })
      .catch((error) => {
        session.filter = false;
        session.dbIsOffline = true;
        globalGallery = error.rejectGallery;
      });
    const dataList = await utils.findTagsList(globalGallery);
    res.render("index", {
      gallery: globalGallery,
      session: session,
      datalist: dataList,
    });
  } catch (e) {
    console.error(e);
  }
});

//   //https://stackoverflow.com/questions/53940043/unhandledpromiserejectionwarning-this-error-originated-either-by-throwing-insid

// filter
/*router.get("/filterherbs", async function (req, res) {
  utils.log("*** get filterherbs  ");

  let sql =
    'select * FROM herb WHERE herbTags LIKE  "%' +
    searchItem +
    '%" OR herbProperties LIKE "%' +
    searchItem +
    '%" OR herbName LIKE "%' +
    searchItem +
    '%" OR herbNameChinese LIKE "%' +
    searchItem +
    '%" OR herbNameFrench LIKE "%' +
    searchItem +
    '%" OR herbNameLatin LIKE "%' +
    searchItem +
    '%" OR herbCategory LIKE "%' +
    searchItem +
    '%" ORDER BY herbName asc;';

   db.query(sql, async (err, gallery) => {
    if (err) throw err;
    console.error(err);
    gallery.forEach(async (herb) => {
      herb.herbLinks = await utils.stringToArray(herb.herbLinks);
      herb.herbProducts = await utils.stringToArray(herb.herbProducts);
    });
    globalGallery =  gallery;
    res.render("filterherbs", {
      gallery: globalGallery,
      searchItem: req.session.lastSearchItem
    });
  });
});*/

router.post("/filterherbs", function (req, res) {
  session.filter = true;
  searchItem = req.body.search;
  let sql =
  'select * FROM herb WHERE herbTags LIKE  "%' +
  searchItem +
  '%" OR herbProperties LIKE "%' +
  searchItem +
  '%" OR herbName LIKE "%' +
  searchItem +
  '%" OR herbNameChinese LIKE "%' +
  searchItem +
  '%" OR herbNameFrench LIKE "%' +
  searchItem +
  '%" OR herbNameLatin LIKE "%' +
  searchItem +
  '%" OR herbCategory LIKE "%' +
  searchItem +
  '%" ORDER BY herbName;';
  

  db.query(sql, async (err, gallery) => {
    if (err) throw err;
    console.error(err);
    await gallery.forEach(async (herb) => {
      herb.herbLinks = utils.stringToArray(herb.herbLinks);
      herb.herbProducts = utils.stringToArray(herb.herbProducts);
    });
    res.render("filterherbs", {
      gallery: await gallery,
      searchItem: searchItem,
    });
  });
});



module.exports = router;
