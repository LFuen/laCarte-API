function makeMeals() {
    return  [
        {
            id: 1,
            meal_name: 'Grilled Cheese',
            img_url: 'https://grilledCheese.com',            
            ingredients: 'Cheese, Bread',
            chef: 'Melissa',
            cuisine_id: 1
        },
        {
            id: 2,
            meal_name: 'Burger',
            img_url: 'https://burger.com',            
            ingredients: 'Cheese, Bread, Meat',
            chef: 'Greg',
            cuisine_id: 2
        },
        {
            id: 3,
            meal_name: 'Ham Sandwich',
            img_url: 'https://hamandcheese.com',            
            ingredients: 'Cheese, Bread, Ham, Mayo',
            chef: 'Alvin',
            cuisine_id: 3
        },
        {
            id: 4,
            meal_name: 'French Fries',
            img_url: 'https://fries.com',            
            ingredients: 'Potatoes',
            chef: 'Giovanni',
            cuisine_id: 4
        }
    ]
}


module.exports = {
    makeMeals
}