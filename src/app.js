require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const {CLIENT_ORIGIN} = require('./config')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const winston = require('winston')
const MealsService = require('./meals/mealsService')
const OrdersService = require('./orders/ordersService')
const UsersService = require('./users/usersService')
const validateToken = require('./validateToken')
const mealsRouter = require('./meals/meals-router')
const ordersRouter = require('./orders/orderForm-router')
const usersRouter = require('./users/users-router')
const errorHandler = require('./errorHandler')

const PORT = process.env.PORT || 3000;

const app = express()
const jParse = express.json()


const morganOption = (NODE_ENV === 'production')
    ? 'tiny'
    : 'common'

app.use(morgan(morganOption))
app.use(cors())
app.use(helmet())

app.use(validateToken)

app.use('/meals', mealsRouter)
app.use('/orders', ordersRouter)
app.use('/users', usersRouter)

app.get('/api/*', (req, res) => {
    res.json({ok: true});
});


app.get('/', (req, res) => {
    res.send('Hey now, it works!')
})

app.use(errorHandler)


app.listen(PORT, () => console.log(`Listening on port ${PORT}`));




module.exports = app