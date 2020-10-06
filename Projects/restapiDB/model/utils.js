const generateUsers = (amount) => {
  let users = [];
  for (let i = 0; i < amount; i++) {
    users.push(generateUser());
  }
  return users;
};

const generateUser = () => {
  const names = [
    "robert",
    "gilbert",
    "david",
    "ben",
    "tom",
    "terry",
    "josh",
    "alex",
  ];
  const name = names[Math.floor(Math.random() * (names.length - 1))];
  return { userId: name, password: "a" };
};

module.exports = {
  generateUsers: generateUsers,
};
