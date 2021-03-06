const express = require("express");
const UsersService = require("./users-service");
const path = require("path");

const usersRouter = express.Router();
const jsonParser = express.json();

usersRouter.post("/", jsonParser, (req, res, next) => {
  const { password, name, email } = req.body;

  for (const field of ["name", "password", "email"])
    if (!req.body[field])
      return res.status(400).json({
        error: `Missing '${field}' in request body`,
      });

  const passwordError = UsersService.validatePassword(password);

  if (passwordError) return res.status(400).json({ error: passwordError });

  UsersService.hasUserWithUserName(req.app.get("db"), email)
    .then((hasUserWithUserName) => {
      if (hasUserWithUserName)
        return res.status(400).json({
          error: `Username already taken`,
        });
      return UsersService.hashPassword(password).then((hashedPassword) => {
        const newUser = {
          name,
          password: hashedPassword,
          email,
        };

        return UsersService.insertUser(req.app.get("db"), newUser).then(
          (user) => {
            res
              .status(201)
              .location(path.posix.join(req.originalUrl, `/${user.id}`))
              .json(UsersService.serializeUser(user));
          }
        );
      });
    })
    .catch(next);
});

module.exports = usersRouter;
