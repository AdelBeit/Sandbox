const express = require("express");
const router = express.Router();

router.all("/", (req, res) => {
  req.session.destroy();
  res.redirect("/login");
});

module.exports = router;
