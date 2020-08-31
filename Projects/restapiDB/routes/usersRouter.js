const express = require("express");
const router = express.Router();
const authenticateToken = require("../model/token").authenticateToken;

/* GET users listing. */
router.get("/", authenticateToken, function (req, res) {
  res.render("users", { title: "Users", user: req.session.user });
});

router.post("/", authenticateToken, function (req, res) {
  res.send(req.body);
});

module.exports = router;
