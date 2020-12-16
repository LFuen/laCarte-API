const { expect } = require('chai')
const knex = require('knex')
const { Context } = require('mocha')
const supertest = require('supertest')
const app = require('../src/app')
const {newOrder} = require('./orders.fixtures')



describe.only('Orders Endpoints', () => {
    let db

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_ORDERS_URL
        })
        app.set('db', db)
    })

    after('disconnect from db', () => db.destroy())

    before('clean the table', () => db('orders').truncate())

    afterEach('cleanup', () => db('orders').truncate())

// ====================================================
// NO -- ORDERS -- IN DATABASE
// ==================================================== 

    describe(`GET /orders`, () => {
        context('Given there are no orders in the database', () => {
            it(`responds with 200 and empty list`, () => {
                return supertest(app)
                    .get('/orders')
                    .expect(200, [])
            })
        })
    })

    describe(`GET /orders/:order_id`, () => {
        context(`Given there are no orders in the database`, () => {
            it(`responds with 404`, () => {
                const orderId = 123456
                return supertest(app)
                    .get(`/orders/${orderId}`)
                    .expect(404, {error: {message: `Sorry, that order isn't valid!`}})
            })
        })
    })



// ====================================================
// ORDERS IN DATABASE
// ====================================================    

// ====================
//         GET
// ====================

    describe(`GET /orders`, () => {
        context('Given there are orders in the database', () => {
            const testOrders = newOrder()

            beforeEach('new order', () => {
                return db
                    .into('orders')
                    .insert(testOrders)
            })

            it(`GET /orders responds with 200 and all of the orders`, () => {
                return supertest(app)
                    .get('/orders')
                    .expect(200, testOrders)
            })
        })
    })


    describe(`GET /orders/:order_id`, () => {
        context(`Given there are orders in the database`, () => {
            const testOrders = newOrder()

            beforeEach('new order', () => {
                return db
                    .into('orders')
                    .insert(testOrders)
            })   

            it(`responds with 200 and the specified order`, () => {
                const orderId = 3
                const expectedOrder = testOrders[orderId - 1]
                return supertest(app)
                    .get(`/orders/${orderId}`)
                    .expect(200, expectedOrder)
            } )            
            
        })

        // =============================
        //         XSS ATTACK
        // =============================

        context(`Given an xss attack on an order`, () => {
            const badFood = {
                id: 911,
                prim_add: 'No Bueno Street',
                sec_add: 'Not Good Apartment',            
                city: 'Evil City',
                state: 'Horrible State',
                zip: 66666,
                phone: '1900616905'
            }

            beforeEach(`insert bad order`, () => {
                return db
                    .into('orders')
                    .insert([badFood])
            })

            it(`removes no bueno XSS attack content`, () => {
                return supertest(app)
                    .get(`/orders/${badFood.id}`)
                    .expect(200)
                    .expect(res => {
                        expect(res.body.prim_add).to.eql('No Bueno Street')
                        expect(res.body.sec_add).to.eql('Not Good Apartment')
                        expect(res.body.city).to.eql('Evil City')
                        expect(res.body.state).to.eql('Horrible State')
                        expect(res.body.zip).to.eql(66666)
                        expect(res.body.phone).to.eql('1900616905')
                    })
            })
        })
    })

// ====================
//         POST
// ====================

    describe.only(`POST /orders`, () => {
        it(`creates an order, responding with 201 and the new order`, () => {
            const newOrder = {
                prim_add: 'Test Address',
                sec_add: 'Not required',            
                city: 'Test City',
                state: 'Test State',
                zip: 12345,
                phone: '7862616905'
            }
            return supertest(app)
            .post(`/orders`)
            .send(newOrder)
            .expect(201)
            .expect(res => {
                expect(res.body.prim_add).to.eql(newOrder.prim_add)
                expect(res.body.sec_add).to.eql(newOrder.sec_add)
                expect(res.body.city).to.eql(newOrder.city)
                expect(res.body.state).to.eql(newOrder.state)
                expect(res.body.zip).to.eql(newOrder.zip)
                expect(res.body.phone).to.eql(newOrder.phone)
                expect(res.body).to.have.property('id')
                expect(res.headers.location).to.eql(`/orders/${res.body.id}`)
            })
            .then(postRes => 
                supertest(app)
                    .get(`/orders/${postRes.body.id}`)
                    .expect(postRes.body)
            )
        })
    })

        const reqField = ['prim_add', 'sec_add', 'city', 'state', 'zip', 'phone']

        reqField.forEach(field => {
            const newOrderTest = {
                prim_add: 'Test Address',
                sec_add: 'Not required',            
                city: 'Test City',
                state: 'Test State',
                zip: 12345,
                phone: '7862616905'
            }
        
        
        it(`responds with 400 and an error message when the '${field}' is missing`, () => {
            delete newOrderTest[field]

            return supertest(app)
                .post('/orders')
                .send(newOrderTest)
                .expect(400, {
                    error: {message: `Missing '${field}' in the request body`}
                })
        })
    })
})
