
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
  }
  //https://youtu.be/TQU6BWtc3yc
  var mysql = require("mysql");
  const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DB,
    port: process.env.DB_PORT,
  });

  module.exports = {
    db: db,
    mongoURI: process.env.MONGO_URI
  };