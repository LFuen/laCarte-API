function makeChefs() {
    return  [
        {
            id: 1,
            chef_name: 'Greg',
            bio: 'Some interesting bio, or not.',            
            cuisine: 'Asian, French, Greek, Indian, Italian',
            schedule: 'Monday, Tuesday, Wednesday'
        },
        {
            id: 2,
            chef_name: 'Bob',
            bio: 'Some interesting bio, or not.',            
            cuisine: 'Asian, French, Italian',
            schedule: 'Monday, Thursday, Wednesday, Saturday, Sunday'
        },
        {
            id: 3,
            chef_name: 'Jane',
            bio: 'Some interesting bio, or not.',            
            cuisine: 'Asian, French, Italian, Thai, Latin American',
            schedule: 'Monday, Tuesday, Friday, Saturday'
        },
        {
            id: 4,
            chef_name: 'Karen',
            bio: 'Some interesting bio, or not.',            
            cuisine: 'Asian, French, Greek, Italian',
            schedule: 'Monday, Tuesday, Wednesday, Saturday, Sunday'
        }
    ]
}


module.exports = {
    makeChefs
}