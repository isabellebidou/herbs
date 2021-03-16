const express = require("express");
const router = express.Router();

var categories = require("../models/categories.json");

//home page
router.get("/", function (req, res) {
  res.render("index", {
    categories
  });
});
module.exports = router;