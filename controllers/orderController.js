const Order = require('../models/Order');
const Customer = require('../models/Customer');
const Product = require('../models/Product');

// GET /orders — list orders (role-aware)
exports.index = async (req, res) => {
  try {
    let orders;
    
    // Customers see only their own orders; admins/employees see all
    if (req.user.role === 'customer') {
      orders = await Order.find({ customer: req.user.id })
        .populate('customer', 'name email')
        .populate('products.product')
        .sort({ orderDate: -1 });
    } else {
      orders = await Order.find()
        .populate('customer', 'name email')
        .populate('products.product')
        .sort({ orderDate: -1 });
    }
    
    res.render('orders/index', { orders, user: req.user });
  } catch (err) {
    res.status(500).render('error', { message: err.message });
  }
};

// GET /orders/:id — show one order's details
exports.show = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customer', 'name email phone')
      .populate('products.product');
    
    if (!order) {
      return res.status(404).render('error', { message: 'Order not found' });
    }
    
    // Customers can only view their own orders
    if (req.user.role === 'customer' && order.customer._id.toString() !== req.user.id) {
      return res.status(403).render('error', { message: 'You can only view your own orders' });
    }
    
    res.render('orders/show', { order, user: req.user });
  } catch (err) {
    res.status(500).render('error', { message: err.message });
  }
};

// GET /orders/new — show order creation form
exports.newForm = async (req, res) => {
  try {
    // Need all available products for the multi-select with quantities
    const products = await Product.find({ isAvailable: true }).populate('category');
    
    // Admins/employees pick which customer the order is for; customers create for themselves
    let customers = [];
    if (req.user.role === 'admin' || req.user.role === 'employee') {
      customers = await Customer.find({ role: 'customer' }).select('name email');
    }
    
    res.render('orders/new', { 
      products, 
      customers, 
      user: req.user, 
      error: null 
    });
  } catch (err) {
    res.status(500).render('error', { message: err.message });
  }
};

// POST /orders — process order creation
exports.create = async (req, res) => {
  try {
    const { customerId, productIds, quantities } = req.body;
    
    // Determine which customer this order is for
    let customer;
    if (req.user.role === 'customer') {
      customer = req.user.id;  // customers can only order for themselves
    } else {
      customer = customerId;   // admins/employees pick from dropdown
      if (!customer) {
        const products = await Product.find({ isAvailable: true });
        const customers = await Customer.find({ role: 'customer' });
        return res.status(400).render('orders/new', {
          products, customers, user: req.user,
          error: 'Please select a customer'
        });
      }
    }
    
    // Normalize productIds and quantities into arrays
    // (form sends single values when only one product is selected, arrays when multiple)
    const productIdArray = Array.isArray(productIds) ? productIds : [productIds];
    const quantityArray = Array.isArray(quantities) ? quantities : [quantities];
    
    // Filter out empty selections and pair products with their quantities
    const orderProducts = [];
    let totalAmount = 0;
    
    for (let i = 0; i < productIdArray.length; i++) {
      const productId = productIdArray[i];
      const quantity = parseInt(quantityArray[i]);
      
      // Skip empty selections or zero quantities
      if (!productId || !quantity || quantity < 1) continue;
      
      // Fetch product to get its price (NEVER trust price from form data)
      const product = await Product.findById(productId);
      if (!product || !product.isAvailable) continue;
      
      orderProducts.push({ product: productId, quantity });
      totalAmount += product.price * quantity;
    }
    
    if (orderProducts.length === 0) {
      const products = await Product.find({ isAvailable: true });
      const customers = req.user.role !== 'customer' 
        ? await Customer.find({ role: 'customer' }) 
        : [];
      return res.status(400).render('orders/new', {
        products, customers, user: req.user,
        error: 'Please select at least one product with a valid quantity'
      });
    }
    
    // Create the order
    const newOrder = await Order.create({
      customer,
      products: orderProducts,
      orderDate: new Date(),
      totalAmount: totalAmount.toFixed(2),
      status: 'pending'
    });
    
    // Award loyalty points (1 point per dollar spent — adjust formula as desired)
    await Customer.findByIdAndUpdate(customer, {
      $inc: { loyaltyPoints: Math.floor(totalAmount) }
    });
    
    res.redirect(`/orders/${newOrder._id}`);
  } catch (err) {
    res.status(500).render('error', { message: err.message });
  }
};

// GET /orders/:id/edit — show edit form (admin/employee only)
exports.editForm = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customer')
      .populate('products.product');
    
    if (!order) {
      return res.status(404).render('error', { message: 'Order not found' });
    }
    
    const products = await Product.find({ isAvailable: true });
    const customers = await Customer.find({ role: 'customer' });
    
    res.render('orders/edit', { 
      order, 
      products, 
      customers, 
      user: req.user, 
      error: null 
    });
  } catch (err) {
    res.status(500).render('error', { message: err.message });
  }
};

// PUT /orders/:id — update order (admin/employee only)
exports.update = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).render('error', { message: 'Order not found' });
    }
    
    const { status, productIds, quantities } = req.body;
    const updateData = {};
    
    // Update status if provided
    if (status) {
      updateData.status = status;
    }
    
    // If products were updated, recalculate totals
    if (productIds) {
      const productIdArray = Array.isArray(productIds) ? productIds : [productIds];
      const quantityArray = Array.isArray(quantities) ? quantities : [quantities];
      
      const orderProducts = [];
      let totalAmount = 0;
      
      for (let i = 0; i < productIdArray.length; i++) {
        const productId = productIdArray[i];
        const quantity = parseInt(quantityArray[i]);
        if (!productId || !quantity || quantity < 1) continue;
        
        const product = await Product.findById(productId);
        if (!product) continue;
        
        orderProducts.push({ product: productId, quantity });
        totalAmount += product.price * quantity;
      }
      
      if (orderProducts.length > 0) {
        updateData.products = orderProducts;
        updateData.totalAmount = totalAmount.toFixed(2);
      }
    }
    
    await Order.findByIdAndUpdate(req.params.id, updateData, { runValidators: true });
    res.redirect(`/orders/${req.params.id}`);
  } catch (err) {
    res.status(400).render('error', { message: err.message });
  }
};

// POST /orders/:id/status — quick status update (admin/employee only)
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending','completed', 'cancelled'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).render('error', { message: 'Invalid status' });
    }
    
    await Order.findByIdAndUpdate(req.params.id, { status }, { runValidators: true });
    res.redirect(`/orders/${req.params.id}`);
  } catch (err) {
    res.status(500).render('error', { message: err.message });
  }
};

// DELETE /orders/:id — delete order (admin only)
exports.delete = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).render('error', { message: 'Order not found' });
    }
    
    await Order.findByIdAndDelete(req.params.id);
    res.redirect('/orders');
  } catch (err) {
    res.status(500).render('error', { message: err.message });
  }
};