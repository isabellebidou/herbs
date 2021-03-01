if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

var express = require("express"); // call expresss to be used by application
const bcrypt = require("bcrypt");
var app = express();
const passport = require("passport");
const initializePassport = require("./passport-config");
const flash = require("express-flash");
const session = require("express-session");
const methodOverride = require("method-override");
const upload = require("./storage-config");
const utils = require("./utils");
var mysql = require("mysql"); // allow access to sql
var bodyParser = require("body-parser");
const path = require("path");
const VIEWS = path.join(__dirname, "views");
app.use(express.static("scripts"));
app.use(express.static("images"));
app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));
let index = 0;
const secret = require("./secret");
var globalGallery = [];
let filter = false;
var lastSearchItem = "";
var user = null;

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.set("view engine", "pug");

const db = secret.db;

db.connect((err) => {
  if (err) {
    throw err;
  } else {
    if (!process.env.PORT)
    console.log("db connected!");
  }
});
initializePassport(
  passport,
  (email) => {
    return new Promise(async (resolve, reject) => {
      //console.log(`making email request to db`);
      let sql = "select * FROM user WHERE userEmail = '" + email + "'";
      user = null;
      await db.query(sql, (err, rows) => {
        if (err) throw err;
        user = { ...rows[0] };
        if (rows.length) {
          resolve(user);
        } else reject(`no user with email:  ${email}`);
      });
    });
  },
  (id) => {
    return new Promise(async (resolve, reject) => {
      //console.log(`making id request to db`);
      let sql = "select * FROM user WHERE userId = '" + id + "'";
      await db.query(sql, (err, rows) => {
        if (err) throw err;
        user = { ...rows[0] };
        if (user != null) resolve(user);
        else reject(`no user with id:  ${id}`);
      });
    });
  }
);
//var upload = require("./models/gallery.json");
var categories = require("./models/categories.json");

//home page
app.get("/", function (req, res) {

  res.render("index", {
    root: VIEWS,
    categories,
  });
});

//gallery page
app.get("/gallery", function (req, res) {
  if (session.user)
  console.log(`user is logged in: ${session.user}`);
  let sql = "select * FROM photo ORDER BY photoId DESC; ";
  db.query(sql,async (err, gallery) => {
    if (err) throw err;
    globalGallery = gallery;
    filter = false;
    try {
      const dataList = await utils.findTagsList(globalGallery);
      res.render("gallery", {
        gallery: globalGallery,
        session: session,
        datalist: dataList,
      });
    } catch (error) {
      console.error(error)
    }
  });
});


//photo

app.get("/displayphoto/:index", function (req, res) {
  function choosephoto(indOne) {
    return indOne.photoId === parseInt(req.params.index);
  }
  function retreiveGalleryFromDb() {
    let sql = "select * FROM photo ORDER BY photoId DESC ; ";
    let query = db.query(sql, (err, res) => {
      if (err) throw err;
      return res;
    });
  }
  function findIndex(e, g) {
    var i = 0;
    for (i; i < g.length; i++) {
      if (e === g[i]) return i;
    }
  }

  globalGallery =
    globalGallery.length == 0 ? retreiveGalleryFromDb : globalGallery;
  try {
    var indOne = globalGallery.filter(choosephoto);
  } catch (e) {
    console.error(e);
    res.redirect("/gallery");
  }

  if (indOne == [] || indOne == undefined || !indOne) {
    res.redirect("/gallery");
  } else {
    //var myIndex = getIndOnePhotoId(indOne);
    res.render("displayphoto", {
      indOne: indOne,
      galleryLength: globalGallery.length,
      filter: filter,
    });
  }
});
app.post("/filterphotos", function (req, res) {
  filter = true;
  let sql =
    'select * FROM photo WHERE photoTags LIKE  "%' +
    req.body.search +
    '%" OR photoPlace LIKE "%' +
    req.body.search +
    '%" OR photoCountry LIKE "%' +
    req.body.search +
    '%" OR photoName LIKE "%' +
    req.body.search +
    '%" OR photoCategory LIKE "%' +
    req.body.search +
    '%"  ORDER BY photoId DESC;';
  lastSearchItem = req.body.search;

  let query = db.query(sql, (err, gallery) => {
    if (err) throw err;
    globalGallery = gallery;
    res.render("filterphotos", {
      gallery: globalGallery,
      searchItem: lastSearchItem,
    });
  });
});

app.get("/editphoto/:index", checkAuthenticated, function (req, res) {
  function choosephoto(indOne) {
    return indOne.index === parseInt(req.params.index);
  }

  var indOne = gallery.filter(choosephoto);
  index = indOne.index;
  res.render("editphoto", {
    indOne: indOne,
  });
});
app.post("/editphoto/:index", checkAuthenticated, function (req, res) {
  //photoName, photoThumbnail, photoCategory, photoCountry, photoPlace, photoComments, photoTags, photoPath
  let sql =
    'UPDATE photo SET photoName= "' +
    req.body.newname +
    '" , photoThumbnail = "' +
    req.body.newthumbnail +
    '", photoCategory = "' +
    req.body.newcategory +
    '", photoCountry = "' +
    req.body.newcountry +
    '",photoPlace = "' +
    req.body.newplace +
    '", photoComments = "' +
    req.body.newcomments +
    '", photoTags = "' +
    req.body.newTags +
    '", photoPath = "http://isabellebidou.com/images/ ' +
    req.body.newname +
    '" WHERE photoId = "' +
    req.params.index +
    '" ;';

  let query = db.query(sql, (err, res1) => {
    if (err) throw err;
    //console.log(res1);
  });
  res.redirect("/");
});

app.post("/uploadphoto/:index", checkAuthenticated, function (req, res) {
  let sql =
    'INSERT INTO photo (photoName, photoThumbnail, photoCategory, photoCountry, photoPlace, photoComments, photoTags, photoPath) VALUES ("' +
    req.body.name +
    '","' +
    req.body.thumbnail +
    '","' +
    req.body.category +
    '","' +
    req.body.country +
    '","' +
    req.body.place +
    '","' +
    req.body.comments +
    '","' +
    req.body.tags +
    '","' +
    "http://isabellebidou.com/images/" +
    req.body.name +
    '");';
  let query = db.query(sql, (err, res1) => {
    if (err) throw err;
    console.error(res1);
  });
  if (req.params.index <= gallery.length) {
    let index = parseInt(req.params.index);
    let nextIndex = index + 1;
    res.redirect("/uploadphoto/" + nextIndex);
  } else {
    res.redirect("/");
  }
});
app.get("/uploadphotos/", checkAuthenticated, function (req, res) {
  for (i = 54; i < gallery.length; i++) {
    let photo = gallery[i];
    let sql =
      'INSERT INTO photo (photoName, photoThumbnail, photoCategory, photoCountry, photoPlace, photoYear,photoComments, photoTags, photoPath) VALUES ("' +
      photo.name +
      '","' +
      photo.thumbnail +
      '","' +
      photo.category +
      '","' +
      photo.country +
      '","' +
      photo.place +
      '","' +
      photo.year +
      '","' +
      photo.comments +
      '","' +
      photo.tags +
      '","' +
      "http://isabellebidou.com/images/" +
      photo.name +
      '");';
    let query = db.query(sql, (err, res1) => {
      if (err) throw err;
      console.error(res1);
    });
  }
  res.redirect("/");
});

app.get("/createphotocategorytable", function (req, res) {
  let sql =
    "CREATE TABLE photocategory (photoCategoryId int NOT NULL AUTO_INCREMENT PRIMARY KEY, photoCategoryName varchar(255) );";
  let query = db.query(sql, (err, res) => {
    if (err) throw err;
  });
});

app.get("/insertcategory/:cat", function (req, res) {
  let sql =
    'INSERT INTO photocategory (photoCategoryName) VALUES ("' +
    req.body.name +
    '","' +
    cat +
    '";';
  let query = db.query(sql, (err, res1) => {
    if (err) throw err;
    console.error(res1);
  });
});

