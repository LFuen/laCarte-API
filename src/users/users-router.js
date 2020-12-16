const path = require('path')
const express = reaquire('express')
const xss = require('xss')
const UsersService = require('../users/usersService')
const { v4: uuid} = require('uuid')
const app = require("../app")
const usersRouter = express.Router()
const jParse = express.json()



const serializeUser = user => ({
    id: user.uuid(),
    username: xss(user.username),
    email: xss(user.email),
    pass: xss(user.pass),
    pass_confirm: xss(user.pass_confirm),
    subscription: xss(user.subscription),
})


// =================================================
// GET '/' and '/:user_id'
// =================================================


usersRouter
    .route('/')
    .get((req, res, next) => {
        UsersService.getAllUsers(req.app.get('db'))
        .then((user) => {
            res.json(user.map(serializeUser))
        })
        .catch(next)
    })
    .post(jParse, (req, res, next) => {
        const {username, email, pass, pass_confirm, subscription} = req.body
        const newUser = {username, email, pass, pass_confirm, subscription}

        for(const [key, value] of Object.entries(newUser)) {
            if(value === null) {
                return res.status(400).json({
                    error: {message: `Missing '${key}' in request body.`}
                })
            }
        }

        UsersService.adduser(
            req.app.get('db'),
            newUser
        )
        .then(user => {
            res
                .status(201)
                .location(`/Users/${user.id}`)
                .json(serializeuser(user))
        })
        .catch(next)
    })


usersRouter
    .route('/:user_id')
    .all((req, res, next) => {
        const knexInstance = req.app.get('db')
        UsersService.getById(knexInstance, req.params.user_id)
            .then(user => {
                if(!user) {
                    return res.status(404).json({
                        error: {message: `That user does not exist.`}
                    })
                }
                res.json(serializeUser(user))
            })
            .catch(next)
    })