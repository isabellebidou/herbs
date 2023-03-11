//https://youtu.be/ysS4sL6lLDU?list=PLs7LQzp-tbVpNeo5thPa-A7KR-0sZJXto

const multer = require("multer");
const path = require("path");
//const uuid = require("uuid").v4;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "models/");
  },
  filename: (req, file, cb) => {
    const { originalname } = file;
    cb(null, originalname);
  },
  filetype: (req, file, cb) => {
    const { mimetype } = file;
    cb(null, mimetype);
  },
 
});
const upload = multer({ storage }); // or simply { dest: 'uploads/' }

module.exports = upload;
