const path = require('path')
const express = require('express')
const xss = require('xss')
const OrdersService = require('../orders/ordersService')
const ordersRouter = express.Router()
const jParse = express.json()



const serializeOrder = order => ({
    id: order.id,
    prim_add: xss(order.prim_add),
    sec_add: xss(order.sec_add),
    city: xss(order.city),
    state: xss(order.state),
    zip: xss(order.zip),
    phone: xss(order.phone),
    meal: xss(order.meal)
})


// =================================================
// GET '/' and '/:order_id'
// =================================================


ordersRouter
    .route('/')
    .get((req, res, next) => {
        OrdersService.getAllOrders(req.app.get('db'))
        .then((order) => {
            res.json(order.map(serializeOrder))
        })
        .catch(next)
    })
    .post(jParse, (req, res, next) => {
        const {id, prim_add, sec_add, city, state, zip, phone, meal} = req.body
        const newOrder = {id, prim_add, sec_add, city, state, zip, phone, meal}

        for(const [key, value] of Object.entries(newOrder)) {
            if(value === null) {
                return res.status(400).json({
                    error: {message: `Missing '${key}' in the request body.`}
                })
            }
        }

        OrdersService.addOrder(
            req.app.get('db'),
            newOrder
        )
        .then(order => {
            res
                .status(201)
                .location(path.posix.join(req.originalUrl, `${order.id}`))
                .json(serializeOrder(order))
        })
        .catch(next)
    })


ordersRouter
    .route('/:order_id')
    .all((req, res, next) => {
        OrdersService.getById(
            req.app.get('db'),
            req.params.order_id
            )
                .then(order => {
                    if(!order) {
                        return res.status(404).json({
                            error: {message: `Sorry, that order isn't valid!`}
                        })
                    }
                    res.order = order
                    next()
                })
                .catch(next)
    })
    .get((req, res, next) => {
        res.json(serializeOrder(res.order))
    })
    .delete((req, res, next) => {
        OrdersService.deleteOrder(
            req.app.get('db'),
            req.params.order_id
        )
            .then(() => {
                res.status(204).end()
            })
            .catch(next)
    })
    .patch(jParse, (req, res, next) => {
        const {id, prim_add, sec_add, city, state, zip, phone, meal} = req.body
        const orderToUpdate = {id, prim_add, sec_add, city, state, zip, phone, meal}

        const numberOfValues = Object.values(orderToUpdate).filter(Boolean).length
        if(numberOfValues === 0) {
            return res.status(400).json({
                error: {
                    message: `Request body must contain either 'prim_add', 'sec_add', 'city', 'state', 'zip', 'phone', or 'meal'`
                }
            })
        }

        OrdersService.updateOrder(
            req.app.get('db'),
            req.params.order_id,
            orderToUpdate
        )
        .then(numRowsAffected => {
            res.status(204).end()
        })
        .catch(next)
    })


module.exports = ordersRouter