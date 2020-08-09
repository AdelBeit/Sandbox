const express = require("express");
const router = express.Router();
const authenticateToken = require("../model/token").authenticateToken;
const jwt = require("jsonwebtoken");

/* GET home page*/
router.get("/", authenticateToken, function (req, res, next) {
  res.render("index", { title: "Express" });
});

module.exports = router;
