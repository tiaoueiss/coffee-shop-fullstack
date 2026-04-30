const mongoose = require('mongoose');
const Category = require('./models/Category');
const Product = require('./models/Product');
require('dotenv').config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URI);

    // Clear existing data
    await Category.deleteMany({});
    await Product.deleteMany({});

    // Create categories
    const categories = await Category.insertMany([
      { name: "Coffee", description: "Hot and cold coffee beverages" },
      { name: "Tea", description: "Various tea selections" },
      { name: "Pastries", description: "Fresh baked goods" },
      { name: "Sandwiches", description: "Fresh made sandwiches and wraps" },
      { name: "Salads", description: "Healthy salad options" },
      { name: "Smoothies", description: "Fresh fruit and vegetable smoothies" },
      { name: "Desserts", description: "Sweet treats and desserts" },
      { name: "Breakfast Items", description: "Morning breakfast specials" },
      { name: "Lunch Specials", description: "Daily lunch specials" },
      { name: "Beverages", description: "Non-coffee and non-tea drinks" },
      { name: "Snacks", description: "Light snacks and appetizers" },
      { name: "Bakery", description: "Fresh baked breads and cakes" }
    ]);

    // Get category references
    const coffeeCategory = categories.find(c => c.name === "Coffee");
    const teaCategory = categories.find(c => c.name === "Tea");
    const pastriesCategory = categories.find(c => c.name === "Pastries");
    const sandwichesCategory = categories.find(c => c.name === "Sandwiches");
    const saladsCategory = categories.find(c => c.name === "Salads");
    const smoothiesCategory = categories.find(c => c.name === "Smoothies");
    const dessertsCategory = categories.find(c => c.name === "Desserts");
    const breakfastCategory = categories.find(c => c.name === "Breakfast Items");
    const lunchCategory = categories.find(c => c.name === "Lunch Specials");
    const beveragesCategory = categories.find(c => c.name === "Beverages");
    const snacksCategory = categories.find(c => c.name === "Snacks");
    const bakeryCategory = categories.find(c => c.name === "Bakery");

    // Create products for each category
    const allProducts = [

      // COFFEE PRODUCTS (15 items)
      {
        name: "Espresso",
        description: "Strong coffee shot",
        price: 3.50,
        size: "Small",
        inventory: 100,
        isAvailable: true,
        category: coffeeCategory._id
      },
      {
        name: "Double Espresso",
        description: "Two shots of espresso",
        price: 5.50,
        size: "Small",
        inventory: 80,
        isAvailable: true,
        category: coffeeCategory._id
      },
      {
        name: "Americano",
        description: "Espresso with hot water",
        price: 4.00,
        size: "Medium",
        inventory: 90,
        isAvailable: true,
        category: coffeeCategory._id
      },
      {
        name: "Latte",
        description: "Coffee with steamed milk",
        price: 4.75,
        size: "Medium",
        inventory: 75,
        isAvailable: true,
        category: coffeeCategory._id
      },
      {
        name: "Cappuccino",
        description: "Coffee with steamed milk and foam",
        price: 4.50,
        size: "Medium",
        inventory: 70,
        isAvailable: true,
        category: coffeeCategory._id
      },
      {
        name: "Mocha",
        description: "Chocolate coffee with steamed milk",
        price: 5.25,
        size: "Medium",
        inventory: 60,
        isAvailable: true,
        category: coffeeCategory._id
      },
      {
        name: "Macchiato",
        description: "Espresso with a dollop of foam",
        price: 4.25,
        size: "Small",
        inventory: 65,
        isAvailable: true,
        category: coffeeCategory._id
      },
      {
        name: "Flat White",
        description: "Espresso with velvety microfoam",
        price: 4.75,
        size: "Medium",
        inventory: 55,
        isAvailable: true,
        category: coffeeCategory._id
      },
      {
        name: "Cold Brew",
        description: "Cold brewed coffee served over ice",
        price: 4.50,
        size: "Large",
        inventory: 45,
        isAvailable: true,
        category: coffeeCategory._id
      },
      {
        name: "Nitro Cold Brew",
        description: "Cold brew infused with nitrogen",
        price: 5.00,
        size: "Large",
        inventory: 40,
        isAvailable: true,
        category: coffeeCategory._id
      },
      {
        name: "Iced Coffee",
        description: "Chilled coffee over ice",
        price: 3.75,
        size: "Large",
        inventory: 80,
        isAvailable: true,
        category: coffeeCategory._id
      },
      {
        name: "Frappuccino",
        description: "Blended iced coffee drink",
        price: 5.50,
        size: "Large",
        inventory: 50,
        isAvailable: true,
        category: coffeeCategory._id
      },
      {
        name: "Irish Coffee",
        description: "Coffee with Irish whiskey and cream",
        price: 7.50,
        size: "Medium",
        inventory: 30,
        isAvailable: true,
        category: coffeeCategory._id
      },
      {
        name: "Turkish Coffee",
        description: "Traditional finely ground coffee",
        price: 4.00,
        size: "Small",
        inventory: 35,
        isAvailable: true,
        category: coffeeCategory._id
      },
      {
        name: "Vietnamese Coffee",
        description: "Strong coffee with condensed milk",
        price: 4.75,
        size: "Medium",
        inventory: 40,
        isAvailable: true,
        category: coffeeCategory._id
      },

      // TEA PRODUCTS (12 items)
      {
        name: "Green Tea",
        description: "Traditional green tea",
        price: 3.25,
        size: "Medium",
        inventory: 60,
        isAvailable: true,
        category: teaCategory._id
      },
      {
        name: "Black Tea",
        description: "Classic black tea",
        price: 3.00,
        size: "Medium",
        inventory: 65,
        isAvailable: true,
        category: teaCategory._id
      },
      {
        name: "Earl Grey Tea",
        description: "Black tea with bergamot",
        price: 3.50,
        size: "Medium",
        inventory: 55,
        isAvailable: true,
        category: teaCategory._id
      },
      {
        name: "Chai Tea Latte",
        description: "Spiced tea with steamed milk",
        price: 4.50,
        size: "Medium",
        inventory: 50,
        isAvailable: true,
        category: teaCategory._id
      },
      {
        name: "Matcha Latte",
        description: "Green tea powder with steamed milk",
        price: 5.00,
        size: "Medium",
        inventory: 45,
        isAvailable: true,
        category: teaCategory._id
      },
      {
        name: "Iced Tea",
        description: "Chilled black tea",
        price: 3.50,
        size: "Large",
        inventory: 70,
        isAvailable: true,
        category: teaCategory._id
      },
      {
        name: "Herbal Tea",
        description: "Caffeine-free herbal infusion",
        price: 3.25,
        size: "Medium",
        inventory: 40,
        isAvailable: true,
        category: teaCategory._id
      },
      {
        name: "Peppermint Tea",
        description: "Refreshing peppermint tea",
        price: 3.25,
        size: "Medium",
        inventory: 35,
        isAvailable: true,
        category: teaCategory._id
      },
      {
        name: "Chamomile Tea",
        description: "Calming chamomile tea",
        price: 3.25,
        size: "Medium",
        inventory: 30,
        isAvailable: true,
        category: teaCategory._id
      },
      {
        name: "Jasmine Tea",
        description: "Green tea with jasmine flowers",
        price: 3.75,
        size: "Medium",
        inventory: 25,
        isAvailable: true,
        category: teaCategory._id
      },
      {
        name: "Oolong Tea",
        description: "Partially oxidized tea",
        price: 4.00,
        size: "Medium",
        inventory: 20,
        isAvailable: true,
        category: teaCategory._id
      },
      {
        name: "White Tea",
        description: "Lightly oxidized tea",
        price: 4.25,
        size: "Medium",
        inventory: 15,
        isAvailable: true,
        category: teaCategory._id
      },

      // PASTRIES (10 items)
      {
        name: "Croissant",
        description: "Buttery French pastry",
        price: 3.75,
        size: "Small",
        inventory: 30,
        isAvailable: true,
        category: pastriesCategory._id
      },
      {
        name: "Pain au Chocolat",
        description: "Chocolate filled pastry",
        price: 4.25,
        size: "Small",
        inventory: 25,
        isAvailable: true,
        category: pastriesCategory._id
      },
      {
        name: "Blueberry Muffin",
        description: "Fresh baked muffin with blueberries",
        price: 4.25,
        size: "Small",
        inventory: 20,
        isAvailable: true,
        category: pastriesCategory._id
      },
      {
        name: "Chocolate Chip Cookie",
        description: "Warm chocolate chip cookie",
        price: 2.50,
        size: "Small",
        inventory: 40,
        isAvailable: true,
        category: pastriesCategory._id
      },
      {
        name: "Almond Croissant",
        description: "Croissant filled with almond cream",
        price: 4.75,
        size: "Small",
        inventory: 15,
        isAvailable: true,
        category: pastriesCategory._id
      },
      {
        name: "Cinnamon Roll",
        description: "Sweet roll with cinnamon filling",
        price: 4.50,
        size: "Small",
        inventory: 18,
        isAvailable: true,
        category: pastriesCategory._id
      },
      {
        name: "Scone",
        description: "British style baked good",
        price: 3.50,
        size: "Small",
        inventory: 22,
        isAvailable: true,
        category: pastriesCategory._id
      },
      {
        name: "Danish Pastry",
        description: "Sweet Danish pastry",
        price: 4.00,
        size: "Small",
        inventory: 16,
        isAvailable: true,
        category: pastriesCategory._id
      },
      {
        name: "Apple Turnover",
        description: "Pastry filled with apple",
        price: 4.25,
        size: "Small",
        inventory: 12,
        isAvailable: true,
        category: pastriesCategory._id
      },
      {
        name: "Éclair",
        description: "Cream filled pastry",
        price: 5.00,
        size: "Small",
        inventory: 10,
        isAvailable: true,
        category: pastriesCategory._id
      },

      // SANDWICHES (8 items)
      {
        name: "Turkey Club",
        description: "Turkey, bacon, lettuce, tomato on toasted bread",
        price: 9.50,
        size: "Medium",
        inventory: 15,
        isAvailable: true,
        category: sandwichesCategory._id
      },
      {
        name: "Grilled Cheese",
        description: "Melted cheese on grilled bread",
        price: 6.50,
        size: "Medium",
        inventory: 20,
        isAvailable: true,
        category: sandwichesCategory._id
      },
      {
        name: "BLT",
        description: "Bacon, lettuce, tomato sandwich",
        price: 8.00,
        size: "Medium",
        inventory: 18,
        isAvailable: true,
        category: sandwichesCategory._id
      },
      {
        name: "Chicken Salad Wrap",
        description: "Chicken salad in a tortilla wrap",
        price: 8.75,
        size: "Medium",
        inventory: 16,
        isAvailable: true,
        category: sandwichesCategory._id
      },
      {
        name: "Tuna Melt",
        description: "Tuna salad with melted cheese",
        price: 8.25,
        size: "Medium",
        inventory: 14,
        isAvailable: true,
        category: sandwichesCategory._id
      },
      {
        name: "Vegetarian Wrap",
        description: "Veggies and hummus in a wrap",
        price: 7.50,
        size: "Medium",
        inventory: 12,
        isAvailable: true,
        category: sandwichesCategory._id
      },
      {
        name: "Panini",
        description: "Pressed Italian sandwich",
        price: 9.00,
        size: "Medium",
        inventory: 10,
        isAvailable: true,
        category: sandwichesCategory._id
      },
      {
        name: "Egg Salad Sandwich",
        description: "Classic egg salad on bread",
        price: 7.25,
        size: "Medium",
        inventory: 13,
        isAvailable: true,
        category: sandwichesCategory._id
      },

      // SALADS (6 items)
      {
        name: "Caesar Salad",
        description: "Romaine lettuce with Caesar dressing",
        price: 8.50,
        size: "Large",
        inventory: 12,
        isAvailable: true,
        category: saladsCategory._id
      },
      {
        name: "Greek Salad",
        description: "Mediterranean salad with feta",
        price: 9.00,
        size: "Large",
        inventory: 10,
        isAvailable: true,
        category: saladsCategory._id
      },
      {
        name: "Garden Salad",
        description: "Mixed greens with vegetables",
        price: 7.50,
        size: "Large",
        inventory: 15,
        isAvailable: true,
        category: saladsCategory._id
      },
      {
        name: "Quinoa Salad",
        description: "Quinoa with roasted vegetables",
        price: 9.50,
        size: "Large",
        inventory: 8,
        isAvailable: true,
        category: saladsCategory._id
      },
      {
        name: "Chicken Caesar",
        description: "Caesar salad with grilled chicken",
        price: 10.50,
        size: "Large",
        inventory: 11,
        isAvailable: true,
        category: saladsCategory._id
      },
      {
        name: "Caprese Salad",
        description: "Tomato, mozzarella, and basil",
        price: 8.75,
        size: "Large",
        inventory: 9,
        isAvailable: true,
        category: saladsCategory._id
      },

      // SMOOTHIES (8 items)
      {
        name: "Berry Blast",
        description: "Mixed berries smoothie",
        price: 6.50,
        size: "Large",
        inventory: 20,
        isAvailable: true,
        category: smoothiesCategory._id
      },
      {
        name: "Tropical Paradise",
        description: "Pineapple, mango, and coconut",
        price: 6.75,
        size: "Large",
        inventory: 18,
        isAvailable: true,
        category: smoothiesCategory._id
      },
      {
        name: "Green Power",
        description: "Spinach, banana, and apple",
        price: 6.25,
        size: "Large",
        inventory: 16,
        isAvailable: true,
        category: smoothiesCategory._id
      },
      {
        name: "Protein Power",
        description: "Banana, peanut butter, protein",
        price: 7.00,
        size: "Large",
        inventory: 14,
        isAvailable: true,
        category: smoothiesCategory._id
      },
      {
        name: "Citrus Burst",
        description: "Orange, grapefruit, lemon",
        price: 6.00,
        size: "Large",
        inventory: 15,
        isAvailable: true,
        category: smoothiesCategory._id
      },
      {
        name: "Chocolate Dream",
        description: "Chocolate, banana, almond milk",
        price: 6.75,
        size: "Large",
        inventory: 12,
        isAvailable: true,
        category: smoothiesCategory._id
      },
      {
        name: "Detox Green",
        description: "Kale, cucumber, lemon, ginger",
        price: 6.50,
        size: "Large",
        inventory: 10,
        isAvailable: true,
        category: smoothiesCategory._id
      },
      {
        name: "Peanut Butter Cup",
        description: "Peanut butter, chocolate, banana",
        price: 7.25,
        size: "Large",
        inventory: 13,
        isAvailable: true,
        category: smoothiesCategory._id
      },

      // DESSERTS (6 items)
      {
        name: "Chocolate Cake",
        description: "Rich chocolate layer cake",
        price: 6.50,
        size: "Small",
        inventory: 8,
        isAvailable: true,
        category: dessertsCategory._id
      },
      {
        name: "Cheesecake",
        description: "New York style cheesecake",
        price: 6.00,
        size: "Small",
        inventory: 10,
        isAvailable: true,
        category: dessertsCategory._id
      },
      {
        name: "Tiramisu",
        description: "Classic Italian dessert",
        price: 7.00,
        size: "Small",
        inventory: 6,
        isAvailable: true,
        category: dessertsCategory._id
      },
      {
        name: "Ice Cream Sundae",
        description: "Vanilla ice cream with toppings",
        price: 5.50,
        size: "Small",
        inventory: 12,
        isAvailable: true,
        category: dessertsCategory._id
      },
      {
        name: "Fruit Tart",
        description: "Pastry crust with custard and fruit",
        price: 6.25,
        size: "Small",
        inventory: 7,
        isAvailable: true,
        category: dessertsCategory._id
      },
      {
        name: "Brownie",
        description: "Fudgy chocolate brownie",
        price: 4.50,
        size: "Small",
        inventory: 15,
        isAvailable: true,
        category: dessertsCategory._id
      },

      // BREAKFAST ITEMS (6 items)
      {
        name: "Breakfast Burrito",
        description: "Eggs, cheese, potatoes in tortilla",
        price: 8.50,
        size: "Medium",
        inventory: 12,
        isAvailable: true,
        category: breakfastCategory._id
      },
      {
        name: "Avocado Toast",
        description: "Toasted bread with avocado",
        price: 7.50,
        size: "Medium",
        inventory: 15,
        isAvailable: true,
        category: breakfastCategory._id
      },
      {
        name: "Oatmeal Bowl",
        description: "Warm oatmeal with toppings",
        price: 6.00,
        size: "Medium",
        inventory: 18,
        isAvailable: true,
        category: breakfastCategory._id
      },
      {
        name: "Yogurt Parfait",
        description: "Yogurt with granola and fruit",
        price: 6.50,
        size: "Medium",
        inventory: 14,
        isAvailable: true,
        category: breakfastCategory._id
      },
      {
        name: "Breakfast Sandwich",
        description: "Egg and cheese on English muffin",
        price: 7.25,
        size: "Medium",
        inventory: 16,
        isAvailable: true,
        category: breakfastCategory._id
      },
      {
        name: "Pancakes",
        description: "Fluffy buttermilk pancakes",
        price: 8.00,
        size: "Medium",
        inventory: 10,
        isAvailable: true,
        category: breakfastCategory._id
      },

      // LUNCH SPECIALS (5 items)
      {
        name: "Soup of the Day",
        description: "Daily fresh soup special",
        price: 6.50,
        size: "Medium",
        inventory: 20,
        isAvailable: true,
        category: lunchCategory._id
      },
      {
        name: "Quiche Lorraine",
        description: "Savory bacon and cheese quiche",
        price: 9.50,
        size: "Medium",
        inventory: 8,
        isAvailable: true,
        category: lunchCategory._id
      },
      {
        name: "Frittata",
        description: "Baked egg dish with vegetables",
        price: 8.75,
        size: "Medium",
        inventory: 10,
        isAvailable: true,
        category: lunchCategory._id
      },
      {
        name: "Pasta Salad",
        description: "Cold pasta with vegetables and dressing",
        price: 7.50,
        size: "Medium",
        inventory: 12,
        isAvailable: true,
        category: lunchCategory._id
      },
      {
        name: "Daily Special",
        description: "Chef's daily lunch creation",
        price: 10.00,
        size: "Large",
        inventory: 15,
        isAvailable: true,
        category: lunchCategory._id
      },

      // BEVERAGES (8 items)
      {
        name: "Fresh Orange Juice",
        description: "Freshly squeezed orange juice",
        price: 4.50,
        size: "Medium",
        inventory: 25,
        isAvailable: true,
        category: beveragesCategory._id
      },
      {
        name: "Apple Juice",
        description: "100% pure apple juice",
        price: 3.75,
        size: "Medium",
        inventory: 20,
        isAvailable: true,
        category: beveragesCategory._id
      },
      {
        name: "Sparkling Water",
        description: "Carbonated mineral water",
        price: 2.50,
        size: "Medium",
        inventory: 30,
        isAvailable: true,
        category: beveragesCategory._id
      },
      {
        name: "Lemonade",
        description: "Fresh lemonade",
        price: 3.50,
        size: "Medium",
        inventory: 22,
        isAvailable: true,
        category: beveragesCategory._id
      },
      {
        name: "Hot Chocolate",
        description: "Rich chocolate drink",
        price: 4.25,
        size: "Medium",
        inventory: 18,
        isAvailable: true,
        category: beveragesCategory._id
      },
      {
        name: "Milk",
        description: "Fresh whole milk",
        price: 2.75,
        size: "Medium",
        inventory: 15,
        isAvailable: true,
        category: beveragesCategory._id
      },
      {
        name: "Soda",
        description: "Assorted soft drinks",
        price: 2.25,
        size: "Medium",
        inventory: 35,
        isAvailable: true,
        category: beveragesCategory._id
      },
      {
        name: "Energy Drink",
        description: "Caffeinated energy beverage",
        price: 3.00,
        size: "Medium",
        inventory: 12,
        isAvailable: true,
        category: beveragesCategory._id
      },

      // SNACKS (6 items)
      {
        name: "Mixed Nuts",
        description: "Assortment of premium nuts",
        price: 5.50,
        size: "Small",
        inventory: 20,
        isAvailable: true,
        category: snacksCategory._id
      },
      {
        name: "Trail Mix",
        description: "Dried fruits and nuts",
        price: 4.75,
        size: "Small",
        inventory: 18,
        isAvailable: true,
        category: snacksCategory._id
      },
      {
        name: "Granola Bar",
        description: "Healthy granola snack bar",
        price: 2.75,
        size: "Small",
        inventory: 25,
        isAvailable: true,
        category: snacksCategory._id
      },
      {
        name: "Fruit Cup",
        description: "Fresh seasonal fruit",
        price: 4.00,
        size: "Small",
        inventory: 15,
        isAvailable: true,
        category: snacksCategory._id
      },
      {
        name: "Cheese Plate",
        description: "Assorted cheeses with crackers",
        price: 8.50,
        size: "Small",
        inventory: 10,
        isAvailable: true,
        category: snacksCategory._id
      },
      {
        name: "Veggie Platter",
        description: "Fresh vegetables with dip",
        price: 6.25,
        size: "Small",
        inventory: 12,
        isAvailable: true,
        category: snacksCategory._id
      },

      // BAKERY (5 items)
      {
        name: "Sourdough Bread",
        description: "Artisan sourdough loaf",
        price: 6.50,
        size: "Medium",
        inventory: 8,
        isAvailable: true,
        category: bakeryCategory._id
      },
      {
        name: "Baguette",
        description: "French bread",
        price: 3.75,
        size: "Medium",
        inventory: 12,
        isAvailable: true,
        category: bakeryCategory._id
      },
      {
        name: "Whole Wheat Bread",
        description: "Healthy whole wheat loaf",
        price: 5.25,
        size: "Medium",
        inventory: 10,
        isAvailable: true,
        category: bakeryCategory._id
      },
      {
        name: "Birthday Cake",
        description: "Custom birthday cake",
        price: 35.00,
        size: "Large",
        inventory: 3,
        isAvailable: true,
        category: bakeryCategory._id
      },
      {
        name: "Cupcakes",
        description: "Assorted flavored cupcakes",
        price: 3.50,
        size: "Small",
        inventory: 20,
        isAvailable: true,
        category: bakeryCategory._id
      }
    ];

    await Product.insertMany(allProducts);

    console.log('Data seeded successfully');
    console.log(`Created ${categories.length} categories and ${allProducts.length} products`);
    process.exit();
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedData();