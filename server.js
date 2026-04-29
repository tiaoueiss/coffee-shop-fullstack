const express = require('express');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
require('dotenv').config();

const connectDB = require('./config/db');
const { attachUser } = require('./middleware/authMiddleware');

const app = express();

connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride('_method'));
app.use(express.static('public'));

app.set('view engine', 'ejs');

// Make logged-in user available in all views
app.use(attachUser);

app.use('/', require('./routes/authRoutes'));
app.use('/dashboard', require('./routes/dashboardRoutes'));
app.use('/users', require('./routes/userRoutes'));
app.use('/products', require('./routes/productRoutes'));
app.use('/categories', require('./routes/categoryRoutes'));
app.use('/orders', require('./routes/orderRoutes'));
app.use('/feedback', require('./routes/feedbackRoutes'));

app.use((req, res) => {
  res.status(404).render('error', { message: 'Page not found' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
