const express = require("express");

const router = express.Router();
var users = [];
var user = null;
const utils = require("../utils");
const secret = require("../secret");
const { getSetNamesByUserId } = require("../getsetnamesbyuserid");
const { getUsers } = require("../getusers");
const { getUserDetails } = require("../getuserdetailsbyid");
const { getSetNames } = require("../getsetnames");
const { deleteSetNameById } = require("../deletesetnamebyid");
const { insertSetNameById } = require("../insertsetnamebyid");
const db = secret.db;
var searchItem = " ";
//var dbIsOffline = false;
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

router.get("/users", utils.checkAuthenticated, async (req, res) => {
  try {
    await getUsers()
      .then(async (resolveUsers) => {
        users = resolveUsers;
        for (let index = 0; index < users.length; index++) {
          const user = users[index];
          await getSetNamesByUserId(user.userId)
            .then((resolveUserSetNames) => {
              var names = "";
              for (let index = 0; index < resolveUserSetNames.length; index++) {
                names += resolveUserSetNames[index].photoSetName;
                names += ", ";
              }
              user.userSetNames = names;
              //utils.log(user);
            })
            .catch((error) => {
              console.error(error);
            });
        }
        res.render("users", {
          users: users,
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
router.get("/edituser/:index", utils.checkAuthenticated, async (req, res) => {
  var remainingSetNames = [];
  var duplicateSetIds = [];
  try {
    await getUserDetails(req.params.index)
      .then(async (resolveUser) => {
        user = resolveUser;
        //utils.log(user);
        await getSetNamesByUserId(req.params.index)
          .then(async (resolveUserSetNames) => {
            var userSetNames = resolveUserSetNames;
            await getSetNames().then((resolveNames) => {
              remainingSetNames = resolveNames;
              for (let index = 0; index < resolveNames.length; index++) {
                const setName = resolveNames[index];

                for (let j = 0; j < userSetNames.length; j++) {
                  const userSetName = userSetNames[j];

                  if (userSetName.photoSetId == setName.photoSetId) {
                    duplicateSetIds.push(setName.photoSetId);
                  }
                }
              }
              //https://stackoverflow.com/questions/10024866/remove-object-from-array-using-javascript/10024926
              for (let index = 0; index < duplicateSetIds.length; index++) {
                const duplicate = duplicateSetIds[index];
                remainingSetNames = remainingSetNames.filter(
                  (setName) => setName.photoSetId != duplicate
                );
              }

              res.render("edituser", {
                users: user,
                userSetNames: userSetNames,
                remainingSetNames: remainingSetNames,
                session: session,
              });
            });
          })
          .catch((error) => {
            console.error(error);
          });
      })
      .catch((error) => {
        console.error(error);
      });
  } catch (e) {
    console.error(e);
  }
});
router.post("/edituser/:index", async (req, res) => {
  await getSetNames()
    .then(async (resolveNames) => {
      var checkedSetNames = [];
      for (let index = 0; index < resolveNames.length; index++) {
        const name = resolveNames[index];
        const identifier = name.photoSetId;
        //utils.log(req.body[identifier])
        if (name.photoSetName == req.body[identifier]) {
          checkedSetNames.push(resolveNames[index]);
        }
      }
      await getSetNamesByUserId(req.params.index).then(
        (resolveUserSetNames) => {
          checkedSetNames.forEach((checkedSetName) => {
            //https://www.tutorialrepublic.com/faq/how-to-check-if-an-array-includes-an-object-in-javascript.php
            if (
              !resolveUserSetNames.some(
                (resolveUserSetName) =>
                  resolveUserSetName.photoSetId === checkedSetName.photoSetId
              )
            ) {
              // add setname to user
              insertSetNameById(checkedSetName.photoSetId, req.params.index);
            } else {
              //utils.log(`checkedSetName.photoSetName was found in resolveUserSetNames: ${checkedSetName.photoSetName}`)
            }
          });

          resolveUserSetNames.forEach((userSetName) => {
            if (
              !checkedSetNames.some(
                (checkedSetName) =>
                  checkedSetName.photoSetId === userSetName.photoSetId
              )
            ) {
              // remove setname from user
              deleteSetNameById(userSetName.photoSetId, req.params.index);
            } else {
              //utils.log(`userSetName.photoSetName was found in checkedSetNames: ${userSetName.photoSetName}`)
            }
          });
        }
      );
    })
    .catch((error) => {
      console.error(error);
    });

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
    else res.redirect("/users");
  });
});
module.exports = router;
