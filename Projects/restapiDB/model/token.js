const jwt = require("jsonwebtoken");
const crypto = require("crypto");

// make a secret
const TOKEN_SECRET = crypto.randomBytes(64).toString("hex");
const SESSION_EXPIRATION = "300s";
const TOKEN_EXPIRATION = SESSION_EXPIRATION;

/**
 * use the secret to make a jwt
 */
function generateAccessToken(username, password) {
  return jwt.sign({ username: username, password: password }, TOKEN_SECRET, {
    expiresIn: TOKEN_EXPIRATION,
  });
}

/**
 * validate credentials
 */
const authenticateUser = (req, res, next) => {
  const mockeduser = "a",
    mockedpassword = "a";
  if (req.body.username == mockeduser && req.body.password == mockedpassword) {
    next();
  } else {
    res.redirect("/");
  }
};

function getToken(req, res, next) {
  const token = generateAccessToken(req.body.username, req.body.password);
  req.token = token;
  next();
}

/**
 * token authentication
 */
function authenticateToken(req, res, next) {
  // get jwt access token from req header
  const authHeader = req.headers["authorization"];
  let token = authHeader && authHeader.split(" ")[1];
  // save token in session
  token = req.session.token;
  if (token == null) return res.redirect("/login"); // if there isn't any token

  jwt.verify(token, TOKEN_SECRET, (err, user) => {
    if (err) res.redirect("/login");
    req.user = user;
    next();
  });
}

module.exports = {
  authenticateUser: authenticateUser,
  authenticateToken: authenticateToken,
  getToken: getToken,
};
