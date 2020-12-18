function newOrder() {
    return  [
        {
            city: 'Harrisville',            
            phone: 7862616905,  
            prim_add: '123 Main Street',
            sec_add: '3rd Floor',            
            state: 'Florida',
            zip: 12345,

        },
        // {
        //     prim_add: '456 Main Street',
        //     sec_add: '2nd Door',            
        //     city: 'Ville',
        //     state: 'Maine',
        //     zip: 12778,
        //     phone: 7862616905
        // },
        // {
        //     prim_add: '29 Colesville Road',
        //     sec_add: '227',            
        //     city: 'Springfield',
        //     state: 'Wisconsin',
        //     zip: 12889,
        //     phone: 7862616905
        // },
        // {
        //     prim_add: '46 Wallaby Way',
        //     sec_add: '',            
        //     city: 'Sydney',
        //     state: 'New York',
        //     zip: 90210,
        //     phone: 7862616905
        // }
    ]
}

function badFood() {
    const badOrder = {
    id: 911,
    prim_add: 'No Bueno Street',
    sec_add: 'Not Good Apartment',            
    city: 'Evil City',
    state: 'Horrible State',
    zip: 66666,
    phone: 1900616905
    }

    const expectedOrder = {
        ...badFood,
        prim_add: 'No Bueno Street',
        sec_add: 'Not Good Apartment',            
        city: 'Evil City',
        state: 'Horrible State',
        zip: 66666,
        phone: 1900616905
    }
    return {
        badOrder,
        expectedOrder
    }
}


module.exports = {
    newOrder,
    badFood
}