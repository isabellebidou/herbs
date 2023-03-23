const _ = require('lodash')
const express = require("express");
const router = express.Router();
const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })
const getGallery = require("../get/getgallery");
const getHerbByName = require("../get/getherbidbyname");
const utils = require("../utils");
var bodyParser = require("body-parser");
const passport = require("passport");
const initializePassport = require("../passport-config").initialize;
const getUserByEmail = require("../passport-config").getUserByEmail;
const getUserById = require("../passport-config").getUserbyId;
const session = require("express-session");
const insertPicPath = require("../insert/insertherbpicpath");
var MemoryStore = require("memorystore")(session);
const { uploadFile} = require("../scripts/s3")
router.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
/*router.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    
  })
);*/


router.use(passport.initialize());
router.use(passport.session());

initializePassport(passport, getUserByEmail, getUserById);
router.get("/api/herbpic", async (req, res) => {
  try {
    await getGallery
      .getGlobalGallery(false, false)
      .then(async (resolveGallery) => {
          res.render("uploadherbpic", {
            setList: resolveGallery,
          });
            
      })
      .catch((error) => {
        console.error(error);
      });
  } catch (error) {
    console.error(error);
  }
});




//https://www.youtube.com/watch?v=NzROCbkvIE0
//https://youtu.be/eQAIojcArRY?list=PL0X6fGhFFNTeGDRuMlQBO1fs4vvQA48tM
router.post("/api/herbpic", utils.checkAuthenticated, upload.single("testImage"), async (req, res) => {
  const { plant } = req.body;
  const file = req.file;
  const filename = req.file.originalname.split('.')[0];
  await getHerbByName.getHerbIdByname(plant)
    .then(async (resolvePlant) => {
      var string = JSON.stringify(resolvePlant);
      var json = JSON.parse(string);
      const id = json[0].herbId;
      const name = "plantpics/" + filename;
      //https://youtu.be/NZElg91l_ms
      const result = await uploadFile(file.buffer, name, file.mimetype)
      insertPicPath.insertHerbPicPath(req.file.originalname, id);


    });
  res.redirect("/");
});

module.exports = router;