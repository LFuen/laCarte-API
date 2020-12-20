const path = require('path')
const express = require('express')
const MealsService = require('./mealsService')
const mealsRouter = express.Router()



const serializeMeal = meal => ({
    id: meal.id,
    meal_name: meal.meal_name,
    img_url: meal.img_url,
    ingredients: meal.ingredients,
    chef: meal.chef,
    origin: meal.origin
})


// =================================================
// GET '/' and '/:meals_id'
// =================================================


mealsRouter
    .route('/')
    .get((req, res, next) =>{
        MealsService.getAllMeals(req.app.get('db'))
        .then((meals) => {
            res.json(meals.map(serializeMeal))
        })
        .catch(next)
    })


mealsRouter
    .route('/:meal_id')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        MealsService.getById(knexInstance, req.params.meal_id)
        .then(meal => {
            if(!meal) {
                return res.status(404).json({
                    error: {message: `Sorry, we don't offer that just yet!`}
                })
            }
            res.json(serializeMeal(meal))
        })
        .catch(next)
    })


    module.exports = mealsRouter


