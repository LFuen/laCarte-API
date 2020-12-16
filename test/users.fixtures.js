function newUser() {
    return  [
        {
            id: 1,        
            username: 'Davet',
            email: 'random1@gmail.com',            
            pass: 'Harrisville',
            pass_confirm: 'Florida',
            subscription: 'Late Nights',
        },
        {
            id: 2,
            username: 'Davet312',
            email: 'random2@gmail.com',            
            pass: 'Ville',
            pass_confirm: 'Maine',
            subscription: 'Straight Up Always Working',
        },
        {
            id: 3,        
            username: 'DaveRoad',
            email: 'random3@gmail.com',            
            pass: 'Springfield',
            pass_confirm: 'Wisconsin',
            subscription: 'Late Nights',
        },
        {
            id: 4,
            username: 'Dave',
            email: 'random4@gmail.com',            
            pass: 'Sydney',
            pass_confirm: 'New York',
            subscription: 'Most Late Nights',
        }
    ]
}


module.exports = {
    newUser
}