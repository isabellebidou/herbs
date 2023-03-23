const _ = require ('lodash')
const express = require("express");
const router = express.Router();
const secret = require("../secret");
const db = secret.db;
const fs = require("fs");
const getGallery = require("../get/getgallery");
const getHerbByName = require("../get/getherbidbyname");
const utils = require("../utils");
//const mongoose = require('mongoose');
const upload = require("../storage-config");
//const Pic = mongoose.model('herbpics');
var bodyParser = require("body-parser");
const passport = require("passport");
const initializePassport = require("../passport-config").initialize;
const getUserByEmail = require("../passport-config").getUserByEmail;
const getUserById = require("../passport-config").getUserbyId;
const session = require("express-session");
const insertPic = require("../insert/insertherbpic");
const insertPicPath = require("../insert/insertherbpicpath");
var MemoryStore = require("memorystore")(session);
router.use(
  bodyParser.urlencoded({
    extended: true,
  })
);


router.get("/legalnotice", async (req, res, next) => {

  try {



    res.render("legalnotice")
  } catch (e) {
    utils.log(e)
  }
});

module.exports = router;
