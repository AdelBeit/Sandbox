const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const crypto = require("crypto");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const loginRouter = require("./routes/login");
const tokenRouter = require("./routes/token").router;
const loggerMW = require("./routes/logger");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(loggerMW);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// session secrets, to be converted to env variables later
// const SESSION_SECRETS = [
//   crypto.randomBytes(64).toString("hex"),
//   crypto.randomBytes(64).toString("hex"),
//   crypto.randomBytes(64).toString("hex"),
// ];
const SESSION_SECRETS = "hi";

// set session token
app.use(
  session({
    genid: function (req) {
      return "hi";
    },
    secret: "keyboard",
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 5 * 60 * 1000,
      secure: false,
    },
  })
);

// helper functions
/**
 * verify user is logged in otherwise redirect to login page
 */
// const loginStatus = (req, res, next) => {
//   if (!req.loggedin) {
//     // add mockloggedin to the request
//     req.loggedin = mockloggedin;
//     if (req.path != "/login" && !req.loggedin) {
//       res.redirect("/login");
//     } else {
//       req.loggedin = true;
//       next();
//     }
//   }
// };

// // MW
// // Check login status
// const mockloggedin = false;
// app.use(loginStatus);

app.use((req, res, next) => {
  req.extras = req.extras || {};
  req.extras["authorization"] = req.headers["authorization"] || "";
  req.extras["session-cookie"] = req.session;
  next();
});

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/login", loginRouter);
app.use("/api", tokenRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

app.post("/deleteAccount", function (req, res) {
  res.send("got it boss");
  // db call code
});

module.exports = app;
