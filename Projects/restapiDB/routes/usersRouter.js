const express = require("express");
const router = express.Router();

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.render("users", { title: "Users" });
});

router.post("/", function (req, res) {
  res.send(req.body);
});

module.exports = router;
