const express = require("express");
const router = express.Router();
const utils = require("../utils");
const secret = require("../secret");
const db = secret.db;
//const secret = require("../secret");
const methodOverride = require("method-override");
const passport = require("passport");
const initializePassport = require("../passport-config").initialize;
const getUserByEmail = require("../passport-config").getUserByEmail;
const getUserById = require("../passport-config").getUserbyId;
const flash = require("express-flash");
const session = require("express-session");
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
    successRedirect: "/gallery",
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
});
router.delete("/logout", (req, res) => {
  session.user = null;
  req.logOut();
  res.redirect("/gallery");
});

router.get("/logout", (req, res) => {
  session.user = null;
  req.logOut();
  res.redirect("/gallery");
});

module.exports = router;
