var mysql = require("mysql");
const db = mysql.createConnection({
  host: "isabellebidou.com",
  user: "isabelle_2",
  password: "TheDuck21",
  database: "isabelle_db",
  port: 3306,
});
module.exports = {
  db: db,
};
