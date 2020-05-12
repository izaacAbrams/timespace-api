const xss = require("xss");
const bcrypt = require("bcryptjs");

const UsersService = {
  hasUserWithUserName(db, email) {
    return db("timespace_users")
      .where({ email })
      .first()
      .then((user) => !!user);
  },
  insertUser(db, newUser) {
    return db
      .insert(newUser)
      .into("timespace_users")
      .returning("*")
      .then(([user]) => user);
  },
  serializeUser(user) {
    return {
      name: xss(user.name),
      email: xss(user.email),
      password: xss(user.password),
    };
  },
  hashPassword(password) {
    return bcrypt.hash(password, 12);
  },
};

module.exports = UsersService;
