const logger = require("morgan");

// logger.token("referrer", (req, res) => {
//   req.extras["referer headers"] = req.headers["referer"];
//   return "/" + req.headers["referer"].split("/")[2];
// });
logger.token("form", (req, res) => {
  return JSON.stringify(req.body);
});
logger.token("extras", (req, res) => {
  return JSON.stringify(req.extras);
});
logger.token("status", (req, res) => {
  return JSON.stringify(req.loggedin);
});
logger.token("session", (req, res) => {
  return JSON.stringify(req.session);
});
logger.token("referer", (req, res) => {
  return JSON.stringify(req.session.referer);
});

logger.token(
  "custom",
  `:method 
referer: :referrer
request url: :url
form: :form
extras: :extras
login status: :status
---------------------`
);

logger.token(
  "session-only",
  `:method
referer: :referrer
request url: :url
session: :session
form: :form
---------------------`
);

module.exports = logger("session-only");
