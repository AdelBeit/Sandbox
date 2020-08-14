const mongo = require("mongodb").MongoClient;
const generateUsers = require("./utils").generateUsers;

const URL = "mongodb://localhost:27017";
const DBNAME = "test";
const COLLECTION = "Users";

/**
 * connect to db and perform various actions on it using the callback method
 *
 * @param {function} callback: queries to be performed on db
 * @param {object} args: an object that holds the required args for the callback method
 */
const query = (callback, args) => {
  mongo.connect(
    URL,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    (err, client) => {
      if (err) {
        console.error(err);
        return;
      }

      const db = client.db(DBNAME);
      const collection = db.collection(COLLECTION);

      // call the callback method with the given arguments then close connection
      callback
        .bind({ collection: collection, ...args })()
        .then(() => {
          client.close();
        })
        .catch((err) => console.error(err));
    }
  );
};

/**
 * delete the given user if their password matches
 * must bind userId and password to the function upon calling it
 */
async function remove() {
  try {
    const item = await this.collection.deleteOne({
      $and: [{ userId: this.user.userId }, { password: this.user.password }],
    });
    console.log(item);
  } catch (err) {
    console.error(err);
  }
}

/**
 * fetch users
 */
async function fetch() {
  try {
    const items = await this.collection.find({ userId: this.userId }).toArray();
    this.callback(items[0]);
  } catch (err) {
    console.error(err);
  }
}

/**
 * add users
 * must bind a users object to the function upon calling it
 */
async function add() {
  try {
    const items = await this.collection.insertMany(this.users);
    console.log(items);
  } catch (err) {
    console.error(err);
  }
}

/**
 * Wrapper for adding users
 *
 */
function addUsers(users = [{ userId: "a", password: "a" }]) {
  query(add, { users: users });
}

/**
 * Wrapper for deleting users
 */
function removeUser(user = { userId: "a", password: "a" }) {
  query(remove, { user: user });
}

/**
 * Wrapper for fetching users
 */
function getUser(
  userId = "a",
  callback = (i) => {
    console.log(i);
  }
) {
  query(fetch, {
    userId: userId,
    callback: callback,
  });
}

// removeUser();
// addUsers();
// getUser();

module.exports = {
  getUser: getUser,
  addUsers: addUsers,
  removeUser: removeUser,
  generateUsers: generateUsers,
};
