const express_session = require("express-session");
const crypto = require("crypto");

// session secrets, to be converted to env variables later
const SESSION_SECRETS = [
  crypto.randomBytes(64).toString("hex"),
  crypto.randomBytes(64).toString("hex"),
  crypto.randomBytes(64).toString("hex"),
];
const SESSION_MAXAGE = 10 * 60 * 1000;

// session token options
const session = express_session({
  genid: function (req) {
    return crypto.randomBytes(64).toString("hex");
  },
  secret: SESSION_SECRETS,
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: SESSION_MAXAGE,
    secure: false,
  },
});

module.exports = session;
