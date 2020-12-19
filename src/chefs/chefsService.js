const ChefsService = {
    getAllChefs(knex) {
        return knex.select('*').from('chefs')
    },

    getById(knex, id) {
        return knex.from('chefs').select('*').where('id', id).first()
    },

}



module.exports = ChefsService