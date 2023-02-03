const express = require("express");
const router = express.Router();
const utils = require("../utils");
const secret = require("../secret");
const db = secret.db;
const bcrypt = require("bcrypt")
const methodOverride = require("method-override");
const passport = require("passport");
const initializePassport = require("../passport-config").initialize;
const getUserByEmail = require("../passport-config").getUserByEmail;
const { getEmails } = require("../get/getemails");
const getUserById = require("../passport-config").getUserbyId;
const flash = require("express-flash");
const session = require("express-session");
//var MemoryStore = require('memorystore')(session)
var bodyParser = require("body-parser");
//const { config } = require('dotenv/types');
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
    // store: new MemoryStore({
    //   //https://github.com/HubSpot/oauth-quickstart-nodejs/issues/15
    //   //https://www.npmjs.com/package/memorystore
    //   checkPeriod: 86400000 // prune expired entries every 24h
    // }),
  })
);

router.use(passport.initialize());
router.use(passport.session());
router.use(methodOverride("_method"));

initializePassport(passport, getUserByEmail, getUserById);

router.get("/login", utils.checkNotAuthenticated, (req, res) => {
  res.render("login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

router.get("/register", utils.checkNotAuthenticated, (req, res) => {
  res.render("register", {
    //gallery: globalGallery,
  });
});

router.post("/register", async (req, res) => {
  //check that the requested email is not in use already
  
     await getEmails(req.body.email).then(async (resolveEmailNotTaken) => {
      utils.log('resolveEmailNotTaken');
       utils.log(resolveEmailNotTaken);
      if (
        resolveEmailNotTaken
      ){
        try {
          const hashPassword = await bcrypt.hash(req.body.password, 10);
          let sql =
            'INSERT INTO user (userFirstName, userLastName, userEmail, userPassword) VALUES ("' +
            req.body.firstname +
            '","' +
            req.body.lastname +
            '","' +
            req.body.email +
            '","' +
            hashPassword +
            '");';
          let query = db.query(sql, (err, res1) => {
            if (err) throw err;
            console.error(res1);
          });
          res.redirect("/login");
        } catch (error) {
          console.error(error);
          res.redirect("/register");
        }
      } else {
        req.flash('notify', 'That email is already taken.')

      }
     })
    //  .catch(error){
    //    utils.log(error);

    //  }
});
router.delete("/logout", (req, res) => {
  session.user = null;
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

router.get("/logout", (req, res) => {
  session.user = null;
  req.logOut();
  res.redirect("/");
});
router.post('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

module.exports = router;
