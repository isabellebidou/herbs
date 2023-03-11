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
const S3_BUCKET = process.env.BUCKET_NAME;
const aws = require('aws-sdk');
const {uploadFile} = require("../scripts/s3")
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
  router.get("/api/herbpic",  async(req, res) => {
    try {
        await getGallery
        .getGlobalGallery(false, false)
          .then((resolveGallery) => {
            //session.dbIsOffline = false;
            res.render("uploadherbpic", {
              setList: resolveGallery,
            //  session: session,
            });
          })
          .catch((error) => {
            console.error(error);
          });
      } catch (error) {
        console.error(error);
      }
    });
    router.get("/api/herbpictobucket",  async(req, res) => {
      try {
          await getGallery
          .getGlobalGallery(false, false)
            .then((resolveGallery) => {
              //session.dbIsOffline = false;
              res.render("uploadherbpictobucket", {
                setList: resolveGallery,
              //  session: session,
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
  router.post("/api/herbpic", utils.checkAuthenticated,upload.single("testImage"), async (req, res) => {
    const {  herbPic, plant } = req.body;
    const file = req.file;
    const filename = req.file.filename;
    await getHerbByName.getHerbIdByname(plant)
    .then(async (resolvePlant) => {
      var string=JSON.stringify(resolvePlant);
      var json =  JSON.parse(string);
      const id = json[0].herbId;
      const name = plant+ '.png';
      //https://youtu.be/NZElg91l_ms
      const result = await uploadFile(file, name)
      //console.log(result)
      insertPicPath.insertHerbPicPath(name, id);
      try {
        if (result)fs.unlinkSync('models/' + filename)
      } catch (error) {
        console.log(error)
      }

      
      });
      res.redirect("/");
    });

    
      
    
 

    


    
 

  






module.exports = router;