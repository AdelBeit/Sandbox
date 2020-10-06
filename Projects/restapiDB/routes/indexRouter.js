const express = require("express");
const router = express.Router();
const authenticateToken = require("../model/token").authenticateToken;

/* GET home page*/
router.get(["/", "/home"], authenticateToken, function (req, res) {
  res.render("home", { title: "Express" });
});

module.exports = router;
