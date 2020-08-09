const express = require("express");
const router = express.Router();
const token = require("../model/token");

/**
 * register a MW route to get the jwt
 */
router.post(
  "/getToken",
  token.authenticateUser,
  token.getToken,
  (req, res, next) => {
    // save token in session
    // get the session cookie
    req.session.token = req.token;
    res.redirect("/");
  }
);

router.get("*", (req, res) => {
  res.redirect("/");
});

module.exports = router;
