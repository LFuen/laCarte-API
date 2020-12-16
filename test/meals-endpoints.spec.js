const { expect } = require('chai')
const knex = require('knex')
const supertest = require('supertest')
const app = require('../src/app')
const {makeMeals} = require('./meals.fixtures')



describe.only('Meals Endpoints', () => {
    let db

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL
        })
        app.set('db', db)
    })

    after('disconnect from db', () => db.destroy())

    before('clean the table', () => db('meals_list').truncate())

    afterEach('cleanup', () => db('meals_list').truncate())

// ====================================================
// NO -- MEALS -- IN DATABASE
// ==================================================== 

    describe(`GET /meals`, () => {
        context('Given there are no meals in the database', () => {
            it(`responds with 200 and empty list`, () => {
                return supertest(app)
                    .get('/meals')
                    .expect(200, [])
            })
        })
    })

    describe(`GET /meals/:meal_id`, () => {
        context(`Given there are no meals in the database`, () => {
            it(`responds with 404`, () => {
                const mealId = 123456
                return supertest(app)
                    .get(`/meals/${mealId}`)
                    .expect(404, {error: {message: `Sorry, we don't offer that just yet!`}})
            })
        })
    })



// ====================================================
// MEALS IN DATABASE
// ====================================================    

// ====================
//         GET
// ====================

    describe(`GET /meals`, () => {
        context('Given there are meals in the database', () => {
            const testMeals = makeMeals()

            beforeEach('insert meals', () => {
                return db
                    .into('meals_list')
                    .insert(testMeals)
            })

            it(`GET /meals responds with 200 and all of the meals`, () => {
                return supertest(app)
                    .get('/meals')
                    .expect(200, testMeals)
            })
        })
    })


    describe(`GET /meals/:meal_id`, () => {
        context(`Given there are meals in the database`, () => {
            const testMeals = makeMeals()

            beforeEach('insert meals', () => {
                return db
                    .into('meals_list')
                    .insert(testMeals)
            })   

            it(`responds with 200 and the specified meal`, () => {
                const mealId = 2
                const expectedMeal = testMeals[mealId - 1]
                return supertest(app)
                    .get(`/meals/${mealId}`)
                    .expect(200, expectedMeal)
            } )            
            
        })
    })
})


