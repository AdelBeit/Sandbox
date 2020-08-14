const express = require("express");
const router = express.Router();
const authenticateToken = require("../model/token").authenticateToken;

/* GET home page*/
router.get("/", authenticateToken, function (req, res, next) {
  res.render("home", { title: "Express", referer: req.headers.referer });
});

module.exports = router;
