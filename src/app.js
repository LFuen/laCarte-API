require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const {CLIENT_ORIGIN} = require('./config')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const MealsService = require('./meals/mealsService')
const OrdersService = require('./orders/ordersService')
const UsersService = require('./users/usersService')

const app = express()
const jParse = express.json()

const morganOption = (NODE_ENV === 'production')
    ? 'tiny'
    : 'common'

app.use(morgan(morganOption))
app.use(helmet())

app.use(cors({
    origin: CLIENT_ORIGIN
}))

// =================
// MEALS
// =================

app.get('/meals', (req, res, next) => {
    const knexInstance = req.app.get('db')
    MealsService.getAllMeals(knexInstance)
        .then(meals => {
            res.json(meals)
        })
        .catch(next)
})

app.get('/meals/:meal_id', (req, res, next) => {
    const knexInstance = req.app.get('db')
    MealsService.getById(knexInstance, req.params.meal_id)
        .then(meal => {
            if(!meal) {
                return res.status(404).json({
                    error: {message: `Sorry, we don't offer that just yet!`}
                })
            }
            res.json(meal)
        })
        .catch(next)
})

// =================
// MEALS
// =================



// =================
// ORDERS
// =================

app.get('/orders', (req, res, next) => {
    const knexInstance = req.app.get('db')
    OrdersService.getAllOrders(knexInstance)
        .then(order => {
            res.json(order)
        })
        .catch(next)
})

app.post('/orders', jParse, (req, res, next) => {
    const {prim_add, sec_add, city, state, zip, phone} = req.body
    const newOrder = {prim_add, sec_add, city, state, zip, phone}
    
    for(const [key, value] of Object.entries(newOrder)) {
        if (value === null) {
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
            res.status(201)
            .location(`/orders/${order.id}`)
            .json(order)
        })
        .catch(next)
})


app.get('/orders/:order_id', (req, res, next) => {
    const knexInstance = req.app.get('db')
    OrdersService.getById(knexInstance, req.params.order_id)
        .then(order => {
            if(!order) {
                return res.status(404).json({
                    error: {message: `Sorry, that order isn't valid!`}
                })
            }
            res.json(order)
        })
        .catch(next)
})

// =================
// ORDERS
// =================


// =================
// USERS
// =================

app.get('/users', (req, res, next) => {
    const knexInstance = req.app.get('db')
    UsersService.getAllUsers(knexInstance)
        .then(user => {
            res.json(user)
        })
        .catch(next)
})

app.post('/users', jParse, (req, res, next) => {
    const {username, email, pass, pass_confirm, subscription} = req.body
    const newUser = {username, email, pass, pass_confirm, subscription}

    for(const [key, value] of Object.entries(newUser)) {
        if (value === null) {
            return res.status(400).json({
                error: {message: `Missing '${key}' in the request body.`}
            })
        }
    }

    UsersService.addUser(
        req.app.get('db'),
        newUser
    )
        .then(user => {
            res.status(201)
            .location(`/users/${user.id}`)
            .json(user)
        })
        .catch(next)
})


app.get('/users/:user_id', (req, res, next) => {
    const knexInstance = req.app.get('db')
    UsersService.getById(knexInstance, req.params.user_id)
        .then(user => {
            if(!user) {
                return res.status(404).json({
                    error: {message: `Sorry, that username isn't valid!`}
                })
            }
            res.json(user)
        })
        .catch(next)
})


// =================
// USERS
// =================


app.get('/', (req, res) => {
    res.send('Hey now, it works!')
})

app.use(function errorHandler(error, req, res, next) {
    let response
    if (NODE_ENV === 'production') {
        response = { error: { message: 'server error'} }
    } else {
        console.log(error)
        response = { message: error.message, error }
    }
    res.status(500).json(response)
})

module.exports = app