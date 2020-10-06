const express = require("express");
const router = express.Router();

// get login page
router.get("/", function (req, res) {
  res.render("login", { title: "Login" });
});

module.exports = router;
