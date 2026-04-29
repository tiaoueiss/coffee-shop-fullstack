// controllers/userController.js
const User = require('../models/User');
const Order = require('../models/Order');
const bcrypt = require('bcrypt');

// GET /users — list all users (admin only)
exports.index = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.render('users/index', { users, user: req.user });
  } catch (err) {
    res.status(500).render('error', { message: err.message });
  }
};

// GET /users?role=customer|employee|admin — filter by role (admin only)
exports.indexByRole = async (req, res) => {
  try {
    const filter = req.query.role ? { role: req.query.role } : {};
    const users = await User.find(filter).select('-password');
    res.render('users/index', { users, user: req.user });
  } catch (err) {
    res.status(500).render('error', { message: err.message });
  }
};

// GET /users/:id — show one user's profile
exports.show = async (req, res) => {
  try {
    const foundUser = await User.findById(req.params.id).select('-password');

    if (!foundUser) {
      return res.status(404).render('error', { message: 'User not found' });
    }

    // Customers can only view their own profile; admins/employees can view anyone
    if (req.user.role === 'customer' && foundUser._id.toString() !== req.user.id) {
      return res.status(403).render('error', { message: 'You can only view your own profile' });
    }

    res.render('users/show', { foundUser, user: req.user });
  } catch (err) {
    res.status(500).render('error', { message: err.message });
  }
};

// GET /users/:id/edit — show edit form
exports.editForm = async (req, res) => {
  try {
    const foundUser = await User.findById(req.params.id).select('-password');

    if (!foundUser) {
      return res.status(404).render('error', { message: 'User not found' });
    }

    // Customers can only edit their own profile
    if (req.user.role === 'customer' && foundUser._id.toString() !== req.user.id) {
      return res.status(403).render('error', { message: 'You can only edit your own profile' });
    }

    res.render('users/edit', { foundUser, user: req.user, error: null });
  } catch (err) {
    res.status(500).render('error', { message: err.message });
  }
};

// PUT /users/:id — update user
exports.update = async (req, res) => {
  try {
    const foundUser = await User.findById(req.params.id);

    if (!foundUser) {
      return res.status(404).render('error', { message: 'User not found' });
    }

    // Customers can only update their own profile
    if (req.user.role === 'customer' && foundUser._id.toString() !== req.user.id) {
      return res.status(403).render('error', { message: 'You can only edit your own profile' });
    }

    const { name, email, phone } = req.body;
    const updateData = { name, email, phone };

    // Only admins can change loyalty points or role
    if (req.user.role === 'admin') {
      if (req.body.loyaltyPoints !== undefined) updateData.loyaltyPoints = req.body.loyaltyPoints;
      if (req.body.role) updateData.role = req.body.role;
    }

    // If a new password was provided, hash it
    if (req.body.password && req.body.password.trim() !== '') {
      updateData.password = await bcrypt.hash(req.body.password, 10);
    }

    await User.findByIdAndUpdate(req.params.id, updateData, { runValidators: true });
    res.redirect(`/users/${req.params.id}`);
  } catch (err) {
    res.status(400).render('error', { message: err.message });
  }
};

// DELETE /users/:id — delete user (admin only)
exports.delete = async (req, res) => {
  try {
    const foundUser = await User.findById(req.params.id);

    if (!foundUser) {
      return res.status(404).render('error', { message: 'User not found' });
    }

    await User.findByIdAndDelete(req.params.id);
    res.redirect('/users');
  } catch (err) {
    res.status(500).render('error', { message: err.message });
  }
};

// GET /users/:id/orders — show all orders for a user
exports.showOrders = async (req, res) => {
  try {
    // Customers can only view their own orders
    if (req.user.role === 'customer' && req.params.id !== req.user.id) {
      return res.status(403).render('error', { message: 'You can only view your own orders' });
    }

    const foundUser = await User.findById(req.params.id).select('-password');
    if (!foundUser) {
      return res.status(404).render('error', { message: 'User not found' });
    }

    const orders = await Order.find({ customer: req.params.id })
      .populate('products.product')
      .sort({ orderDate: -1 });

    res.render('users/orders', { foundUser, orders, user: req.user });
  } catch (err) {
    res.status(500).render('error', { message: err.message });
  }
};
