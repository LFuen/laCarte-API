const { expect } = require('chai')
const knex = require('knex')
const { Context } = require('mocha')
const supertest = require('supertest')
const app = require('../src/app')
const {newOrder, badFood} = require('./orders.fixtures')



describe('Orders Endpoints', () => {
    let db

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL
        })
        app.set('db', db)
    })

    after('disconnect from db', () => db.destroy())

    before('clean the table', () => db('orders').truncate())

    afterEach('cleanup', () => db('orders').truncate())

// ====================================================
// ====================================================
// UNAUTHORIZED 
//    REQUESTS
// ====================================================    
// ==================================================== 

    describe(`Unauthorized requests`, () => {
        const testOrders = newOrder()
    
        beforeEach('insert orders', () => {
            return db
                .into('orders')
                .insert(testOrders)
        })
    
        it(`responds with 401 Unauthorized for GET /orders`, () => {
            return supertest(app)
                .get('/api/orders')
                .expect(401, { error: 'Unauthorized Request' })
        })
    
        it(`responds with 401 Unauthorized for POST /api/orders`, () => {
            return supertest(app)
                .post('/api/orders')
                .send({ 
                    prim_add: 'Test Address',
                    sec_add: 'Test Address 2',            
                    city: 'Test City',
                    state: 'Test State',
                    zip: 12345,
                    phone: 7862616905
                })
                .expect(401, { error: 'Unauthorized Request' })
        })
    
        it(`responds with 401 Unauthorized for GET /api/orders/:order_id`, () => {
            const secondOrder = testOrders[1]
            return supertest(app)
                .get(`/api/orders/${secondOrder.id}`)
                .expect(401, { error: 'Unauthorized Request' })
        })
    
        it(`responds with 401 Unauthorized for DELETE /api/orders/:order_id`, () => {
            const anOrder = testOrders[1]
            return supertest(app)
                .delete(`/api/orders/${anOrder.id}`)
                .expect(401, { error: 'Unauthorized Request' })
        })
    })

