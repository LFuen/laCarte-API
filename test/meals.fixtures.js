function makeMeals() {
    return  [
        {
            meal_name: 'Grilled Cheese',
            img_url: 'https://grilledCheese.com',            
            ingredients: 'Cheese, Bread',
            chef: 'Melissa',
            origin: 'US'
        },
        {
            meal_name: 'Burger',
            img_url: 'https://burger.com',            
            ingredients: 'Cheese, Bread, Meat',
            chef: 'Greg',
            origin: 'US'
        },
        {
            meal_name: 'Ham Sandwich',
            img_url: 'https://hamandcheese.com',            
            ingredients: 'Cheese, Bread, Ham, Mayo',
            chef: 'Alvin',
            origin: 'Italian'
        },
        {
            meal_name: 'French Fries',
            img_url: 'https://fries.com',            
            ingredients: 'Potatoes',
            chef: 'Giovanni',
            origin: 'French'
        }
    ]
}


module.exports = {
    makeMeals
}