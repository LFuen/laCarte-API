const { expect } = require("chai");
const knex = require("knex");
const supertest = require("supertest");
const app = require("../src/app");
const { makeChefs } = require("./chefsfixtures");

describe("Chefs Endpoints", () => {
  let db;

  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set("db", db);
  });

  after("disconnect from db", () => db.destroy());

  before("clean the table", () => db("chefs").truncate());

  afterEach("cleanup", () => db("chefs").truncate());

  // ====================
  //         GET
  // ====================

  describe(`GET /api/chefs`, () => {
    context("Given there are no chefs in the database", () => {
      it(`responds with 200 and empty list`, () => {
        return supertest(app)
          .get("/api/chefs")
          .set(`Authorization`, `Bearer ${process.env.API_TOKEN}`)
          .expect(200, []);
      });
    });
  });

  describe(`GET /api/chefs/:chef_id`, () => {
    context(`Given there are no chefs in the database`, () => {
      it(`responds with 404`, () => {
        const chefId = 123456;
        return supertest(app)
          .get(`/api/chefs/${chefId}`)
          .set(`Authorization`, `Bearer ${process.env.API_TOKEN}`)
          .expect(404, {
            error: { message: `Sorry, that Chef doesn't work here!` },
          });
      });
    });
  });

  describe(`GET /api/chefs`, () => {
    context("Given there are chefs in the database", () => {
      const testChef = makeChefs();

      beforeEach("insert chefs", () => {
        return db.into("chefs").insert(testChef);
      });

      it(`GET /api/chefs responds with 200 and all of the chefs`, () => {
        return supertest(app)
          .get("/api/chefs")
          .set(`Authorization`, `Bearer ${process.env.API_TOKEN}`)
          .expect(200, testChef);
      });
    });
  });

  describe(`GET /api/chefs/:chef_id`, () => {
    context(`Given there are chefs in the database`, () => {
      const testChefs = makeChefs();

      beforeEach("insert chefs", () => {
        return db.into("chefs").insert(testChefs);
      });

      it(`responds with 200 and the specified chefs`, () => {
        const chefsId = 2;
        const expectedChefs = testChefs[chefsId - 1];
        return supertest(app)
          .get(`/api/chefs/${chefsId}`)
          .set(`Authorization`, `Bearer ${process.env.API_TOKEN}`)
          .expect(200, expectedChefs);
      });
    });
  });
});
