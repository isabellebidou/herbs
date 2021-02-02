var express = require("express"); // call expresss to be used by application
var app = express();
// app.get('/', function(req,res){
//     res.send("hello beautuful world!");
//     console.log("Isabelle has spoken");

// });
var mysql = require("mysql"); // allow access to sql
var bodyParser = require("body-parser");
var behaviour = require("./behaviour.js");
//var utils = require('./utils.js');
const path = require("path");
const VIEWS = path.join(__dirname, "views");
app.use(express.static("scripts"));
app.use(express.static("images"));
let index = 0;
var session = require("express-session");
//var MySQLStore = require('express-mysql-session')(session);
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.set("view engine", "pug");
const db = mysql.createConnection({
  host: "isabellebidou.com",
  user: "********",
  password: "********",
  database: "**********",
  port: 3306,
});
db.connect((err) => {
  if (err) {
    throw err;
  } else {
    console.log("db connected!");
  }
});
var gallery = require("./models/gallery.json");
var categories = require("./models/categories.json");
//var gallery = galleryFile.gallery;

//home page
app.get("/", function (req, res) {
  res.render("index", {
    categories: categories,
  });
});

//gallery page
app.get("/gallery", function (req, res) {
  console.log("gallery.length");
  console.log(gallery.length);

  res.render("gallery", {
    gallery: gallery,
  });
});

//photo
app.get("/uploadphoto/:index", function (req, res) {
  function choosephoto(indOne) {
    return indOne.index === parseInt(req.params.index);
  }

  var indOne = gallery.filter(choosephoto);
  index = indOne.index;
  console.log("indOne");
  console.log(indOne);

  res.render("uploadphoto", {
    indOne: indOne,
  });
});

//photo
app.get("/editphoto/:index", function (req, res) {
  function choosephoto(indOne) {
    return indOne.index === parseInt(req.params.index);
  }

  var indOne = gallery.filter(choosephoto);
  index = indOne.index;
  console.log("indOne");
  console.log(indOne);

  res.render("editphoto", {
    indOne: indOne,
  });
});
app.post("/editphoto/:index", function (req, res) {
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
    console.log(res1);
  });
  res.redirect("/");
});

app.post("/uploadphoto/:index", function (req, res) {
  console.log("req.params.index: " + req.params.index);
  // console.log(JSON.stringify(req.body, null, 4));

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
    console.log(res1);
  });
  if (req.params.index <= gallery.length) {
    let index = parseInt(req.params.index);
    let nextIndex = index + 1;
    res.redirect("/uploadphoto/" + nextIndex);
  } else {
    res.redirect("/");
  }
});
app.get("/uploadphotos/", function (req, res) {
  for (i = 54; i < gallery.length; i++) {
    let photo = gallery[i];
    let sql =
      'INSERT INTO photo (photoName, photoThumbnail, photoCategory, photoCountry, photoPlace, photoComments, photoTags, photoPath) VALUES ("' +
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
      photo.comments +
      '","' +
      photo.tags +
      '","' +
      "http://isabellebidou.com/images/" +
      photo.name +
      '");';
    let query = db.query(sql, (err, res1) => {
      if (err) throw err;
      console.log(res1);
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
  console.log(cat);
  let sql =
    'INSERT INTO photocategory (photoCategoryName) VALUES ("' +
    req.body.name +
    '","' +
    cat +
    '";';
  let query = db.query(sql, (err, res1) => {
    if (err) throw err;
    console.log(res1);
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

//set up the environment for the app to run
app.listen(process.env.PORT || 7000, process.env.IP || "0.0.0.0", function () {
  console.log("app is running");
});
////https://nodejs.dev/learn/update-all-the-nodejs-dependencies-to-their-latest-version
