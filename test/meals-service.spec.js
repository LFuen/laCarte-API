
const MealsService = require('../src/mealsService')
const knex = require('knex')
const { expect } = require('chai')



describe(`Meals service object`, () => {
    let db
    let testMeals = [
        {
            id: 1,        
            meal_name: 'Grilled Cheese',
            img_url: 'https://grilledCheese.com',            
            ingredients: 'Cheese, Bread',
            chef: 'Melissa',
            origin: 'US'
        },
        {
            id: 2,
            meal_name: 'Burger',
            img_url: 'https://burger.com',            
            ingredients: 'Cheese, Bread, Meat',
            chef: 'Greg',
            origin: 'US'
        }
    ]

    before(() => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL
        })
    })

    before(() => db('meals_list').truncate())

    afterEach(() => db('meals_list').truncate())

    after(() =>  db.destroy())



// ===================================
// HAS Data TESTS
// ===================================

    context(`Given 'meals_list' has data`, () => {
        beforeEach(() => {
            return db
            .into('meals_list')
            .insert(testMeals)
        })

        it(`getAllMeals() resolves all meals from 'meals_list' table`, () => {
            return MealsService.getAllMeals(db)
            .then(actual => {
                expect(actual).to.eql(testMeals)
            })
        })

        it(`getById() resolves a meal by id from 'meals_list' table`, () => {
            const secondID = 2
            const secondMeal = testMeals[secondID - 1]
            return MealsService.getById(db, secondID)
                .then(actual => {
                    expect(actual).to.eql({
                        id: secondID,
                        meal_name: secondMeal.meal_name,
                        img_url: secondMeal.img_url,
                        ingredients: secondMeal.ingredients,
                        chef: secondMeal.chef,
                        origin: secondMeal.origin
                    })
                })
        })

        it(`deleteMeal() removes a meal by id from 'meals_list' table`, () => {
            const mealID = 3
            return MealsService.deleteMeal(db, mealID)
                .then(() => MealsService.getAllMeals(db))
                .then(allMeals => {
                    const expected = testMeals.filter(meal => meal.id !== mealID)
                    expect(allMeals).to.eql(expected)
                })
        })

        it(`updateMeal() updates a meal from the 'meals_list' table`, () => {
            const idOfMealToUpdate = 2
            const newMealData = {
                meal_name: 'Update Name',
                img_url: 'Update Picture',
                ingredients: 'Update Ingredients',
                chef: 'Update Chef',
                origin: 'Update Origin'
            }
            return MealsService.updateMeal(db, idOfMealToUpdate, newMealData)
                .then(() => MealsService.getById(db, idOfMealToUpdate))
                .then(meal => {
                    expect(meal).to.eql({
                        id: idOfMealToUpdate,
                        ...newMealData,
                    })
                })
        })
    })



// ===================================
// HAS NO Data TESTS
// ===================================


    context(`Given 'meals_list' has no data`, () => {
        it(`getAllMeals() resolves an empty array`, () => {
            return MealsService.getAllMeals(db)
                .then(actual => {
                    expect(actual).to.eql([])
                })
        })

        it(`insertMeal() inserts a new meal and resolves the new meal with an 'id'`, () => {
            const newMeal = {
                meal_name: 'New Meal',
                img_url: 'New Image URL',
                ingredients: 'New Ingredients',
                chef: 'New Chef',
                origin: 'New Origin'
            }
            return MealsService.insertMeal(db, newMeal)
                .then(actual => {
                    expect(actual).to.eql({
                        id: 1,
                        meal_name: newMeal.meal_name,
                        img_url: newMeal.img_url,
                        ingredients: newMeal.ingredients,
                        chef: newMeal.chef,
                        origin: newMeal.origin
                    })
                })
        })

    })






})