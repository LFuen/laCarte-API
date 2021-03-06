const path = require("path");
const express = require("express");
const xss = require("xss");
const UsersService = require("../users/usersService");

const usersRouter = express.Router();
const jParse = express.json();

const serializeUser = (user) => ({
  id: user.id,
  username: xss(user.username),
  email: xss(user.email),
  pass: xss(user.pass),
  subscription: xss(user.subscription),
});

usersRouter
  .route("/")
  .get((req, res, next) => {
    UsersService.getAllUsers(req.app.get("db"))
      .then((user) => {
        res.json(user.map(serializeUser));
      })
      .catch(next);
  })
  .post(jParse, (req, res, next) => {
    const { id, username, email, pass, subscription } = req.body;
    const newUser = { id, username, email, pass, subscription };

    for (const [key, value] of Object.entries(newUser)) {
      if (value === null) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in the request body.` },
        });
      }
    }

    UsersService.addUser(req.app.get("db"), newUser)
      .then((user) => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `${user.id}`))
          .json(serializeUser(user));
      })
      .catch(next);
  });

// ========================
//     /users/:user_id
// ========================

usersRouter
  .route("/:user_id")
  .all((req, res, next) => {
    UsersService.getById(req.app.get("db"), req.params.user_id)
      .then((user) => {
        if (!user) {
          return res.status(404).json({
            error: { message: `Sorry, that username isn't valid!` },
          });
        }
        res.user = user;
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    res.json(serializeUser(res.user));
  })
  .delete((req, res, next) => {
    UsersService.deleteUser(req.app.get("db"), req.params.user_id)
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  })
  .patch(jParse, (req, res, next) => {
    const { id, username, email, pass, subscription } = req.body;
    const userToUpdate = { id, username, email, pass, subscription };

    const numberOfValues = Object.values(userToUpdate).filter(Boolean).length;
    if (numberOfValues === 0) {
      return res.status(400).json({
        error: {
          message: `Request body must contain either 'username', 'email', 'pass', or 'subscription'`,
        },
      });
    }

    UsersService.updateUser(req.app.get("db"), req.params.user_id, userToUpdate)
      .then((numRowsAffected) => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = usersRouter;
