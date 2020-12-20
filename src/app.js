require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const validateToken = require('./validateToken')
const mealsRouter = require('./meals/meals-router')
const ordersRouter = require('./orders/orderForm-router')
const usersRouter = require('./users/users-router')
const errorHandler = require('./errorHandler')
const chefsRouter = require('./chefs/chefs-router')

const PORT = process.env.PORT || 3000;

const app = express()

app.use(morgan((NODE_ENV === 'production') ? 'tiny' : 'common', {
    skip: () => NODE_ENV === 'test'
}))
app.use(cors())
app.use(helmet())

app.use(validateToken)

app.use('/api/meals', mealsRouter)
app.use('api/orders', ordersRouter)
app.use('api/users', usersRouter)
app.use('api/chefs', chefsRouter)



app.get('/', (req, res) => {
    res.send('Hey now, it works!')
})

app.use(errorHandler)



module.exports = app