// ====================================================
// ====================================================
// UNAUTHORIZED 
//    REQUESTS
// ====================================================    
// ==================================================== 

    describe(`GET /api/orders`, () => {
        context('Given there are no orders in the database', () => {
            it(`responds with 200 and empty list`, () => {
                return supertest(app)
                    .get('/api/orders')
                    .set(`Authorization`, `Bearer ${process.env.API_TOKEN}`)
                    .expect(200, [])
            })
        })

        context(`Given there are orders in the database`, () => {
            const testOrders = newOrder()

            beforeEach(`insert orders`, () => {
                return db
                    .into('orders')
                    .insert(testOrders)
            })

            it(`gets the orders from the store`, () => {
                return supertest(app)
                    .get('/api/orders')
                    .set(`Authorization`, `Bearer ${process.env.API_TOKEN}`)
                    .expect(200, testOrders)
            })
        })

        context(`Given an XSS atack on orders`, () => {
            const { badOrder, expectedOrder} = badFood()

            beforeEach(`insert bad order`, () => {
                return db
                    .into('orders')
                    .insert([badOrder])
            })

            it(`removes no bueno XSS attack content`, () => {
                return supertest(app)
                    .get(`/api/orders`)
                    .set(`Authorization`, `Bearer ${process.env.API_TOKEN}`)
                    .expect(200)
                    .expect(res => {
                        expect(res.body[0].prim_add).to.eql(expectedOrder.prim_add)
                        expect(res.body[0].sec_add).to.eql(expectedOrder.sec_add)
                        expect(res.body[0].city).to.eql(expectedOrder.city)
                        expect(res.body[0].state).to.eql(expectedOrder.state)
                        expect(res.body[0].zip).equal(`${expectedOrder.zip}`)
                        expect(res.body[0].phone).equal(`${expectedOrder.phone}`)
                    })
            })
        })
    })

    describe(`GET /api/orders/:order_id`, () => {
        context(`Given there are no orders in the database`, () => {
            it(`responds with 404`, () => {
                const orderId = 123456
                return supertest(app)
                    .get(`/api/orders/${orderId}`)
                    .set(`Authorization`, `Bearer ${process.env.API_TOKEN}`)
                    .expect(404, {error: {message: `Sorry, that order isn't valid!`}
                })
            })
        })

        context(`Given there are orders in the database`, () => {
            const testOrders = newOrder()

            beforeEach(`insert orders`, () => {
                return db
                    .into('orders')
                    .insert(testOrders)
            })

            it(`responds with 200 and the specified order`, () => {
                const orderId = 3
                const expectedOrder = testOrders[orderId - 1]
                return supertest(app)
                    .get(`/api/orders/${orderId}`)
                    .set(`Authorization`, `Bearer ${process.env.API_TOKEN}`)
                    .expect(200, expectedOrder)
            })
        })

        context(`Given an XSS order attack`, () => {
            const { badOrder, expectedOrder} = badFood()

            beforeEach(`insert bad order`, () => {
                return db
                    .into('orders')
                    .insert([badOrder])
            })

            it(`removes no bueno XSS attack content`, () => {
                return supertest(app)
                    .get(`/api/orders/${badOrder.id}`)
                    .set(`Authorization`, `Bearer ${process.env.API_TOKEN}`)
                    .expect(200)
                    .expect(res => {
                        expect(res.body.prim_add).to.eql(expectedOrder.prim_add)
                        expect(res.body.sec_add).to.eql(expectedOrder.sec_add)
                        expect(res.body.city).to.eql(expectedOrder.city)
                        expect(res.body.state).to.eql(expectedOrder.state)
                        expect(res.body.zip).equal(`${expectedOrder.zip}`)
                        expect(res.body.phone).equal(`${expectedOrder.phone}`)
                    })
            })
        })
    })


    describe(`GET /api/orders`, () => {
        context('Given there are orders in the database', () => {
            const testOrders = newOrder()

            beforeEach('new order', () => {
                return db
                    .into('orders')
                    .insert(testOrders)
            })

            it(`GET /api/orders responds with 200 and all of the orders`, () => {
                return supertest(app)
                    .get('/api/orders')
                    .set(`Authorization`, `Bearer ${process.env.API_TOKEN}`)
                    .expect(200, testOrders)
            })
        })
    })


    describe(`GET /api/orders/:order_id`, () => {
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
                    .get(`/api/orders/${orderId}`)
                    .set(`Authorization`, `Bearer ${process.env.API_TOKEN}`)
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
                phone: 1900616905
            }

            beforeEach(`insert bad order`, () => {
                return db
                    .into('orders')
                    .insert([badFood])
            })

            it(`removes no bueno XSS attack content`, () => {
                return supertest(app)
                    .get(`/api/orders/${badFood.id}`)
                    .set(`Authorization`, `Bearer ${process.env.API_TOKEN}`)
                    .expect(200)
                    .expect(res => {
                        expect(res.body.prim_add).to.eql('No Bueno Street')
                        expect(res.body.sec_add).to.eql('Not Good Apartment')
                        expect(res.body.city).to.eql('Evil City')
                        expect(res.body.state).to.eql('Horrible State')
                        expect(res.body.zip).equal(`${66666}`)
                        expect(res.body.phone).equal(`${1900616905}`)
                    })
            })
        })
    })

// ====================
//         POST
// ====================

    describe(`POST /api/orders`, () => {
        ['id', 'prim_add', 'sec_add', 'city', 'state', 'zip', 'phone'].forEach(
            field => {
            const newOrderTest = {
                id: 1,
                prim_add: "Test Address",
                sec_add: "Not required",            
                city: "Test City",
                state: "Test State",
                zip: 12345,
                phone: 7862616905
            }
        it(`responds with 400 and an error message when the '${field}' is missing`, () => {
            newOrderTest[field] = null

            return supertest(app)
                .post('/api/orders')
                .set(`Authorization`, `Bearer ${process.env.API_TOKEN}`)
                .send(newOrderTest)                
                .expect(400, {
                    error: {message: `Missing '${field}' in the request body.`}
                })
        })


        it(`creates an order, responding with 201 and the new order`, () => {
            const newOrder = {
                id: 2,
                prim_add: 'Test Address',
                sec_add: 'Not required',            
                city: 'Test City',
                state: 'Test State',
                zip: 12345,
                phone: 7862616905
            }
            return supertest(app)
            .post(`/api/orders`)            
            .set(`Authorization`, `Bearer ${process.env.API_TOKEN}`)
            .send(newOrder)            
            .expect(201)
            .expect(res => {
                expect(res.body.prim_add).to.eql(newOrder.prim_add)
                expect(res.body.sec_add).to.eql(newOrder.sec_add)
                expect(res.body.city).to.eql(newOrder.city)
                expect(res.body.state).to.eql(newOrder.state)
                expect(res.body.zip).equal(`${newOrder.zip}`)
                expect(res.body.phone).equal(`${newOrder.phone}`)
                // expect(res.body).to.have.property('id')
                expect(res.headers.location).to.eql(`/api/orders/${res.body.id}`)
            })               
            .then(postRes => 
                supertest(app)
                    .get(`/api/orders/${postRes.body.id}`)
                    .set(`Authorization`, `Bearer ${process.env.API_TOKEN}`)
                    .expect(postRes.body)
            )
        })
    })
})


