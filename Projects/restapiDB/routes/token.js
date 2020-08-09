const express = require("express");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const router = express.Router();

// validate the user
// make token
// authenticate token

// make a secret
const TOKEN_SECRET = crypto.randomBytes(64).toString("hex");

/**
 * use the secret to make a jwt
 */

function generateAccessToken(username, password) {
  return jwt.sign({ username: username, password: password }, TOKEN_SECRET, {
    expiresIn: "600s",
  });
}

/**
 * validate credentials
 */
const authenticateUser = (req, res, next) => {
  const mockeduser = "a",
    mockedpassword = "a";
  if (req.body.username == mockeduser && req.body.password == mockedpassword) {
    req.loggedin = true;
    req.extras["verified"] = true;
  }
  next();
};

function getToken(req, res, next) {
  console.log(req.body);
  const token = generateAccessToken(req.body.username, req.body.password);
  // save token in session
  // get the session cookie
  // req.session.token = req.token;
  req.token = token;
  next();
}

router.get("*", (req, res) => {
  res.redirect("/");
});

// register a MW route to get the jwt
router.post("/getToken", authenticateUser, getToken, (req, res, next) => {
  // save token in session
  // get the session cookie
  req.session.token = req.token;
  // res.send(req.token);
  res.redirect("/");
});

// token authentication
function authenticateToken(req, res, next) {
  // get jwt access token from req header
  const authHeader = res.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401); // if there isn't any token

  jwt.verify(token, TOKEN_SECRET, (err, user) => {
    console.log(err);
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

module.exports = {
  router: router,
  TOKEN_SECRET: TOKEN_SECRET,
};
