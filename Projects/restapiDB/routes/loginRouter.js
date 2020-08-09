const express = require("express");
const router = express.Router();

// get login page
router.get("/", function (req, res, next) {
  res.render("login", { title: "Login" });
});

module.exports = router;
