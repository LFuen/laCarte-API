const express = require('express')
const CuisinesService = require('./cuisinesService')
const cuisinesRouter = express.Router()



const serializeCuisine = cuisine => ({
    id: cuisine.id,
    origin: cuisine.origin,
    meals: cuisine.meals,
})


cuisinesRouter
    .route('/')
    .get((req, res, next) =>{
        CuisinesService.getAllCuisines(req.app.get('db'))
        .then((cuisines) => {
            res.json(cuisines.map(serializeCuisine))
        })
        .catch(next)
    })


cuisinesRouter
    .route('/:cuisine_id')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        cuisinesService.getById(knexInstance, req.params.cuisine_id)
        .then(cuisine => {
            if(!cuisine) {
                return res.status(404).json({
                    error: {message: `Sorry, we don't offer meals from that region just yet!`}
                })
            }
            res.json(serializeCuisine(cuisine))
        })
        .catch(next)
    })


    module.exports = cuisinesRouter