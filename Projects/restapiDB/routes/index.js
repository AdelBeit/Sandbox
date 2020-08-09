const express = require("express");
const router = express.Router();
const TOKEN_SECRET = require("./token");
const jwt = require("jsonwebtoken");

// token authentication
function authenticateToken(req, res, next) {
  // get jwt access token from req header
  const authHeader = req.headers["authorization"];
  let token = authHeader && authHeader.split(" ")[1];

  token = req.session.token;
  if (token == null) return res.redirect("/login"); // if there isn't any token

  jwt.verify(token, TOKEN_SECRET, (err, user) => {
    console.log(err);
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

/* GET home page*/
router.get("/", authenticateToken, function (req, res, next) {
  res.render("index", { title: "Express" });
});

module.exports = router;
