const mongo = require("mongodb").MongoClient;
const generateUsers = require("./utils").generateUsers;

const URL = "mongodb://localhost:27017";
const DBNAME = "test";
const COLLECTION = "Users";

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

      callback
        .bind({ collection: collection, ...args })()
        .then((i) => {
          client.close();
          return i;
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
function getUsers(
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
//getUsers();

module.exports = {
  getUsers: getUsers,
  addUsers: addUsers,
  removeUser: removeUser,
  generateUsers: generateUsers,
};
