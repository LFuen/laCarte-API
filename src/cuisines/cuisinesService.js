const CuisinesService = {
  getAllCuisines(knex) {
    return knex.select("*").from("cuisines");
  },

  getById(knex, id) {
    return knex.from("cuisines").select("*").where("id", id).first();
  },
};

module.exports = CuisinesService;
