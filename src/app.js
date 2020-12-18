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

const PORT = process.env.PORT || 3000;

const app = express()

const morganOption = (NODE_ENV === 'production')
    ? 'tiny'
    : 'common'

app.use(morgan(morganOption))
app.use(cors())
app.use(helmet())

app.use(validateToken)

app.use(mealsRouter)
app.use(ordersRouter)
app.use(usersRouter)

app.get('/api/*', (req, res) => {
    res.json({ok: true});
});


app.get('/', (req, res) => {
    res.send('Hey now, it works!')
})

app.use(errorHandler)


app.listen(PORT, () => console.log(`Listening on at ${PORT}`));




module.exports = app