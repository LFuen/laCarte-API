const ChefsService = {
  getAllChefs(knex) {
    console.log(knex, 'knex printout')
    return knex.select("*").from("chefs");
  },

  getById(knex, id) {
    return knex.from("chefs").select("*").where("id", id).first();
  },
};

module.exports = ChefsService;
