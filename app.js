if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const enforce = require('express-sslify');
var express = require("express"); // call expresss to be used by application
var app = express();
// a load balancer (e.g. Heroku). See further comments below
if (process.env.NODE_ENV === "production") {
  app.use(enforce.HTTPS({ trustProtoHeader: true }));
}

const flash = require("express-flash");
app.use(flash());

const compression = require ("compression");
const utils = require("./utils");

const session = require("express-session");
const RedisStore = require("connect-redis").default
const {createClient} = require( "redis")


// Initialize client.
let redisClient = createClient()
redisClient.connect().catch(console.error)

// Initialize store.
let redisStore = new RedisStore({
  client: redisClient,
  prefix: "myapp:",
})

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
//https://youtu.be/jZ6x5Ab7Bgc
app.use(compression({
  level:6
}))
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
app.use(express.static("models"));
app.use(express.static('public'))
app.use('/favicon.ico', express.static('./public/favicon.ico'));
//app.use(express.static(path.join(__dirname, '/models')));
app.use(express.urlencoded({ extended: false }));
app.set('trust proxy', 1);


// Initialize sesssion storage.
app.use(
  session({
    store: redisStore,
    resave: false, // required: force lightweight session keep alive (touch)
    saveUninitialized: false, // recommended: only save session when data exists
    resave: false,
    secret: process.env.SESSION_SECRET,
  })
)




app.set("view engine", "pug");
//set up the environment for the app to run
app.listen(process.env.PORT || 3500, process.env.IP || "0.0.0.0", function () {
  if (!process.env.PORT) utils.log("app is running on port 3500");
});

app.get("/", (req, res) => res.render("views/index"));
////https://nodejs.dev/learn/update-all-the-nodejs-dependencies-to-their-latest-version

