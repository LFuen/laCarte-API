const { expect } = require('chai')
const knex = require('knex')
const supertest = require('supertest')
const app = require('../src/app')
const {newUser} = require('./users.fixtures')



describe('Users Endpoints', () => {
    let db

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL
        })
        app.set('db', db)
    })

    after('disconnect from db', () => db.destroy())

    before('clean the table', () => db('users').truncate())

    afterEach('cleanup', () => db('users').truncate())

// ====================================================
// NO -- users -- IN DATABASE
// ==================================================== 

    describe(`GET /users`, () => {
        context('Given there are no users in the database', () => {
            it(`responds with 200 and empty list`, () => {
                return supertest(app)
                    .get('/users')
                    .set(`Authorization`, `Bearer ${process.env.API_TOKEN}`)
                    .expect(200, [])
            })
        })
    })

    describe(`GET /users/:user_id`, () => {
        context(`Given there are no users in the database`, () => {
            it(`responds with 404`, () => {
                const userId = 123456
                return supertest(app)
                    .get(`/users/${userId}`)
                    .set(`Authorization`, `Bearer ${process.env.API_TOKEN}`)
                    .expect(404, {error: {message: `Sorry, that username isn't valid!`}})
            })
        })
    })



// ====================================================
// users IN DATABASE
// ====================================================    

// ====================
//         GET
// ====================

    describe(`GET /users`, () => {
        context('Given there are users in the database', () => {
            const testUsers = newUser()

            beforeEach('new order', () => {
                return db
                    .into('users')
                    .insert(testUsers)
            })

            it(`GET /users responds with 200 and all of the users`, () => {
                return supertest(app)
                    .get('/users')
                    .set(`Authorization`, `Bearer ${process.env.API_TOKEN}`)
                    .expect(200, testUsers)
            })
        })
    })


    describe(`GET /users/:user_id`, () => {
        context(`Given there are users in the database`, () => {
            const testUsers = newUser()

            beforeEach('new order', () => {
                return db
                    .into('users')
                    .insert(testUsers)
            })   

            it(`responds with 200 and the specified user`, () => {
                const userId = 2
                const expectedUser = testUsers[userId - 1]
                return supertest(app)
                    .get(`/users/${userId}`)
                    .set(`Authorization`, `Bearer ${process.env.API_TOKEN}`)
                    .expect(200, expectedUser)
            } )            
            
        })

        // =============================
        //         XSS ATTACK
        // =============================

        context(`Given an XSS attack as a user`, () => {
            const noBuenoUser = {
                id: 911,
                username: 'No Bueno',
                email: 'noGood@badPlace.com',            
                pass: 'NotCoolBro',
                pass_confirm: 'NotCoolBro',
                subscription: 'No Sign Up',
            }

            beforeEach(`insert mean user`, () => {
                return db
                    .into('users')
                    .insert([noBuenoUser])
            })

            it(`removes no bueno XSS attack content`, () => {
                return supertest(app)
                    .get(`/users/${noBuenoUser.id}`)
                    .set(`Authorization`, `Bearer ${process.env.API_TOKEN}`)
                    .expect(200)
                    .expect(res => {
                        expect(res.body.username).to.eql(`No Bueno`)
                        expect(res.body.email).to.eql(`noGood@badPlace.com`)
                        expect(res.body.pass).to.eql(`NotCoolBro`)
                        expect(res.body.pass_confirm).to.eql(`NotCoolBro`)
                        expect(res.body.subscription).to.eql(`No Sign Up`)
                    })
            })
        })
    })

// ====================
//         POST
// ====================

    describe(`POST /users`, () => {
        it(`creates a user, responding with 201 and the new user`, () => {
            const newUser = {
                username: 'Test User',
                email: 'something@somewhere.com',            
                pass: 'Test Pass',
                pass_confirm: 'Test Pass',
                subscription: 'Late Nights',
            }
            return supertest(app)
            .post(`/users`)
            .set(`Authorization`, `Bearer ${process.env.API_TOKEN}`)
            .send(newUser)
            .expect(201)
            .expect(res => {
                expect(res.body.username).to.eql(newUser.username)
                expect(res.body.email).to.eql(newUser.email)
                expect(res.body.pass).to.eql(newUser.pass)
                expect(res.body.pass_confirm).to.eql(newUser.pass_confirm)
                expect(res.body.subscription).to.eql(newUser.subscription)
                expect(res.body).to.have.property('id')
                expect(res.headers.location).to.eql(`/users/${res.body.id}`)
            })
            .then(postRes => 
                supertest(app)
                    .get(`/users/${postRes.body.id}`)
                    .set(`Authorization`, `Bearer ${process.env.API_TOKEN}`)
                    .expect(postRes.body)
            )
        })
    })

        const reqField = ['username', 'email', 'pass', 'pass_confirm', 'subscription', 'phone']

        reqField.forEach(field => {
            const newUserTest = {
                username: 'GreatUser123',
                email: 'someone@somewhere.com',            
                pass: 'Test Pass',
                pass_confirm: 'Test Pass',
                subscription: 'Late Nights',
            }
                
        it(`responds with 400 and an error message when the '${field}' is missing`, () => {
            newUserTest[field] = null

            return supertest(app)
                .post('/users')
                .set(`Authorization`, `Bearer ${process.env.API_TOKEN}`)
                .send(newUserTest)
                .expect(400, {
                    error: {message: `Missing '${field}' in the request body.`}
                })
        })
    })

// ====================
//         DELETE
// ====================

    describe(`DELETE /users/:user_id`, () => {
        context(`Given there are users in the database`, () => {
            const testUsers = newUser()
            
            beforeEach(`insert users`, () => {
                return db
                    .into('users')
                    .insert(testUsers)
            })

            it(`responds with 204 and removes the user`, () => {
                const idToRemove = 2
                const expectedUsers = testUsers.filter(user => user.id !== idToRemove)
                return supertest(app)
                    .delete(`/users/${idToRemove}`)
                    .set(`Authorization`, `Bearer ${process.env.API_TOKEN}`)
                    .expect(204)
                    .then(res => 
                        supertest(app)
                        .get(`/users`)
                        .set(`Authorization`, `Bearer ${process.env.API_TOKEN}`)
                        .expect(expectedUsers)
                    )
            })
        })

        context(`Given no users`, () => {
            it(`responds with 404`, () => {
                const userId = 123456
                return supertest(app)
                    .delete(`/users/${userId}`)
                    .set(`Authorization`, `Bearer ${process.env.API_TOKEN}`)
                    .expect(404, {error: {message: `Sorry, that username isn't valid!`}})
            })
        })
    })
})