app.get("/createphototable", function (req, res) {
  //name, thumbnail, category, country, place, comments, tags, path
  let sql =
    "CREATE TABLE photo (photoId int NOT NULL AUTO_INCREMENT PRIMARY KEY, photoName varchar(255), photoThumbnail varchar(255), photoCategory varchar(255),  photoCountry varchar(255),  photoPlace varchar(255), photoComments varchar(255), photoTags varchar(255), photoPath varchar(255));";
  let query = db.query(sql, (err, res) => {
    if (err) throw err;
  });
});
app.get("/createusertable", function (req, res) {
  let sql =
    "CREATE TABLE user (userId int NOT NULL AUTO_INCREMENT PRIMARY KEY, userFirstName varchar(255), userLastName varchar(255),userEmail varchar(255), userPassword varchar(255));";
  let query = db.query(sql, (err, res) => {
    if (err) throw err;
  });
});

app.get("/filterphotos", function (req, res) {
  let sql =
    'select * FROM photo WHERE photoTags LIKE  "%' +
    lastSearchItem +
    '%" OR photoPlace LIKE "%' +
    lastSearchItem +
    '%" OR photoCountry LIKE "%' +
    lastSearchItem +
    '%" OR photoName LIKE "%' +
    lastSearchItem +
    '%" OR photoCategory LIKE "%' +
    lastSearchItem +
    '%" ORDER BY photoId DESC;';
  //console.log(sql);

  let query = db.query(sql, (err, gallery) => {
    if (err) throw err;
    console.error(err);
    globalGallery = gallery;
    res.render("filterphotos", {
      gallery: globalGallery,
      searchItem: lastSearchItem,
    });
  });
});

app.get("/login", checkNotAuthenticated, (req, res) => {
  res.render("login", {
    //gallery: globalGallery,
  });
});

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/gallery",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

app.get("/register", checkNotAuthenticated, (req, res) => {
  res.render("register", {
    //gallery: globalGallery,
  });
});

app.post("/register", async (req, res) => {
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
app.delete("/logout", (req, res) => {
  session.user = null;
  req.logOut();
  res.redirect("/gallery");
});

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  next();
}
app.get("/uploadjson", function (req, res) {
  res.render("uploadjson", {
    root: VIEWS,
  });
});
app.post("/uploadjson", upload.single("json"), (req, res) => {
  //console.log(req.file.originalname);
  //console.log(req.file.filename);

  var newPhotos = require(`./models/${req.file.filename}`);
  for (i = 0; i < newPhotos.length; i++) {
    let photo = newPhotos[i];
    let sql =
      'INSERT INTO photo (photoName, photoThumbnail, photoCategory, photoCountry, photoPlace, photoYear,photoComments, photoTags, photoPath) VALUES ("' +
      photo.name +
      '","' +
      photo.thumbnail +
      '","' +
      photo.category +
      '","' +
      photo.country +
      '","' +
      photo.place +
      '","' +
      photo.year +
      '","' +
      photo.comments +
      '","' +
      photo.tags +
      '","' +
      "http://isabellebidou.com/images/" +
      photo.name +
      '");';
    let query = db.query(sql, (err, res1) => {
      if (err) throw err;
      console.error(res1);
      //console.log(`res1= ${JSON.stringify(res1)}`);
      //console.log("status ok");
    });
  }
  res.redirect("/gallery");
  //return res.json({ status: 'OK' });
});

app.post("/updatedb", (req, res) => {
  let sql = req.body.sql;
  //let sql = `UPDATE photo SET photoPlace='' WHERE photoCountry='seychelles';`;

  let query = db.query(sql, (err, res1) => {
    if (err) throw err;
    console.error(res1);
    //console.log(`res1= ${JSON.stringify(res1)}`);
    //console.log(sql);
  });
});

app.get("/updatedb", checkAuthenticated, function (req, res) {
  res.render("updatedb", {
    root: VIEWS,
  });
});

//set up the environment for the app to run
app.listen(process.env.PORT || 7000, process.env.IP || "0.0.0.0", function () {
  if (!process.env.PORT)
  console.log("app is running on port 7000");
});
app.get("/", (req, res) => res.render("views/index"));
////https://nodejs.dev/learn/update-all-the-nodejs-dependencies-to-their-latest-version
//if(process.env.NODE_ENV != 'production'){
// }

