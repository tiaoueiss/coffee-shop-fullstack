const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = '24h';

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 24 * 60 * 60 * 1000
};

// Helper: generate a signed JWT for a user
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user._id, 
      email: user.email, 
      role: user.role,
      name: user.name
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

// GET /register — show registration form
exports.showRegisterForm = (req, res) => {
  // If already logged in, send them to dashboard instead
  if (req.user) return res.redirect('/dashboard');
  res.render('auth/register', { error: null, user: null });
};

// POST /register — process registration
exports.register = async (req, res) => {
  try {
    const { name, username, email, phone, password, confirmPassword } = req.body;

    // Basic validation
    if (!name || !username || !email || !password) {
      return res.status(400).render('auth/register', {
        error: 'All fields are required',
        user: null
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).render('auth/register', { 
        error: 'Passwords do not match', 
        user: null 
      });
    }

    if (password.length < 6) {
      return res.status(400).render('auth/register', { 
        error: 'Password must be at least 6 characters', 
        user: null 
      });
    }

    // Check if email is already registered
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).render('auth/register', {
        error: 'Email already registered',
        user: null
      });
    }

    // Hash password — 10 rounds is the standard balance of security vs speed
    const hashedPassword = await bcrypt.hash(password, 10);

    // Always register as 'customer' from public form; admins/employees created via admin route
    const newUser = await User.create({
      name,
      username,
      email: email.toLowerCase(),
      phone,
      password: hashedPassword,
      role: 'customer',
      loyaltyPoints: 0
    });

    // Auto-login after registration: generate token and set cookie
    const token = generateToken(newUser);
    res.cookie('token', token, cookieOptions);

    res.redirect('/dashboard');
  } catch (err) {
    res.status(500).render('auth/register', { 
      error: err.message, 
      user: null 
    });
  }
};

// GET /login — show login form
exports.showLoginForm = (req, res) => {
  if (req.user) return res.redirect('/dashboard');
  res.render('auth/login', { error: null, user: null });
};

// POST /login — process login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).render('auth/login', { 
        error: 'Email and password are required', 
        user: null 
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      // Generic error — don't reveal whether email exists (prevents user enumeration attacks)
      return res.status(401).render('auth/login', {
        error: 'Invalid email or password',
        user: null
      });
    }

    // Compare submitted password with stored hash
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).render('auth/login', {
        error: 'Invalid email or password',
        user: null
      });
    }

    // Credentials valid — issue JWT and set as httpOnly cookie
    const token = generateToken(user);
    res.cookie('token', token, cookieOptions);

    res.redirect('/dashboard');
  } catch (err) {
    res.status(500).render('auth/login', { 
      error: 'An error occurred. Please try again.', 
      user: null 
    });
  }
};

// GET /logout — clear cookie and redirect
exports.logout = (req, res) => {
  res.clearCookie('token', cookieOptions);
  res.redirect('/login');
};