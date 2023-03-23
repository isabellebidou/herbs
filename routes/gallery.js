const express = require("express");

const router = express.Router();
var globalGallery = [];
var filteredGallery = [];
var dataList= [];
const utils = require("../utils");
const secret = require("../secret");
const getGallery = require("../get/getgallery");
const getTags = require("../get/getTagsList");
const gallery = require("../models/data.json");
const datalist = require("../models/datalist.json");
const db = secret.db;
var searchItem = " ";
const passport = require("passport");
const initializePassport = require("../passport-config").initialize;
const getUserByEmail = require("../passport-config").getUserByEmail;
const getUserById = require("../passport-config").getUserbyId;
const session = require("express-session");
var MemoryStore = require("memorystore")(session);
var bodyParser = require("body-parser");
var timeout = require('connect-timeout')


const AWS = require("aws-sdk");
const fs = require("fs");
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

  req.session.dbIsOffline = false;
  if (!session.gallery)
  try {
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

  if ( !session.dataList){
    try {
      //dataList = await utils.findTagsList(gallery);
      dataList = datalist;
      session.dataList= datalist;
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
 
//})


  
});

function haltOnTimedout (req, res, next) {
  if (!req.timedout){
		next();
	}
	else{
		let err = new Error("timedout error");
		err.status = 504;
		next(err);
	}
}


function saveGet (get, cb) {
  setTimeout(function () {
    cb(null, ((Math.random() * 40000) >>> 0))
  }, (Math.random() * 7000) >>> 0)
}
function errorHandler( err, req, res, next) {
  //handle your timeout error here
  res.sendStatus(err.status)
};

//   //https://stackoverflow.com/questions/53940043/unhandledpromiserejectionwarning-this-error-originated-either-by-throwing-insid

// filter
router.get("/filterherbs", timeout('10s'), bodyParser.json(), haltOnTimedout, errorHandler, async (req, res, next) => {
  saveGet(req.body, async function (err, id) {
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
    utils.log(err)
    gallery.forEach(async (herb) => {

      herb.herbLinks = herb.herbLinks === "null" ? "" : utils.stringToArray(herb.herbLinks);
      herb.herbProducts = herb.herbProducts === "null" ? "" : utils.stringToArray(herb.herbProducts);
    });
    filteredGallery = gallery;
    res.render("filterherbs", {
      gallery: filteredGallery,
      session: session,
      searchItem: searchItem
    });
  });
  })
});

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
      session: session,
      searchItem: searchItem,
    });
  });
});



module.exports = router;
