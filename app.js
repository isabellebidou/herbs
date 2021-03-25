if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
//const getGallery = require("./getgallery")
var express = require("express"); // call expresss to be used by application
var app = express();
const session = require("express-session");
var MemoryStore = require("memorystore")(session);
const path = require("path");
const VIEWS = path.join(__dirname, "views");
// routes
const authenticationroutes = require("./routes/authentication"); // login, logout, register
const dbroutes = require("./routes/db"); //create tables, update db, upload json, sql query
const photoroutes = require("./routes/photo"); //edit, display photo
const indexroute = require("./routes/index"); // index
const galleryroutes = require("./routes/gallery"); //gallery, filterphotos
app.use(authenticationroutes);
app.use(dbroutes);
app.use(photoroutes);
app.use(indexroute);
app.use(galleryroutes);
// end of routes
app.use(express.static("scripts"));
app.use(express.static("images"));
app.use(express.urlencoded({ extended: false }));
app.use(
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

app.set("view engine", "pug");
//set up the environment for the app to run
app.listen(process.env.PORT || 7000, process.env.IP || "0.0.0.0", function () {
  if (!process.env.PORT) console.log("app is running on port 7000");
});

app.get("/", (req, res) => res.render("views/index"));
////https://nodejs.dev/learn/update-all-the-nodejs-dependencies-to-their-latest-version
//if(process.env.NODE_ENV != 'production'){
// }
