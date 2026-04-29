// controllers/dashboardController.js
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

// GET /dashboard — render role-specific dashboard
exports.show = async (req, res) => {
  try {
    const role = req.user.role;

    if (role === 'admin') {
      // Admin sees full stats overview
      const [totalOrders, totalCustomers, totalProducts, recentOrders] = await Promise.all([
        Order.countDocuments(),
        User.countDocuments({ role: 'customer' }),
        Product.countDocuments(),
        Order.find()
          .populate('customer', 'name email')
          .populate('products.product', 'name price')
          .sort({ orderDate: -1 })
          .limit(5)
      ]);

      // Revenue: sum of all completed order totals
      const revenueResult = await Order.aggregate([
        { $match: { status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]);
      const totalRevenue = revenueResult[0]?.total || 0;

      return res.render('dashboard/admin', {
        user: req.user,
        stats: { totalOrders, totalCustomers, totalProducts, totalRevenue },
        recentOrders
      });
    }

    if (role === 'employee') {
      // Employee sees pending and in-progress orders
      const [pendingOrders, allTodayOrders] = await Promise.all([
        Order.find({ status: 'pending' })
          .populate('customer', 'name')
          .populate('products.product', 'name size')
          .sort({ orderDate: 1 }),
        Order.find({
          orderDate: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
        }).countDocuments()
      ]);

      return res.render('dashboard/employee', {
        user: req.user,
        pendingOrders,
        stats: { allTodayOrders, pendingCount: pendingOrders.length }
      });
    }

    // Customer sees their own orders and loyalty points
    const recentOrders = await Order.find({ customer: req.user.id })
      .populate('products.product', 'name price')
      .sort({ orderDate: -1 })
      .limit(5);

    const customerData = await User.findById(req.user.id).select('loyaltyPoints name');

    return res.render('dashboard/customer', {
      user: req.user,
      recentOrders,
      loyaltyPoints: customerData.loyaltyPoints
    });
  } catch (err) {
    res.status(500).render('error', { message: err.message });
  }
};
