const mongo = require("mongodb").MongoClient;
const generateUsers = require("./utils").generateUsers;

const URL = "mongodb://localhost:27017";
const DB = "test";
const COLLECTION = "Users";

const connect = (callback, args) => {
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

      const db = client.db(DB);
      const collection = db.collection(COLLECTION);

      callback
        .bind({ collection: collection, ...args })()
        .then(() => {
          client.close();
        })
        .catch((err) => console.error(err));

      // const close = client.close();
    }
  );
};

/**
 * delete the given user if their password matches
 * must bind userId and password to the function upon calling it
 */
async function deleteUser() {
  try {
    const item = await this.collection.deleteOne({
      $and: [{ userId: this.userId }, { password: this.password }],
    });
  } catch (err) {
    console.error(err);
  }
}

/**
 * fetch users
 */
async function fetchUsers() {
  try {
    const items = await this.collection.find({}).toArray();
    console.log(items);
  } catch (err) {
    console.error(err);
  }
}

/**
 * add users
 * must bind a users object to the function upon calling it
 * [{userId: <userId>, password: <password>},...]
 */
async function addUsers() {
  try {
    const items = await this.collection.insertMany(this.users);
    console.log(items);
  } catch (err) {
    console.error(err);
  }
}

// connect(addUsers, { users: generateUsers(1) });
connect(addUsers, { users: [{ userId: "a", password: "a" }] });
connect(deleteUser, { userId: "a", password: "a" });
connect(fetchUsers);

module.exports = {
  deleteUser: deleteUser,
  connect: connect,
  fetchUsers: fetchUsers,
};
