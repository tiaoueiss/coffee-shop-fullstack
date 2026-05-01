const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Category = require('./models/Category');
const Product = require('./models/Product');
const User = require('./models/User');
require('dotenv').config();

const p = (lbp) => parseFloat((lbp / 100000).toFixed(2));

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URI);

    await Category.deleteMany({});
    await Product.deleteMany({});

    const cats = await Category.insertMany([
      { name: 'Black Coffee',    description: 'Pure espresso-based black coffees',              image: 'Black Coffee.png' },
      { name: 'Hot Beverages',   description: 'Hot milk-based drinks and specialty beverages',  image: 'Hot Beverages.png' },
      { name: 'Iced Beverages',  description: 'Cold and iced coffee drinks',                    image: 'Iced Beverages.png' },
      { name: 'Blended Drinks',  description: 'Frappés, shakes and blended specialties',        image: 'Blended Drinks.png' },
      { name: 'Tea',             description: 'Hot and iced teas',                              image: 'Tea.png' },
      { name: 'Soft Drinks',     description: 'Juices, waters and sodas',                       image: 'Soft Drinks.png' },
      { name: 'Coffee Beans',    description: 'Retail whole beans — 250g bags',                 image: 'Coffee Beans.png' },
      { name: 'Pastries & Rolls',description: 'French pastries, rolls and éclairs',             image: 'Pastries & Rolls.png' },
      { name: 'Croissants',      description: 'Freshly baked croissants and cookies',           image: 'Croissants.png' },
      { name: 'Cakes & Muffins', description: 'Slices, muffins and cheesecakes',                image: 'Cakes & Muffins.png' },
      { name: 'Salads',          description: 'Fresh salads and salad bar',                     image: 'Salads.png' },
      { name: 'Frozen Yogurt',   description: 'Frozen yogurt with toppings',                    image: 'Frozen Yogurt.png' },
      { name: 'Sandwiches',      description: 'Freshly baked subs and wraps',                   image: 'Sandwiches.png' },
      { name: 'Plat du Jour',    description: 'Daily hot dishes — selection varies',             image: 'Plat du Jour.png' },
      { name: 'Pizza Slices',    description: 'Available at Jbeil store',                       image: 'Pizza Slices.png' },
      { name: 'Gluten Free',     description: 'Gluten-free healthy bites and cakes',            image: 'Gluten Free.png' },
    ]);

    const cat = Object.fromEntries(cats.map(c => [c.name, c._id]));

    const products = [
      // ── BLACK COFFEE ──────────────────────────────────────────────
      { name: 'Espresso',           price: p(250000), category: cat['Black Coffee'],   inventory: 100 },
      { name: 'Double Espresso',    price: p(300000), category: cat['Black Coffee'],   inventory: 100 },
      { name: 'Triple Espresso',    price: p(350000), category: cat['Black Coffee'],   inventory: 100 },
      { name: 'Single Longo',       price: p(300000), category: cat['Black Coffee'],   inventory: 100 },
      { name: 'Double Longo',       price: p(350000), category: cat['Black Coffee'],   inventory: 100 },
      { name: 'Americano',          price: p(350000), category: cat['Black Coffee'],   inventory: 100 },
      { name: 'Black Coffee Drip',  price: p(350000), category: cat['Black Coffee'],   inventory: 100 },

      // ── HOT BEVERAGES ─────────────────────────────────────────────
      { name: 'Cappuccino',              price: p(450000), category: cat['Hot Beverages'], inventory: 80 },
      { name: 'Latte',                   price: p(450000), category: cat['Hot Beverages'], inventory: 80 },
      { name: 'Flat White',              price: p(400000), category: cat['Hot Beverages'], inventory: 80 },
      { name: 'Mocha',                   price: p(500000), category: cat['Hot Beverages'], inventory: 80 },
      { name: 'White Mocha',             price: p(500000), category: cat['Hot Beverages'], inventory: 80 },
      { name: 'Caramel Macchiato',       price: p(400000), category: cat['Hot Beverages'], inventory: 80 },
      { name: 'Salted Caramel Latte',    price: p(450000), category: cat['Hot Beverages'], inventory: 80 },
      { name: 'Spanish Latte',           price: p(450000), category: cat['Hot Beverages'], inventory: 80 },
      { name: 'Toffee Nut Latte',        price: p(450000), category: cat['Hot Beverages'], inventory: 80 },
      { name: 'Matcha Latte',            price: p(400000), category: cat['Hot Beverages'], inventory: 60 },
      { name: 'Hot Doubleshot',          price: p(500000), category: cat['Hot Beverages'], inventory: 60 },
      { name: 'Classic Hot Chocolate',   price: p(450000), category: cat['Hot Beverages'], inventory: 60 },
      { name: 'Signature Hot Chocolate', price: p(550000), category: cat['Hot Beverages'], inventory: 60 },
      { name: 'Steamed Milk',            price: p(300000), category: cat['Hot Beverages'], inventory: 50 },

      // ── ICED BEVERAGES ────────────────────────────────────────────
      { name: 'Iced Americano',             price: p(450000), category: cat['Iced Beverages'], inventory: 80 },
      { name: 'Iced Latte',                 price: p(450000), category: cat['Iced Beverages'], inventory: 80 },
      { name: 'Iced Mocha',                 price: p(450000), category: cat['Iced Beverages'], inventory: 80 },
      { name: 'Iced White Mocha',           price: p(450000), category: cat['Iced Beverages'], inventory: 80 },
      { name: 'Iced Caramel Macchiato',     price: p(450000), category: cat['Iced Beverages'], inventory: 80 },
      { name: 'Iced Salted Caramel Latte',  price: p(450000), category: cat['Iced Beverages'], inventory: 80 },
      { name: 'Iced Toffee Nut Latte',      price: p(450000), category: cat['Iced Beverages'], inventory: 80 },
      { name: 'Iced Classic Chocolate',     price: p(450000), category: cat['Iced Beverages'], inventory: 80 },
      { name: 'Iced Spanish Latte',         price: p(500000), category: cat['Iced Beverages'], inventory: 80 },
      { name: 'Iced Double Shot Toffee Nut',price: p(450000), category: cat['Iced Beverages'], inventory: 60 },
      { name: 'Signature Iced Chocolate',   price: p(500000), category: cat['Iced Beverages'], inventory: 60 },
      { name: 'Double Shot Shaken',         price: p(450000), category: cat['Iced Beverages'], inventory: 60 },
      { name: 'Cold Brew Bottle',           price: p(450000), category: cat['Iced Beverages'], inventory: 40 },
      { name: 'Bluenade',                   price: p(450000), category: cat['Iced Beverages'], inventory: 40 },

      // ── BLENDED DRINKS ────────────────────────────────────────────
      { name: 'Coffee Frappe',               price: p(400000), category: cat['Blended Drinks'], inventory: 60 },
      { name: 'Espresso Frappe',             price: p(400000), category: cat['Blended Drinks'], inventory: 60 },
      { name: 'Mocha Frappe',                price: p(450000), category: cat['Blended Drinks'], inventory: 60 },
      { name: 'Caramel Cream Frappe',        price: p(450000), category: cat['Blended Drinks'], inventory: 60 },
      { name: 'Chocolate Cream Frappe',      price: p(450000), category: cat['Blended Drinks'], inventory: 60 },
      { name: 'Hazelnut Frappe',             price: p(450000), category: cat['Blended Drinks'], inventory: 60 },
      { name: 'Matcha Cream Frappe',         price: p(450000), category: cat['Blended Drinks'], inventory: 60 },
      { name: 'Salted Caramel Cream Frappe', price: p(450000), category: cat['Blended Drinks'], inventory: 60 },
      { name: 'Strawberry Cream Frappe',     price: p(450000), category: cat['Blended Drinks'], inventory: 60 },
      { name: 'Vanilla Cream Frappe',        price: p(450000), category: cat['Blended Drinks'], inventory: 60 },
      { name: 'White Mocha Cream Frappe',    price: p(450000), category: cat['Blended Drinks'], inventory: 60 },
      { name: 'Strawberry Protein Shake',    price: p(550000), category: cat['Blended Drinks'], inventory: 40 },

      // ── TEA ───────────────────────────────────────────────────────
      { name: 'English Breakfast Tea',      price: p(350000), category: cat['Tea'], inventory: 50 },
      { name: 'Earl Grey Lavender Tea',     price: p(350000), category: cat['Tea'], inventory: 50 },
      { name: 'Bombay Chai Black Tea',      price: p(350000), category: cat['Tea'], inventory: 50 },
      { name: 'Golden Chamomile Herbal Tea',price: p(350000), category: cat['Tea'], inventory: 50 },
      { name: 'Lemon Grass & Orange Tea',   price: p(350000), category: cat['Tea'], inventory: 50 },
      { name: 'Mediterranean Caramel Tea',  price: p(350000), category: cat['Tea'], inventory: 50 },
      { name: 'Organic Green Tea',          price: p(350000), category: cat['Tea'], inventory: 50 },
      { name: 'Sweet Ginger Peach Black Tea',price: p(350000),category: cat['Tea'], inventory: 50 },
      { name: 'Southern Mint Herbal Tea',   price: p(350000), category: cat['Tea'], inventory: 50 },
      { name: 'Iced Tea Peach',             price: p(400000), category: cat['Tea'], inventory: 50 },

      // ── SOFT DRINKS ───────────────────────────────────────────────
      { name: 'Mawardi Juice 250ml',           price: p(300000), category: cat['Soft Drinks'], inventory: 30 },
      { name: 'Lemon Juice 250ml',             price: p(300000), category: cat['Soft Drinks'], inventory: 30 },
      { name: 'Apple Juice 250ml',             price: p(300000), category: cat['Soft Drinks'], inventory: 30 },
      { name: 'Orange Juice 250ml',            price: p(300000), category: cat['Soft Drinks'], inventory: 30 },
      { name: 'Pomegranate Juice 250ml',       price: p(300000), category: cat['Soft Drinks'], inventory: 30 },
      { name: 'Rim Sparkling Water 250ml',     price: p(120000), category: cat['Soft Drinks'], inventory: 50 },
      { name: 'San Benedetto Clementine 330ml',price: p(300000), category: cat['Soft Drinks'], inventory: 30 },
      { name: 'San Benedetto Lemon 330ml',     price: p(300000), category: cat['Soft Drinks'], inventory: 30 },
      { name: 'San Benedetto Water 250ml',     price: p(300000), category: cat['Soft Drinks'], inventory: 30 },
      { name: 'Water Bottle 500ml',            price: p(50000),  category: cat['Soft Drinks'], inventory: 60 },
      { name: 'VIWA Vitamin Water 600ml',      price: p(450000), category: cat['Soft Drinks'], inventory: 20 },

      // ── COFFEE BEANS ──────────────────────────────────────────────
      { name: 'Yirgacheffe 250G',   price: p(800000),  category: cat['Coffee Beans'], inventory: 15 },
      { name: 'American Coffee 250G',price: p(800000), category: cat['Coffee Beans'], inventory: 15 },
      { name: 'House Blend 250G',   price: p(1000000), category: cat['Coffee Beans'], inventory: 15 },

      // ── PASTRIES & ROLLS ──────────────────────────────────────────
      { name: 'Lotus Roll',           price: p(600000), category: cat['Pastries & Rolls'], inventory: 20 },
      { name: 'Chocolate Roll',       price: p(450000), category: cat['Pastries & Rolls'], inventory: 20 },
      { name: 'Classic Cinnamon Roll',price: p(600000), category: cat['Pastries & Rolls'], inventory: 20 },
      { name: 'Eclair Chocolat',      price: p(450000), category: cat['Pastries & Rolls'], inventory: 20 },
      { name: 'Eclair Caramel',       price: p(550000), category: cat['Pastries & Rolls'], inventory: 20 },
      { name: 'Eclair Classic',       price: p(450000), category: cat['Pastries & Rolls'], inventory: 20 },
      { name: 'Eclair Coffee',        price: p(450000), category: cat['Pastries & Rolls'], inventory: 20 },
      { name: 'Fondant Au Chocolat',  price: p(600000), category: cat['Pastries & Rolls'], inventory: 15 },
      { name: 'Tarte Au Chocolat',    price: p(450000), category: cat['Pastries & Rolls'], inventory: 15 },
      { name: 'Tiramisu',             price: p(650000), category: cat['Pastries & Rolls'], inventory: 15 },
      { name: 'Macarons',             price: p(550000), category: cat['Pastries & Rolls'], inventory: 25 },
      { name: 'Chocolate Salted Cake',price: p(450000), category: cat['Pastries & Rolls'], inventory: 15 },

      // ── CROISSANTS & COOKIES ──────────────────────────────────────
      { name: 'Plain Croissant',                      price: p(350000), category: cat['Croissants'], inventory: 30 },
      { name: 'Almond Croissant',                     price: p(400000), category: cat['Croissants'], inventory: 25 },
      { name: 'Cheese Croissant',                     price: p(400000), category: cat['Croissants'], inventory: 25 },
      { name: 'Pain Au Chocolat',                     price: p(400000), category: cat['Croissants'], inventory: 25 },
      { name: 'Zaatar Croissant',                     price: p(350000), category: cat['Croissants'], inventory: 25 },
      { name: 'Double Chocolate Mini Chunk Cookie',   price: p(300000), category: cat['Croissants'], inventory: 30 },
      { name: 'Chocolate Chip Walnut Mini Chunk Cookie',price: p(300000),category: cat['Croissants'],inventory: 30 },
      { name: 'Apricot Sable',                        price: p(400000), category: cat['Croissants'], inventory: 20 },
      { name: 'Chocolate Sable',                      price: p(400000), category: cat['Croissants'], inventory: 20 },

      // ── CAKES & MUFFINS ───────────────────────────────────────────
      { name: 'Blueberry Muffin',       price: p(350000), category: cat['Cakes & Muffins'], inventory: 20 },
      { name: 'Double Chocolate Muffin',price: p(350000), category: cat['Cakes & Muffins'], inventory: 20 },
      { name: 'Vanilla Muffin',         price: p(500000), category: cat['Cakes & Muffins'], inventory: 20 },
      { name: 'Carrot Cake',            price: p(500000), category: cat['Cakes & Muffins'], inventory: 15 },
      { name: 'Orange Cake',            price: p(650000), category: cat['Cakes & Muffins'], inventory: 12 },
      { name: 'Brownies Cake',          price: p(350000), category: cat['Cakes & Muffins'], inventory: 20 },
      { name: 'Lazy Cake',              price: p(650000), category: cat['Cakes & Muffins'], inventory: 10 },
      { name: 'Blueberry Cheesecake',   price: p(650000), category: cat['Cakes & Muffins'], inventory: 10 },
      { name: 'Lotus Cheesecake',       price: p(550000), category: cat['Cakes & Muffins'], inventory: 10 },
      { name: 'Framboise Cheesecake',   price: p(650000), category: cat['Cakes & Muffins'], inventory: 10 },

      // ── SALADS ────────────────────────────────────────────────────
      { name: 'Salad Bar (1 visit)',  price: p(1200000), category: cat['Salads'], inventory: 20 },
      { name: 'Caesar Salad',         price: p(750000),  category: cat['Salads'], inventory: 15 },
      { name: 'Chicken Caesar Salad', price: p(900000),  category: cat['Salads'], inventory: 15 },
      { name: 'Quinoa Salad',         price: p(800000),  category: cat['Salads'], inventory: 12 },
      { name: 'Tuna Pasta Salad',     price: p(850000),  category: cat['Salads'], inventory: 12 },
      { name: 'Asian Salad',          price: p(750000),  category: cat['Salads'], inventory: 12 },
      { name: 'Mexican Fiesta Salad', price: p(800000),  category: cat['Salads'], inventory: 12 },
      { name: 'Chicken Verde Salad',  price: p(850000),  category: cat['Salads'], inventory: 12 },
      { name: 'Pasta Pesto Salad',    price: p(900000),  category: cat['Salads'], inventory: 12 },

      // ── FROZEN YOGURT ─────────────────────────────────────────────
      { name: 'Original Yogurt Combo',     price: p(700000), category: cat['Frozen Yogurt'], inventory: 30 },
      { name: 'Chocolate Yogurt Combo',    price: p(800000), category: cat['Frozen Yogurt'], inventory: 30 },
      { name: 'Blueberry Yogurt Combo',    price: p(800000), category: cat['Frozen Yogurt'], inventory: 30 },
      { name: 'Mango Yogurt Combo',        price: p(700000), category: cat['Frozen Yogurt'], inventory: 30 },
      { name: 'Strawberry Yogurt Combo',   price: p(750000), category: cat['Frozen Yogurt'], inventory: 30 },
      { name: 'Lotus Spread Yogurt Combo', price: p(800000), category: cat['Frozen Yogurt'], inventory: 30 },
      { name: 'Lotus Yogurt Combo',        price: p(800000), category: cat['Frozen Yogurt'], inventory: 30 },
      { name: 'Pomegranate Yogurt Combo',  price: p(750000), category: cat['Frozen Yogurt'], inventory: 30 },

      // ── SANDWICHES ────────────────────────────────────────────────
      { name: 'Labneh Sub',          price: p(500000), category: cat['Sandwiches'], inventory: 20, description: 'Rocca, cherry tomatoes, cucumber, olives, mint, olive oil and salt' },
      { name: 'Chicken Teriyaki Sub',price: p(600000), category: cat['Sandwiches'], inventory: 20, description: 'Grilled chicken, cheddar, lettuce, pickles, mayonnaise and honey mustard' },
      { name: 'Chicken Caesar Sub',  price: p(550000), category: cat['Sandwiches'], inventory: 20, description: 'Caesar sauce, lettuce, grilled chicken, parmesan and pickles' },
      { name: 'Pesto Halloumi Sub',  price: p(550000), category: cat['Sandwiches'], inventory: 20, description: 'Rocca, cherry tomatoes, cucumber, olives and pesto sauce' },
      { name: 'Tuna Sub',            price: p(550000), category: cat['Sandwiches'], inventory: 20, description: 'Lettuce, tomato, pickles, olive oil & vinegar, mayonnaise, salt and black pepper' },
      { name: 'Turkey & Cheese Sub', price: p(650000), category: cat['Sandwiches'], inventory: 20, description: 'White cheese or cheddar, lettuce, tomato, pickles and mayonnaise' },

      // ── PLAT DU JOUR ──────────────────────────────────────────────
      { name: 'Freekeh With Chicken',   price: p(1050000), category: cat['Plat du Jour'], inventory: 15 },
      { name: 'Chicken Alfredo Pasta',  price: p(1050000), category: cat['Plat du Jour'], inventory: 15 },
      { name: 'B.B.Q Chicken',          price: p(1050000), category: cat['Plat du Jour'], inventory: 15 },
      { name: 'Kibbeh B Laban',         price: p(1050000), category: cat['Plat du Jour'], inventory: 15 },
      { name: 'Chicken Stroganoff',     price: p(1050000), category: cat['Plat du Jour'], inventory: 15 },
      { name: 'Butter Chicken',         price: p(1050000), category: cat['Plat du Jour'], inventory: 15 },
      { name: 'Lasagna',                price: p(1050000), category: cat['Plat du Jour'], inventory: 15 },
      { name: 'Oriental Rice',          price: p(1050000), category: cat['Plat du Jour'], inventory: 15 },
      { name: 'Potato Souffle',         price: p(1050000), category: cat['Plat du Jour'], inventory: 15 },
      { name: 'Roasted Chicken',        price: p(1050000), category: cat['Plat du Jour'], inventory: 15 },
      { name: 'Shish Barak',            price: p(1050000), category: cat['Plat du Jour'], inventory: 15 },
      { name: 'Spaghetti Bolognese',    price: p(1050000), category: cat['Plat du Jour'], inventory: 15 },
      { name: 'Vegetarian Grape Leaves',price: p(1050000), category: cat['Plat du Jour'], inventory: 15 },

      // ── PIZZA SLICES ──────────────────────────────────────────────
      { name: 'Margherita Slice',      price: p(600000), category: cat['Pizza Slices'], inventory: 10, description: 'Tomato sauce, mozzarella, oregano and fresh basil' },
      { name: 'Pepperoni Slice',       price: p(900000), category: cat['Pizza Slices'], inventory: 10, description: 'Tomato sauce, pepperoni, mozzarella and oregano' },
      { name: 'Pesto Halloumi Slice',  price: p(550000), category: cat['Pizza Slices'], inventory: 10, description: 'Pesto sauce, halloumi, caramelized onion, sundried tomatoes and rocca' },
      { name: 'Smoked Turkey Slice',   price: p(800000), category: cat['Pizza Slices'], inventory: 10, description: 'Fresh cream, smoked turkey, mushrooms, mozzarella, pickles and olives' },
      { name: 'Bulgari Mix Slice',     price: p(700000), category: cat['Pizza Slices'], inventory: 10, description: 'Bulgari mix, mozzarella, rocca, cucumber, walnuts and pomegranate' },
      { name: 'Lebanese Slice',        price: p(700000), category: cat['Pizza Slices'], inventory: 10, description: 'Tomato sauce, smoked turkey, mushrooms, olives, mozzarella, cherry tomatoes' },
      { name: 'Chicken Caesar Slice',  price: p(600000), category: cat['Pizza Slices'], inventory: 10, description: 'Fresh cream, chicken breast, parmesan, mushrooms, mozzarella, caesar sauce' },

      // ── GLUTEN FREE ───────────────────────────────────────────────
      { name: 'Nut Blend',                 price: p(500000), category: cat['Gluten Free'], inventory: 20, description: 'Gluten free, dairy free, vegan, no added sugar' },
      { name: 'Sesame Blend',              price: p(350000), category: cat['Gluten Free'], inventory: 20, description: 'Gluten free, dairy free, no added sugar' },
      { name: 'Pistachio Cheesecake (GF)', price: p(750000), category: cat['Gluten Free'], inventory: 10, description: 'Gluten free' },
      { name: 'Pistachio Date Ball',       price: p(350000), category: cat['Gluten Free'], inventory: 20, description: 'Gluten free, dairy free, vegan, no added sugar' },
      { name: 'White Truffle Choco Ball',  price: p(350000), category: cat['Gluten Free'], inventory: 20, description: 'Gluten free, no added sugar' },
      { name: 'Cacao Truffle Choco Ball',  price: p(350000), category: cat['Gluten Free'], inventory: 20, description: 'Gluten free, dairy free, vegan, no added sugar' },
      { name: 'Coconut Date Ball',         price: p(350000), category: cat['Gluten Free'], inventory: 20, description: 'Gluten free, dairy free, vegan, no added sugar' },
      { name: 'GF Plain Croissant',        price: p(600000), category: cat['Gluten Free'], inventory: 10, description: 'Gluten free, dairy free' },
      { name: 'GF Cheese Croissant',       price: p(600000), category: cat['Gluten Free'], inventory: 10, description: 'Gluten free' },
      { name: 'GF Almond Croissant',       price: p(750000), category: cat['Gluten Free'], inventory: 10, description: 'Gluten free, dairy free' },
      { name: 'GF Thyme Croissant',        price: p(600000), category: cat['Gluten Free'], inventory: 10, description: 'Gluten free, dairy free' },
      { name: 'Pistachio Cake (GF)',        price: p(750000), category: cat['Gluten Free'], inventory: 8,  description: 'Gluten free' },
      { name: 'Red Velvet (GF)',            price: p(750000), category: cat['Gluten Free'], inventory: 8,  description: 'Gluten free' },
      { name: 'Almond Apple Cake (GF)',     price: p(750000), category: cat['Gluten Free'], inventory: 8,  description: 'Gluten free, dairy free' },
      { name: 'Carrot Cake (GF)',           price: p(750000), category: cat['Gluten Free'], inventory: 8,  description: 'Gluten free' },
      { name: 'Lemon Cake (GF)',            price: p(750000), category: cat['Gluten Free'], inventory: 8,  description: 'Gluten free, dairy free' },
      { name: 'Coconut Cake (GF)',          price: p(750000), category: cat['Gluten Free'], inventory: 8,  description: 'Gluten free, dairy free' },
      { name: 'Praline Kiss Cookie (GF)',   price: p(650000), category: cat['Gluten Free'], inventory: 15, description: 'Gluten free' },
      { name: 'Crème Brûlée Donut (GF)',    price: p(550000), category: cat['Gluten Free'], inventory: 10, description: 'Gluten free' },
    ];

    await Product.insertMany(products);

    // Admin user
    const existing = await User.findOne({ username: 'admin' });
    if (!existing) {
      const hashed = await bcrypt.hash('1234', 10);
      await User.create({
        name: 'Admin',
        username: 'admin',
        email: 'admin@stories.com',
        password: hashed,
        role: 'admin',
        loyaltyPoints: 0
      });
      console.log('Admin created — email: admin@stories.com / password: 1234');
    } else {
      console.log('Admin already exists, skipping.');
    }

    console.log(`Seeded ${cats.length} categories and ${products.length} products.`);
    process.exit();
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  }
};

seedData();
