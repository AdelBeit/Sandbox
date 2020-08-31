const express = require("express");
const router = express.Router();
const token = require("../model/token");
const authenticateUser = require("../model/auth").authenticateUser;

/**
 * register a MW route to get the jwt
 */
router.post("/getToken", authenticateUser, token.getToken, (req, res, next) => {
  // go to home after login
  res.redirect("/");
});

/**
 * redirect all get requests, this page shouldn't be reachable without a post request
 */
router.get("*", (req, res) => {
  res.redirect("/");
});

module.exports = router;
