if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
//const getGallery = require("./getgallery")
var express = require("express"); // call expresss to be used by application
var app = express();
const flash = require("express-flash");
app.use(flash());
const mongoose = require('mongoose');
const utils = require("./utils");
//require('./models/HerbPic');
//mongoose.set('strictQuery', false);
const session = require("express-session");
var MemoryStore = require("memorystore")(session);
const path = require("path");
const VIEWS = path.join(__dirname, "views");
// routes
const authenticationroutes = require("./routes/authentication"); // login, logout, register
const dbroutes = require("./routes/db"); //create tables, update db, upload json, sql query
const herbroutes = require("./routes/herb"); //edit, display herb
//const indexroute = require("./routes/index"); // index
const galleryroutes = require("./routes/gallery"); //gallery, filterherbs
const usersroutes = require("./routes/users"); //users
const userprofile = require("./routes/userprofile"); 
const mentionslegales = require("./routes/mentionslegales"); 
const legalnotice = require("./routes/legalnotice"); 
const uploadherbpics = require("./routes/herbpic"); 
const secret = require("./secret");
app.use(authenticationroutes);
app.use(dbroutes);
app.use(herbroutes);
//app.use(indexroute);
app.use(galleryroutes);
app.use(usersroutes);
app.use(userprofile);
app.use(uploadherbpics);
app.use(mentionslegales);
app.use(legalnotice);
// end of routes
app.use(express.static("scripts"));
app.use(express.static("images"));
app.use(express.static("models"));
//app.use(express.static(path.join(__dirname, '/models')));
app.use(express.urlencoded({ extended: false }));
app.set('trust proxy', 1);
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    resave: false,
    store: new MemoryStore({
      
      //https://github.com/HubSpot/oauth-quickstart-nodejs/issues/15
      //https://www.npmjs.com/package/memorystore
      checkPeriod: 86400000, // prune expired entries every 24h
    }),
  })
);
/*mongoose.connect(secret.mongoURI,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log('Connected to MongoDB');
  }
  );*/

app.set("view engine", "pug");
//set up the environment for the app to run
app.listen(process.env.PORT || 3500, process.env.IP || "0.0.0.0", function () {
  if (!process.env.PORT) utils.log("app is running on port 3500");
});

app.get("/", (req, res) => res.render("views/index"));
////https://nodejs.dev/learn/update-all-the-nodejs-dependencies-to-their-latest-version
//if(process.env.NODE_ENV != 'production'){
// }
