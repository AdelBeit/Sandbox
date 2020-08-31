const database = require("./dbUtils");

/**
 * validate credentials
 */
const authenticateUser = (req, res, next) => {
  function authenticate(user) {
    if (user) {
      if (
        req.body.username == user.userId &&
        req.body.password == user.password
      ) {
        // save user in session
        req.session.user = user.userId;
        next();
      } else {
        res.append("error-message", "incorrect password");
        res.redirect("/login");
      }
    } else {
      res.apend("error-message", "user not found");
      res.redirect("/login");
    }
  }
  // check db for user credentials
  database.getUser(req.body.username, authenticate);
};

module.exports = {
  authenticateUser: authenticateUser,
};
