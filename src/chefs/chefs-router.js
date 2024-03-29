const express = require("express");
const ChefsService = require("./chefsService");
const chefsRouter = express.Router();

const serializeChef = (chef) => ({
  id: chef.id,
  chef_name: chef.chef_name,
  bio: chef.bio,
  cuisine: chef.cuisine,
  schedule: chef.schedule,
});

chefsRouter.route("/").get((req, res, next) => {
    console.log('beginning of chef route')
  ChefsService.getAllChefs(req.app.get("db"))
    .then((chefs) => {
      console.log(chefs, 'chefs')
      res.json(chefs.map(serializeChef));
    })
    .catch(next);
});

chefsRouter.route("/:chef_id").get((req, res, next) => {
  const knexInstance = req.app.get("db");
  ChefsService.getById(knexInstance, req.params.chef_id)
    .then((chef) => {
      if (!chef) {
        return res.status(404).json({
          error: { message: `Sorry, that Chef doesn't work here!` },
        });
      }
      res.json(serializeChef(chef));
    })
    .catch(next);
});

module.exports = chefsRouter;
