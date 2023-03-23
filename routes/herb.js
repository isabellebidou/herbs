//herb
const express = require("express");

const router = express.Router();
const getGallery = require("../get/getgallery");
const getHerbById = require("../get/getherbbyid");
const getHerbByName = require("../get/getherbbyname");
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
    saveUninitialized: false
   
  })
);

router.use(passport.initialize());
router.use(passport.session());

initializePassport(passport, getUserByEmail, getUserById);
function haltOnTimedout(req, res, next) {
  if (!req.timedout) next()
}

function saveGet(get, cb) {
  setTimeout(function () {
    cb(null, ((Math.random() * 40000) >>> 0))
  }, (Math.random() * 7000) >>> 0)
}


router.get("/displayherb/:index", bodyParser.json(), async function (req, res) {
  if (session.gallery) {
    globalGallery = session.gallery
    try {
      for (let index = 0; index < globalGallery.length; index++) {
        const element = globalGallery[index];
        //var herb = globalGallery.find(()=> {return item.herName === req.params.index;} );
        if (element.herbName === req.params.index) {
          herb = element;
          herb.herbLinks = herb.herbLinks === "null" ? "" : utils.stringToArray(herb.herbLinks);
          herb.herbProducts = herb.herbProducts === "null" ? "" : utils.stringToArray(herb.herbProducts);
          res.render("displayherb", {
            herb: herb,
            session: session,
            next: null,
            back: null
          });
        }

      }
    } catch {
      console.log('something fishy')

    }
  } else {
    try {
      await getHerbByName
        .getHerbByName(req.params.index)
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
  }
});

//edit

router.get("/editherb/:index", async function (req, res) {
  function chooseherb(indOne) {
    return indOne.herName === req.params.index;
  }

  try {
    await getHerbByName
      .getHerbByName(req.params.index)
      .then(async (resolveHerb) => {
        herb = resolveHerb[0];
        herb.herbLinks = herb.herbLinks === "null" ? "" : utils.stringToArray(herb.herbLinks);
        herb.herbProducts = herb.herbProducts === "null" ? "" : utils.stringToArray(herb.herbProducts);
        res.render("editherb", {
          herb: herb,
          session: session,

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
    '" WHERE herbName = "' +
    req.params.index +
    '" ;';



  db.query(sql, (err, res1) => {
    if (err) throw err;
  });

  res.redirect(`/displayherb/${(req.params.index)}`);

});

module.exports = router;
