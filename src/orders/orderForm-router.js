const path = require('path')
const express = reaquire('express')
const xss = require('xss')
const OrdersService = require('../orders/ordersService')
const { v4: uuid} = require('uuid')
const app = require("../app")
const ordersRouter = express.Router()
const jParse = express.json()



const serializeOrder = order => ({
    id: order.id,
    prim_add: xss(order.prim_add),
    sec_add: xss(order.sec_add),
    city: xss(order.city),
    state: xss(order.state),
    zip: xss(order.zip),
    phone: xss(order.phone)
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
        const {prim_add, sec_add, city, state, zip, phone} = req.body
        const newOrder = {prim_add, sec_add, city, state, zip, phone}

        for(const [key, value] of Object.entries(newOrder)) {
            if(value === null) {
                return res.status(400).json({
                    error: {message: `Missing '${key}' in request body.`}
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
                .location(`/orders/${order.id}`)
                .json(serializeOrder(order))
        })
        .catch(next)
    })


ordersRouter
    .route('/:order_id')
    .all((req, res, next) => {
        const knexInstance = req.app.get('db')
        OrdersService.getById(knexInstance, req.params.order_id)
            .then(order => {
                if(!order) {
                    return res.status(404).json({
                        error: {message: `That order does not exist.`}
                    })
                }
                res.json(serializeOrder(order))
            })
            .catch(next)
    })