const express = require("express");
const router = express.Router();

// get login page
router.get("/", function (req, res, next) {
  // if (!req.loggedin) {
  res.render("login", { title: "Login" });
  // } else {
  //   req.extras["where we headed"] = "to home";
  //   res.redirect("http://localhost:3000");
  // }
});

// // login the user
// router.post("/", function (req, res, next) {
//   if (req.loggedin) {
//     res.redirect("/api/getToken");
//   } else {
//     req.extras["loggedin"] = req.loggedin;
//     req.loggedin = req.loggedin;
//     res.redirect("http://localhost:3000");
//   }
// });

module.exports = router;