// ====================
//         DELETE
// ====================

    describe(`DELETE /api/orders/:order_id`, () => {
        context(`Given no orders`, () => {
            it(`responds with 404`, () => {
                const orderId = 123456
                return supertest(app)
                    .delete(`/api/orders/${orderId}`)
                    .set(`Authorization`, `Bearer ${process.env.API_TOKEN}`)
                    .expect(404, {error: {message: `Sorry, that order isn't valid!`}})
            })
        })
        
        context(`Given there are orders in the database`, () => {
            const testOrders = newOrder()
            
            beforeEach(`insert orders`, () => {
                return db
                    .into('orders')
                    .insert(testOrders)
            })

            it(`responds with 204 and removes the order`, () => {
                const idToRemove = 2
                const expectedOrders = testOrders.filter(order => order.id !== idToRemove)
                return supertest(app)
                    .delete(`/api/orders/${idToRemove}`)
                    .set(`Authorization`, `Bearer ${process.env.API_TOKEN}`)
                    .expect(204)
                    .then(res => 
                        supertest(app)
                        .get(`/api/orders`)
                        .set(`Authorization`, `Bearer ${process.env.API_TOKEN}`)
                        .expect(expectedOrders)
                    )
            })
        })
    })

// ====================
//        PATCH
// ====================

    describe(`PATCH /api/orders/:order_id`, () => {
        context(`Given no orders`, () => {
            it(`responds with 404`, () => {
                const orderID = 123456

                return supertest(app)
                    .patch(`/api/orders/${orderID}`)
                    .set(`Authorization`, `Bearer ${process.env.API_TOKEN}`)
                    .expect(404, {error: {message: `Sorry, that order isn't valid!`}})
            })
        })

        context(`Given there are orders in the database`, () => {
            const testOrders = newOrder()

            beforeEach(`insert orders`, () => {
                return db
                    .into(`orders`)
                    .insert(testOrders)
            })

            it(`responds with 204 and updates the order`, () => {
                const idToUpdate = 2
                const updateOrder = {
                    prim_add: 'Updated Address',
                    sec_add: 'Not required',            
                    city: 'Updated City',
                    state: 'Updated State',
                    zip: '11223',
                    phone: '7862616905'
                }
                const expectedOrder = {
                    ...testOrders[idToUpdate - 1],
                    ...updateOrder
                }
                return supertest(app)
                    .patch(`/api/orders/${idToUpdate}`)
                    .set(`Authorization`, `Bearer ${process.env.API_TOKEN}`)
                    .send(updateOrder)
                    .expect(204)
                    .then(res => 
                        supertest(app)
                        .get(`/api/orders/${idToUpdate}`)
                        .set(`Authorization`, `Bearer ${process.env.API_TOKEN}`)
                        .expect(expectedOrder)
                    )
            })

            it(`responds with 400 when no required fields are supplied`, () => {
                const idToUpdate = 1

                return supertest(app)
                    .patch(`/api/orders/${idToUpdate}`)
                    .set(`Authorization`, `Bearer ${process.env.API_TOKEN}`)
                    .send({ irrelevantField: 'sup yo'})
                    .expect(400, {
                        error: {
                            message: `Request body must contain either 'prim_add', 'sec_add', 'city', 'state', 'zip', or 'phone'`
                        }
                    })
            })

            it(`responds with 204 when updating only a subset of fields`, () => {
                const idToUpdate = 2
                const updateOrder = {
                    prim_add: 'Updated Address'
                }
                const expectedOrder = {
                    ...testOrders[idToUpdate - 1],
                    ...updateOrder
                }

                return supertest(app)
                    .patch(`/api/orders/${idToUpdate}`)
                    .set(`Authorization`, `Bearer ${process.env.API_TOKEN}`)
                    .send({
                        ...updateOrder,
                        fieldToIgnore: `Should not be in GET response`
                    })
                    .expect(204)
                    .then(res => {
                        supertest(app)
                            .get(`/api/orders/${idToUpdate}`)
                            .set(`Authorization`, `Bearer ${process.env.API_TOKEN}`)
                            .expect(expectedOrder)
                    })
            })
        })
    })
})



//REFERENCE == https://github.com/Thinkful-Ed/bookmarks-server/blob/post-delete-postgres-example-solution/test/bookmarks-endpoints.spec.js