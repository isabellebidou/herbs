const express = require("express");
const router = express.Router();
var globalGallery = [];
//var filteredGallery = [];
var dataList = [];
const utils = require("../utils");
const secret = require("../secret");
//const getGallery = require("../get/getgallery");
//const getTags = require("../get/getTagsList");
const gallery = require("../models/data.json");
const datalist = require("../models/datalist.json");
const db = secret.db;
var searchItem = " ";
const passport = require("passport");
const initializePassport = require("../passport-config").initialize;
const getUserByEmail = require("../passport-config").getUserByEmail;
const getUserById = require("../passport-config").getUserbyId;
const session = require("express-session");
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
  })
);
router.use(passport.initialize());
router.use(passport.session());
initializePassport(passport, getUserByEmail, getUserById);


router.get("/", bodyParser.json(), async (req, res, next) => {
  session.filter = false;
  session.searchItem = null;

  req.session.dbIsOffline = false;
  if (!session.gallery)
    try {
      gallery.sort((a, b) => {
        if (a.herbName < b.herbName) return -1;
        if (a.herbName > b.herbName) return 1;
        return 0;
      });
      session.gallery = gallery;
      /*await getGallery
        .getGlobalGallery(true)
        .then((resolveGallery) => {
          session.filter = false;
          session.dbIsOffline = false;
          globalGallery = resolveGallery;
          session.gallery= globalGallery;
        })
        .catch((error) => {
          session.filter = false;
          session.dbIsOffline = true;
          globalGallery = error.rejectGallery;
        }); */

    } catch (e) {
      utils.log(e)
      
    }

  if (!session.dataList) {
    try {
      dataList = datalist;
      session.dataList = datalist;
    } catch (error) {
      utils.log(error)
    }
  }
  try {
    res.render("index", {
      session: session,
    });
  } catch (error) {
    utils.log(error)
  }
});


//   //https://stackoverflow.com/questions/53940043/unhandledpromiserejectionwarning-this-error-originated-either-by-throwing-insid

// filter
router.get("/filterherbs", bodyParser.json(), async (req, res, next) => {
  console.log("boum!")

});
String.prototype.equalIgnoreCase = function (str) {
  return (str != null
    && typeof str === 'string'
    && this.toUpperCase() === str.toUpperCase());
}
router.post("/filterherbs", function (req, res) {
  if (req && req.body && req.body.search) {
    session.filter = true;
    session.searchItem = req.body.search;
    globalGallery = session.gallery ? session.gallery : gallery;
    try {
      var result = [];
      for (let index = 0; index < globalGallery.length; index++) {
        const element = globalGallery[index];
        if (element.herbName && element.herbName.equalIgnoreCase(session.searchItem)
          || (element.herbProperties && element.herbProperties.includes(session.searchItem))
          || (element.herbNameFrench && element.herbNameFrench.includes(session.searchItem))
          || (element.herbNameChinese && element.herbNameChinese.includes(session.searchItem))
          || (element.herbNameLatin && element.herbNameLatin.includes(session.searchItem))
          || (element.herbTags && element.herbTags.includes(session.searchItem))
        ) {
          result.push(element)
        }
      }
      res.render("filterherbs", {
        gallery: result,
        session: session,
        //searchItem: searchItem,
      });
    } catch (e) {
      utils.log(e)
      res.redirect('/');
    }

    /*let sql =
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
        session: session,
        searchItem: searchItem,
      });
    });*/
  } else {
    res.redirect('/')
    utils.log('redirect')
  }
});
router.post("/filter/:index", function (req, res) {
  if (req && req.params && req.params.index) {
    session.filter = true;
    session.searchItem = req.params.index;
    globalGallery = session.gallery ? session.gallery : gallery;
    try {
      var result = [];
      for (let index = 0; index < globalGallery.length; index++) {
        const element = globalGallery[index];
        if (element.herbName.includes(searchItem)
          || (element.herbProperties && element.herbProperties.includes(searchItem))
          || (element.herbNameFrench && element.herbNameFrench.includes(searchItem))
          || (element.herbNameChinese && element.herbNameChinese.includes(searchItem))
          || (element.herbNameLatin && element.herbNameLatin.includes(searchItem))
          || (element.herbTags && element.herbTags.includes(searchItem))
        ) {
          result.push(element)
        }
      }
      res.render("filterherbs", {
        gallery: result,
        session: session,
        searchItem: searchItem,
      });
    } catch {
      res.redirect('/');
    }

  } else {
    res.redirect('/')
  }
});


module.exports = router;
