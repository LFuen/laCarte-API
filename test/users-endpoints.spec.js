const { expect } = require("chai");
const knex = require("knex");
const supertest = require("supertest");
const { patch } = require("../src/app");
const app = require("../src/app");
const { newUser, noBuenoAttack } = require("./users.fixtures");

describe("Users Endpoints", () => {
  let db;

  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set("db", db);
  });

  after("disconnect from db", () => db.destroy());

  before("clean the table", () => db("users").truncate());

  afterEach("cleanup", () => db("users").truncate());

  // ====================================================
  // ====================================================
  // UNAUTHORIZED
  //    REQUESTS
  // ====================================================
  // ====================================================

  describe(`Unauthorized requests`, () => {
    const testUsers = newUser();

    beforeEach(`insert users`, () => {
      return db.into("users").insert(testUsers);
    });

    it(`responds with 401 Unauthorized for GET /api/users`, () => {
      return supertest(app)
        .get(`/api/users`)
        .expect(401, { error: `Unauthorized Request` });
    });

    it(`responds with 401 Unauthorized for POST /api/users`, () => {
      return supertest(app)
        .post(`/api/users`)
        .send({
          username: "Test Username",
          email: "testEmail@somewhere.com",
          pass: "TestPass",
          subscription: "TestSubscription",
        })
        .expect(401, { error: `Unauthorized Request` });
    });

    it(`responds with 401 Unauthorized for GET /api/:user_id`, () => {
      const secondUser = testUsers[1];

      return supertest(app)
        .get(`/api/users/${secondUser.id}`)
        .expect(401, { error: `Unauthorized Request` });
    });

    it(`responds with 401 Unauthorized for DELETE /api/users/:user_id`, () => {
      const aUser = testUsers[1];

      return supertest(app)
        .delete(`/api/users/${aUser.id}`)
        .expect(401, { error: `Unauthorized Request` });
    });
  });

  // ====================================================
  // ====================================================
  // UNAUTHORIZED
  //    REQUESTS
  // ====================================================
  // ====================================================

  describe(`GET /api/users`, () => {
    context("Given there are no users in the database", () => {
      it(`responds with 200 and empty list`, () => {
        return supertest(app)
          .get("/api/users")
          .set(`Authorization`, `Bearer ${process.env.API_TOKEN}`)
          .expect(200, []);
      });
    });

    context(`Given there are users in the database`, () => {
      const testUsers = newUser();

      beforeEach(`insert users`, () => {
        return db.into("users").insert(testUsers);
      });

      it(`gets the users from the store`, () => {
        return supertest(app)
          .get(`/api/users`)
          .set(`Authorization`, `Bearer ${process.env.API_TOKEN}`)
          .expect(200, testUsers);
      });
    });

    context(`Given an XSS attack on users`, () => {
      const { userAttack, expectedUser } = noBuenoAttack();

      beforeEach(`insert bad user`, () => {
        return db.into("users").insert([userAttack]);
      });

      it(`removes no bueno XSS attack content`, () => {
        return supertest(app)
          .get(`/api/users`)
          .set(`Authorization`, `Bearer ${process.env.API_TOKEN}`)
          .expect(200)
          .expect((res) => {
            expect(res.body[0].username).to.eql(expectedUser.username);
            expect(res.body[0].email).to.eql(expectedUser.email);
            expect(res.body[0].pass).to.eql(expectedUser.pass);
            expect(res.body[0].subscription).to.eql(expectedUser.subscription);
          });
      });
    });
  });

  describe(`GET /api/users/:user_id`, () => {
    context(`Given there are no users in the database`, () => {
      it(`responds with 404`, () => {
        const userId = 123456;

        return supertest(app)
          .get(`/api/users/${userId}`)
          .set(`Authorization`, `Bearer ${process.env.API_TOKEN}`)
          .expect(404, {
            error: { message: `Sorry, that username isn't valid!` },
          });
      });
    });

    context(`Given there are users in the database`, () => {
      const testUsers = newUser();

      beforeEach(`insert users`, () => {
        return db.into(`users`).insert(testUsers);
      });

      it(`responds with 200 and the specified user`, () => {
        const userID = 3;
        const expectedUser = testUsers[userID - 1];

        return supertest(app)
          .get(`/api/users/${userID}`)
          .set(`Authorization`, `Bearer ${process.env.API_TOKEN}`)
          .expect(200, expectedUser);
      });
    });

    context(`Given an XSS user attack`, () => {
      const { userAttack, expectedUser } = noBuenoAttack();

      beforeEach(`insert bad user`, () => {
        return db.into(`users`).insert([userAttack]);
      });

      it(`removes no bueno XSS attack content`, () => {
        return supertest(app)
          .get(`/api/users/${userAttack.id}`)
          .set(`Authorization`, `Bearer ${process.env.API_TOKEN}`)
          .expect(200)
          .expect((res) => {
            expect(res.body.username).to.eql(expectedUser.username);
            expect(res.body.email).to.eql(expectedUser.email);
            expect(res.body.pass).to.eql(expectedUser.pass);
            expect(res.body.subscription).to.eql(expectedUser.subscription);
          });
      });
    });
  });

  describe(`GET /api/users`, () => {
    context("Given there are users in the database", () => {
      const testUsers = newUser();

      beforeEach("new order", () => {
        return db.into("users").insert(testUsers);
      });

      it(`GET /api/users responds with 200 and all of the users`, () => {
        return supertest(app)
          .get("/api/users")
          .set(`Authorization`, `Bearer ${process.env.API_TOKEN}`)
          .expect(200, testUsers);
      });
    });
  });

  describe(`GET /api/users/:user_id`, () => {
    context(`Given there are users in the database`, () => {
      const testUsers = newUser();

      beforeEach("new order", () => {
        return db.into("users").insert(testUsers);
      });

      it(`responds with 200 and the specified user`, () => {
        const userId = 2;
        const expectedUser = testUsers[userId - 1];

        return supertest(app)
          .get(`/api/users/${userId}`)
          .set(`Authorization`, `Bearer ${process.env.API_TOKEN}`)
          .expect(200, expectedUser);
      });
    });

    // =============================
    //         XSS ATTACK
    // =============================

    context(`Given an XSS attack as a user`, () => {
      const noBuenoUser = {
        id: 911,
        username: "No Bueno",
        email: "noGood@badPlace.com",
        pass: "NotCoolBro",
        subscription: "No Sign Up",
      };

      beforeEach(`insert mean user`, () => {
        return db.into("users").insert([noBuenoUser]);
      });

      it(`removes no bueno XSS attack content`, () => {
        return supertest(app)
          .get(`/api/users/${noBuenoUser.id}`)
          .set(`Authorization`, `Bearer ${process.env.API_TOKEN}`)
          .expect(200)
          .expect((res) => {
            expect(res.body.username).to.eql(`No Bueno`);
            expect(res.body.email).to.eql(`noGood@badPlace.com`);
            expect(res.body.pass).to.eql(`NotCoolBro`);
            expect(res.body.subscription).to.eql(`No Sign Up`);
          });
      });
    });
  });

  // ====================
  //         POST
  // ====================

  describe(`POST /api/users`, () => {
    const reqField = ["id", "username", "email", "pass", "subscription"];

    reqField.forEach((field) => {
      const newUserTest = {
        username: "Test User",
        email: "something@somewhere.com",
        pass: "Test Pass",
        subscription: "Late Nights",
      };
      it(`responds with 400 and an error message when the '${field}' is missing`, () => {
        newUserTest[field] = null;

        return supertest(app)
          .post(`/api/users`)
          .set(`Authorization`, `Bearer ${process.env.API_TOKEN}`)
          .send(newUserTest)
          .expect(400, {
            error: { message: `Missing '${field}' in the request body.` },
          });
      });
    });

    it(`creates a user, responding with 201 and the new user`, () => {
      const newUser = {
        username: "Test User",
        email: "something@somewhere.com",
        pass: "Test Pass",
        subscription: "Late Nights",
      };
      return supertest(app)
        .post(`/api/users`)
        .set(`Authorization`, `Bearer ${process.env.API_TOKEN}`)
        .send(newUser)
        .expect(201)
        .expect((res) => {
          expect(res.body.username).to.eql(newUser.username);
          expect(res.body.email).to.eql(newUser.email);
          expect(res.body.pass).to.eql(newUser.pass);
          expect(res.body.subscription).to.eql(newUser.subscription);
          expect(res.headers.location).to.eql(`/api/users/${res.body.id}`);
        })
        .then((postRes) =>
          supertest(app)
            .get(`/api/users/${postRes.body.id}`)
            .set(`Authorization`, `Bearer ${process.env.API_TOKEN}`)
            .expect(postRes.body)
        );
    });
  });

  // ====================
  //         DELETE
  // ====================

  describe(`DELETE /api/users/:user_id`, () => {
    context(`Given no users`, () => {
      it(`responds with 404`, () => {
        const userId = 123456;

        return supertest(app)
          .delete(`/api/users/${userId}`)
          .set(`Authorization`, `Bearer ${process.env.API_TOKEN}`)
          .expect(404, {
            error: { message: `Sorry, that username isn't valid!` },
          });
      });
    });

    context(`Given there are users in the database`, () => {
      const testUsers = newUser();

      beforeEach(`insert users`, () => {
        return db.into("users").insert(testUsers);
      });

      it(`responds with 204 and removes the user`, () => {
        const idToRemove = 2;
        const expectedUsers = testUsers.filter(
          (user) => user.id !== idToRemove
        );

        return supertest(app)
          .delete(`/api/users/${idToRemove}`)
          .set(`Authorization`, `Bearer ${process.env.API_TOKEN}`)
          .expect(204)
          .then((res) =>
            supertest(app)
              .get(`/api/users`)
              .set(`Authorization`, `Bearer ${process.env.API_TOKEN}`)
              .expect(expectedUsers)
          );
      });
    });
  });

  // ====================
  //        PATCH
  // ====================

  describe(`PATCH /api/users/:user_id`, () => {
    context(`Given no users`, () => {
      it(`responds with 404`, () => {
        const userID = 123456;

        return supertest(app)
          .patch(`/api/users/${userID}`)
          .set(`Authorization`, `Bearer ${process.env.API_TOKEN}`)
          .expect(404, {
            error: { message: `Sorry, that username isn't valid!` },
          });
      });
    });

    context(`Given there are users in the database`, () => {
      const testUsers = newUser();

      beforeEach(`insert users`, () => {
        return db.into(`users`).insert(testUsers);
      });

      it(`responds with 204 and updates the user`, () => {
        const idToUpdate = 2;
        const updateUser = {
          username: "Update User",
          email: "updatedEmail@somewhere.com",
          pass: "Updated Pass",
          subscription: "Updated Subscription",
        };
        const expectedUser = {
          ...testUsers[idToUpdate - 1],
          ...updateUser,
        };
        return supertest(app)
          .patch(`/api/users/${idToUpdate}`)
          .set(`Authorization`, `Bearer ${process.env.API_TOKEN}`)
          .send(updateUser)
          .expect(204)
          .then((res) => {
            supertest(app)
              .get(`/api/users/${idToUpdate}`)
              .set(`Authorization`, `Bearer ${process.env.API_TOKEN}`)
              .expect(expectedUser);
          });
      });

      it(`responds with 400 when no required fields are supplied`, () => {
        const idToUpdate = 2;

        return supertest(app)
          .patch(`/api/users/${idToUpdate}`)
          .set(`Authorization`, `Bearer ${process.env.API_TOKEN}`)
          .send({ irrelevantField: "sup yo" })
          .expect(400, {
            error: {
              message: `Request body must contain either 'username', 'email', 'pass', or 'subscription'`,
            },
          });
      });

      it(`responds with 204 when updating only a subset of fields`, () => {
        const idToUpdate = 2;
        const updateUser = {
          username: "Updated username",
        };
        const expectedUser = {
          ...testUsers[idToUpdate - 1],
          ...updateUser,
        };

        return supertest(app)
          .patch(`/api/users/${idToUpdate}`)
          .set(`Authorization`, `Bearer ${process.env.API_TOKEN}`)
          .send({
            ...updateUser,
            fieldToIgnore: "Should not be in GET response",
          })
          .expect(204)
          .then((res) => {
            supertest(app)
              .get(`/api/users/${idToUpdate}`)
              .set(`Authorization`, `Bearer ${process.env.API_TOKEN}`)
              .expect(expectedUser);
          });
      });
    });
  });
});
