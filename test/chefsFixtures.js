function makeChefs() {
    return  [
        {
            id: 1,
            chef_name: 'Greg',
            bio: 'Some interesting bio, or not.',            
            cuisine: 'Asian, French, Greek, Indian, Italian',
        },
        {
            id: 2,
            chef_name: 'Bob',
            bio: 'Some interesting bio, or not.',            
            cuisine: 'Asian, French, Italian',
        },
        {
            id: 3,
            chef_name: 'Jane',
            bio: 'Some interesting bio, or not.',            
            cuisine: 'Asian, French, Italian, Thai, Latin American',
        },
        {
            id: 4,
            chef_name: 'Karen',
            bio: 'Some interesting bio, or not.',            
            cuisine: 'Asian, French, Greek, Italian',
        }
    ]
}


module.exports = {
    makeChefs
}