const MealsService = {
    getAllMeals(knex) {
        return knex.select('*').from('meals_list')
    },

    getById(knex, id) {
        return knex.from('meals_list').select('*').where('id', id).first()
    },

}



module.exports = MealsService



// Functions commented out to be implemented at a later date for the admin side