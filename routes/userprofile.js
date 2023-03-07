const express = require("express");
const router = express.Router();
const utils = require("../utils");
const secret = require("../secret");
//const {getUserProfileByUserId } = require("../get/getuserprofilebyid");
const { getUserDetails } = require("../get/getuserdetailsbyid");
const db = secret.db;
const bcrypt = require("bcrypt");
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

router.get("/userprofile/:index", utils.checkAuthenticated, async (req, res) => {

    try {
      await getUserDetails(req.params.index)
        .then(async (resolveUser) => {
          user = resolveUser;
          utils.log(user);
                res.render("userprofile", {
                  users: user,
                  session: session,
                });
             
        })
        .catch((error) => {
          utils.log(error);
        });
    } catch (e) {
      utils.log(error);
    }
  });
  router.post("/userprofile/:index", async (req, res) => {

    let sql =
      'UPDATE user SET userFirstName = "' +
      req.body.newfirstname +
      '", userLastName = "' +
      req.body.newlastname +
      '",userEmail = "' +
      req.body.newemail +
      '", userRole = "' +
      req.body.newrole +
      '", active = "' +
      req.body.newactive +
      '" WHERE userId = "' +
      req.params.index +
      '" ;';
  
    db.query(sql, (err, res1) => {
      if (err) throw err;
      else res.redirect("/userprofile/"+req.params.index);
    });
  });


  router.get("/resetpassword/:index", utils.checkAuthenticated, async (req, res) => {
    try {
      await getUserDetails(req.params.userId)
        .then(async (resolveUser) => {
          user = resolveUser;
          utils.log(user);
                res.render("resetpassword", {
                  users: user,
                  session: session,
                });
             
        })
        .catch((error) => {
          console.error(error);
        });
    } catch (e) {
      console.error(e);
    }
  });
  router.post("/resetpassword/:index", async (req, res) => {
    const hashPassword = await bcrypt.hash(req.body.newPassword, 10);

    let sql =
      'UPDATE user SET userPassword = "' +
      hashPassword +
      '" WHERE userId = "' +
      req.params.index +
      '" ;';
  
    db.query(sql, (err, res1) => {
      if (err) throw err;
      else res.redirect("/userprofile/"+req.params.index);
    });
  });
  module.exports = router;
  