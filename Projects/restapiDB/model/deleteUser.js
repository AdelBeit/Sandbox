const oracledb = require("oracledb");
const config = {
  user: "user",
  password: "password",
  connectString: "string",
};

// verify given password then delete it
async function deleteUser(userId, password) {
  let fetchUser =
    "select password from users where user_id = :id and password = :password";
  let connection;
  try {
    connection = await oracledb.getConnection(config);

    const result = await connection.execute(fetchUser, [userId, password]);
  } catch (err) {
    console.log("Woah!", err);
  } finally {
    if (connection) {
      if (result) {
        if (result.password === password) {
          remove(userId, connection);
        }
      }
    }
  }
}

async function remove(userId, connection) {
  let deleteUser = "delete from users where user_id = :id";
  try {
    const result = await connection.execute(deleteUser, [userId]);
  } catch (err) {
    console.log("Ouch!", err);
  } finally {
    if (connection) {
      if (result) {
        console.log("deteled");
      }
      // connection assignment worked, need to close
      await connection.close();
    }
  }
}

module.exports = { deleteUser: deleteUser };
