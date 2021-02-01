var express = require("express"); // call expresss to be used by application
var app = express();
// app.get('/', function(req,res){
//     res.send("hello beautuful world!");
//     console.log("Isabelle has spoken");
    
// });
var mysql = require('mysql'); // allow access to sql
var bodyParser = require('body-parser');
var behaviour = require('./behaviour.js');
//var utils = require('./utils.js');
const path = require('path');
const VIEWS = path.join(__dirname, 'views');
app.use(express.static("scripts"));
app.use(express.static("images"));
var session = require('express-session');
//var MySQLStore = require('express-mysql-session')(session);
app.use(bodyParser.urlencoded({
	extended: true
}));
app.set('view engine', 'pug');
// const db = mysql.createConnection({
//     host: 'isabellebidou.com',
//     user: '*******',
//     password: '****',
//     database: 'isabe***b',
//     port: 3306
// });
// db.connect((err) => {
// 	if (err) {

// 		throw (err)
// 	} else {
// 		console.log("db connected!");

// 	}
// });
var gallery = require("./models/gallery.json");
//var gallery = galleryFile.gallery;


//home page
app.get('/', function (req, res) {
	console.log("index ");


    res.render("index", {
		gallery: gallery
	});


	console.log('now you are on the galery');

});

//photo
app.get('/uploadphoto/:index', function (req, res) {

	console.log("params= " + req.params);

    //var indOne = null;
	function choosephoto(indOne) {
		return indOne.index === parseInt(req.params.index);
	}

	var indOne = gallery.filter(choosephoto);
	console.log(indOne);

	res.render('uploadphoto', {
		indOne: indOne
	});


	

});

//set up the environment for the app to run
app.listen(process.env.PORT || 7000, process.env.IP || "0.0.0.0" , function(){
    console.log("app is running");
})
////https://nodejs.dev/learn/update-all-the-nodejs-dependencies-to-their-latest-version

