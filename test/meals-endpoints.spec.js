const { expect } = require("chai");
const knex = require("knex");
const supertest = require("supertest");
const app = require("../src/app");
const { makeMeals } = require("./meals.fixtures");

describe("Meals Endpoints", () => {
  let db;

  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set("db", db);
  });

  after("disconnect from db", () => db.destroy());

  before("clean the table", () => db("meals_list").truncate());

  afterEach("cleanup", () => db("meals_list").truncate());

  // ====================
  //         GET
  // ====================

  describe(`GET /api/meals`, () => {
    context("Given there are no meals in the database", () => {
      it(`responds with 200 and empty list`, () => {
        return supertest(app)
          .get("/api/meals")
          .set(`Authorization`, `Bearer ${process.env.API_TOKEN}`)
          .expect(200, []);
      });
    });
  });

  describe(`GET /api/meals/:meal_id`, () => {
    context(`Given there are no meals in the database`, () => {
      it(`responds with 404`, () => {
        const mealId = 123456;
        return supertest(app)
          .get(`/api/meals/${mealId}`)
          .set(`Authorization`, `Bearer ${process.env.API_TOKEN}`)
          .expect(404, {
            error: { message: `Sorry, we don't offer that just yet!` },
          });
      });
    });
  });

  describe(`GET /api/meals`, () => {
    context("Given there are meals in the database", () => {
      const testMeals = makeMeals();

      beforeEach("insert meals", () => {
        return db.into("meals_list").insert(testMeals);
      });

      it(`GET /api/meals responds with 200 and all of the meals`, () => {
        return supertest(app)
          .get("/api/meals")
          .set(`Authorization`, `Bearer ${process.env.API_TOKEN}`)
          .expect(200, testMeals);
      });
    });
  });

  describe(`GET /api/meals/:meal_id`, () => {
    context(`Given there are meals in the database`, () => {
      const testMeals = makeMeals();

      beforeEach("insert meals", () => {
        return db.into("meals_list").insert(testMeals);
      });

      it(`responds with 200 and the specified meal`, () => {
        const mealId = 2;
        const expectedMeal = testMeals[mealId - 1];
        return supertest(app)
          .get(`/api/meals/${mealId}`)
          .set(`Authorization`, `Bearer ${process.env.API_TOKEN}`)
          .expect(200, expectedMeal);
      });
    });
  });
});
