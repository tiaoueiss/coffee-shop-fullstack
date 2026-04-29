const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');

// Helper: fetch data needed to render the new order form
const getNewFormData = async (role) => {
  const [products, customers] = await Promise.all([
    Product.find({ isAvailable: true }).populate('category'),
    role !== 'customer'
      ? User.find({ role: 'customer' }).select('name email')
      : Promise.resolve([])
  ]);
  return { products, customers };
};

// GET /orders
exports.index = async (req, res) => {
  try {
    const filter = req.user.role === 'customer' ? { customer: req.user.id } : {};
    const orders = await Order.find(filter)
      .populate('customer', 'name email')
      .populate('products.product')
      .sort({ orderDate: -1 });
    res.render('orders/index', { orders, user: req.user });
  } catch (err) {
    res.status(500).render('error', { message: err.message });
  }
};

// GET /orders/:id
exports.show = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customer', 'name email phone')
      .populate('products.product');

    if (!order) return res.status(404).render('error', { message: 'Order not found' });

    if (req.user.role === 'customer' && order.customer._id.toString() !== req.user.id) {
      return res.status(403).render('error', { message: 'You can only view your own orders' });
    }

    res.render('orders/show', { order, user: req.user });
  } catch (err) {
    res.status(500).render('error', { message: err.message });
  }
};

// GET /orders/new
exports.newForm = async (req, res) => {
  try {
    const { products, customers } = await getNewFormData(req.user.role);
    res.render('orders/new', { products, customers, user: req.user, error: null });
  } catch (err) {
    res.status(500).render('error', { message: err.message });
  }
};

// POST /orders
exports.create = async (req, res) => {
  const renderError = async (error) => {
    const { products, customers } = await getNewFormData(req.user.role);
    return res.status(400).render('orders/new', { products, customers, user: req.user, error });
  };

  try {
    const customerId = req.user.role === 'customer' ? req.user.id : req.body.customerId;
    if (!customerId) return renderError('Please select a customer');

    // Normalize to arrays — form sends a single string when only one item is selected
    const productIdArray = [].concat(req.body['productIds[]'] || req.body.productIds || []);
    const quantityArray = [].concat(req.body['quantities[]'] || req.body.quantities || []);

    // Fetch all selected products in one query
    const productDocs = await Product.find({ _id: { $in: productIdArray }, isAvailable: true });
    const productMap = Object.fromEntries(productDocs.map(p => [p._id.toString(), p]));

    const orderItems = [];
    let totalAmount = 0;

    for (let i = 0; i < productIdArray.length; i++) {
      const quantity = parseInt(quantityArray[i]);
      if (!quantity || quantity < 1) continue;

      const product = productMap[productIdArray[i]];
      if (!product) continue;

      if (product.inventory < quantity) {
        return renderError(`Not enough stock for "${product.name}" (available: ${product.inventory})`);
      }

      orderItems.push({ product: product._id, quantity });
      totalAmount += product.price * quantity;
    }

    if (orderItems.length === 0) return renderError('Please select at least one product');

    const newOrder = await Order.create({
      customer: customerId,
      products: orderItems,
      totalAmount: parseFloat(totalAmount.toFixed(2)),
      status: 'pending'
    });

    // Decrement inventory; mark unavailable if stock hits 0
    for (const item of orderItems) {
      const updated = await Product.findByIdAndUpdate(
        item.product,
        { $inc: { inventory: -item.quantity } },
        { new: true }
      );
      if (updated.inventory <= 0) {
        await Product.findByIdAndUpdate(item.product, { isAvailable: false });
      }
    }

    // 1 loyalty point per dollar spent
    await User.findByIdAndUpdate(customerId, { $inc: { loyaltyPoints: Math.floor(totalAmount) } });

    res.redirect(`/orders/${newOrder._id}`);
  } catch (err) {
    res.status(500).render('error', { message: err.message });
  }
};

// GET /orders/:id/edit
exports.editForm = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customer', 'name email')
      .populate('products.product');

    if (!order) return res.status(404).render('error', { message: 'Order not found' });

    res.render('orders/edit', { order, user: req.user, error: null });
  } catch (err) {
    res.status(500).render('error', { message: err.message });
  }
};

// PUT /orders/:id — status updates only
exports.update = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    );

    if (!order) return res.status(404).render('error', { message: 'Order not found' });

    res.redirect(`/orders/${req.params.id}`);
  } catch (err) {
    res.status(400).render('error', { message: err.message });
  }
};

// DELETE /orders/:id
exports.delete = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) return res.status(404).render('error', { message: 'Order not found' });

    res.redirect('/orders');
  } catch (err) {
    res.status(500).render('error', { message: err.message });
  }
};
