//herb
const express = require("express");

const router = express.Router();
const getGallery = require("../get/getgallery");
const getHerbById = require("../get/getherbbyid");
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
var timeout = require('connect-timeout')
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
function haltOnTimedout (req, res, next) {
  if (!req.timedout) next()
}

function saveGet (get, cb) {
  setTimeout(function () {
    cb(null, ((Math.random() * 40000) >>> 0))
  }, (Math.random() * 7000) >>> 0)
}


router.get("/displayherb/:index", timeout('10s'), bodyParser.json(), haltOnTimedout,async function (req, res) {
  saveGet(req.body, async function (err, id) {
  try {
      await getHerbById
      .getHerbById(req.params.index)
      .then(async (resolveHerb) => {
        herb = resolveHerb[0];
        herb.herbLinks = herb.herbLinks === "null" ? "" : utils.stringToArray(herb.herbLinks);
        herb.herbProducts = herb.herbProducts === "null" ? "" : utils.stringToArray(herb.herbProducts);
        res.render("displayherb", {
          herb: herb,
          session: session,
          next: null,
          back: null
        });    

      })
      .catch((error) => {
        session.filter = false;
        session.dbIsOffline = true;
        globalGallery = error.rejectGallery;
      });
     

  } catch (e) {
    utils.log(e)
    res.redirect("/");
  }
})
});

//edit

router.get("/editherb/:index", async function (req, res) {
  function chooseherb(indOne) {
    return indOne.herbId === parseInt(req.params.index);
  }
  

    try {
      await getGallery
        .getGlobalGallery(false, false)
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
      utils.log(e)
    }
  
  var herb = utils.findherbInJsonArray(
    parseInt(req.params.index),
    globalGallery
  );
  if (herb == undefined) {
    herb = utils.findherbInJsonArray2(
      parseInt(req.params.index),
      globalGallery
    );
  }



      try{
        res.render("editherb", {
          herb: herb,
          session: session,

        });

      }catch (e){
        console.error(e);
        res.redirect("/");

      }


});
router.post("/editherb/:index", utils.checkAuthenticated, function (req, res) {

  let sql =
    'UPDATE herb SET herbCategory = "' +
    req.body.newCategory +
    '", herbName = "' +
    req.body.newName +
    '",herbProperties = "' +
    req.body.newProperties +
    '", herbLinks = "' +
    req.body.newLinks +
    '", herbProducts = "' +
    req.body.newProducts +
    '", herbTags = "' +
    req.body.newTags +
    '", herbNameLatin = "' +
    req.body.newNameLatin +
    '", herbNameFrench = "' +
    req.body.newNameFrench +
    '", herbNameChinese = "' +
    req.body.newNameChinese +
    '", herbComments = "' +
    req.body.newComments +
    '", herbText = "' +
    req.body.newText +
    '" WHERE herbId = "' +
    req.params.index +
    '" ;';

    

  db.query(sql, (err, res1) => {
    if (err) throw err;
  });
  
    res.redirect(`/displayherb/${parseInt(req.params.index)}`);
 
});

module.exports = router;
