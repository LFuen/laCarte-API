function newOrder() {
    return  [
        {
            id: 1,        
            prim_add: '123 Main Street',
            sec_add: '3rd Floor',            
            city: 'Harrisville',
            state: 'Florida',
            zip: 12345,
            phone: '7862616905'
        },
        {
            id: 2,
            prim_add: '456 Main Street',
            sec_add: '2nd Door',            
            city: 'Ville',
            state: 'Maine',
            zip: 12778,
            phone: '7862616905'
        },
        {
            id: 3,        
            prim_add: '29 Colesville Road',
            sec_add: '227',            
            city: 'Springfield',
            state: 'Wisconsin',
            zip: 12889,
            phone: '7862616905'
        },
        {
            id: 4,
            prim_add: '46 Wallaby Way',
            sec_add: '',            
            city: 'Sydney',
            state: 'New York',
            zip: 90210,
            phone: '7862616905'
        }
    ]
}


module.exports = {
    newOrder
}