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
    console.log("get  herb_pic");
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


  

//https://www.youtube.com/watch?v=NzROCbkvIE0
  router.post("/api/herbpic", utils.checkAuthenticated,upload.single("testImage"), async (req, res) => {
    const {  herbPic } = req.body;
    await getHerbByName.getHerbIdByname(req.body.plant)
    .then((resolvePlant) => {
      var string=JSON.stringify(resolvePlant);
      var json =  JSON.parse(string);
      const id = json[0].herbId;
      insertPicPath.insertHerbPicPath(req.file.filename, id);
      /*const pic = new Pic({
        plantId: id,
        dateSent: Date.now(),
        pic: {
          data: fs.readFileSync('models/'+req.file.filename),
          contentType:'image/png'
      }
      });*/
  
      /*pic.save().then(async (res) => {
        utils.log('image is saved');
        await insertPic.insertHerbPic(res._id, id).then(()=> {
          res.redirect("/");
        });
        


       }).catch((err) => {console.error(err)});*/

      
      });
      res.redirect("/");
    });
    
 

    


    
 

  






module.exports = router;