require('dotenv').config();
const express = require('express');
const knex = require('knex');
const app = express();
const MealsService = require('./mealsService')


const data = 'meals_list'
const PORT = process.env.PORT || 3000;

const knexInstance = knex({
    client: 'pg',
    connection: process.env.DB_URL
})


MealsService.getAllMeals(knexInstance)
    .then(meals => console.log(meals))
    .then(() => 
        MealsService.insertMeal(knexInstance, {
            meal_name: 'New Meal',
            img_url: 'New Image',
            ingredients: 'New Ingredients',
            chef: 'Chef Name',
            origin: 'Origin Name'
        })
    )
    .then(newMeal => {
        console.log(newMeal)
        return MealsService.updateMeal(
            knexInstance,
            newMeal.id,
            {meal_name: 'Updated Name'}
        ).then(() => MealsService.getById(knexInstance, newMeal.id))
    })
    .then(meal => {
        console.log(meal)
        return MealsService.deleteMeal(knexInstance, meal.id)
    })




app.get('/api/*', (req, res) => {
    res.json({ok: true});
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

module.exports = {app};