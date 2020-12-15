const MealsService = {
    getAllMeals(knex) {
        return knex.select('*').from('meals_list')
    },

    insertMeal(knex, newMeal) {
        return knex 
            .insert(newMeal)
            .into('meals_list')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },

    getById(knex, id) {
        return knex.from('meals_list').select('*').where('id', id).first()
    },

    deleteMeal(knex, id) {
        return knex('meals_list')
            .where({ id })
            .delete()
    },

    updateMeal(knex, id, newMealFields) {
        return knex('meals_list')
            .where({ id })
            .update(newMealFields)
    }
}



module.exports = MealsService