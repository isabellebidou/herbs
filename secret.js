
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

var mysql = require("mysql");
// const db = mysql.createConnection({
//   host: "isabellebidou.com",
//   user: "isabelle_2",
//   password: "TheDuck21",
//   database: "isabelle_db",
//   port: 3306,
// });

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DB,
  port: process.env.DB_PORT,
});
module.exports = {
  db: db,
};
