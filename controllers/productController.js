// controllers/productController.js
const Product = require('../models/Product');
const Category = require('../models/Category');
const User = require('../models/User');

// GET /products — list all products
exports.index = async (req, res) => {
  try {
    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.available === 'true') filter.isAvailable = true;

    const queries = [
      Product.find(filter).populate('category', 'name'),
      Category.find()
    ];

    if (req.user && req.user.role !== 'customer') {
      queries.push(User.find({ role: 'customer' }).select('name email'));
    }

    const [products, categories, customers = []] = await Promise.all(queries);

    res.render('products/index', { products, categories, customers, user: req.user, query: req.query.category || '' });
  } catch (err) {
    res.status(500).render('error', { message: err.message });
  }
};

// GET /products/:id — show one product
exports.show = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name');

    if (!product) {
      return res.status(404).render('error', { message: 'Product not found' });
    }

    res.render('products/show', { product, user: req.user });
  } catch (err) {
    res.status(500).render('error', { message: err.message });
  }
};

// GET /products/new — show create form (admin only)
exports.newForm = async (req, res) => {
  try {
    const categories = await Category.find();
    res.render('products/new', { categories, user: req.user, error: null });
  } catch (err) {
    res.status(500).render('error', { message: err.message });
  }
};

// POST /products — create product (admin only)
exports.create = async (req, res) => {
  try {
    const { name, description, price, isAvailable, category } = req.body;

    await Product.create({
      name,
      description,
      price,
      isAvailable: isAvailable === 'on' || isAvailable === 'true',
      category
    });

    res.redirect('/products');
  } catch (err) {
    const categories = await Category.find();
    res.status(400).render('products/new', {
      categories, user: req.user,
      error: err.message
    });
  }
};

// GET /products/:id/edit — show edit form (admin only)
exports.editForm = async (req, res) => {
  try {
    const [product, categories] = await Promise.all([
      Product.findById(req.params.id),
      Category.find()
    ]);

    if (!product) {
      return res.status(404).render('error', { message: 'Product not found' });
    }

    res.render('products/edit', { product, categories, user: req.user, error: null });
  } catch (err) {
    res.status(500).render('error', { message: err.message });
  }
};

// PUT /products/:id — update product (admin only)
exports.update = async (req, res) => {
  try {
    const { name, description, price, isAvailable, category, inventory } = req.body;

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        price,
        isAvailable: isAvailable === 'on' || isAvailable === 'true',
        category,
        ...(inventory !== undefined && { inventory: parseInt(inventory) })
      },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).render('error', { message: 'Product not found' });
    }

    res.redirect(`/products/${req.params.id}`);
  } catch (err) {
    const categories = await Category.find();
    const product = await Product.findById(req.params.id);
    res.status(400).render('products/edit', {
      product, categories, user: req.user,
      error: err.message
    });
  }
};

// GET /products/:id/restock — show restock form (admin only)
exports.restockForm = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).render('error', { message: 'Product not found' });
    }
    res.render('products/restock', { product, user: req.user, error: null });
  } catch (err) {
    res.status(500).render('error', { message: err.message });
  }
};

// POST /products/:id/restock — add stock (admin only)
exports.restock = async (req, res) => {
  try {
    const quantity = parseInt(req.body.quantity);
    if (!quantity || quantity < 1) {
      const product = await Product.findById(req.params.id);
      return res.status(400).render('products/restock', {
        product, user: req.user,
        error: 'Please enter a valid quantity greater than 0'
      });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $inc: { inventory: quantity },
        isAvailable: true
      },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).render('error', { message: 'Product not found' });
    }

    res.redirect(`/products/${req.params.id}`);
  } catch (err) {
    res.status(500).render('error', { message: err.message });
  }
};

// DELETE /products/:id — delete product (admin only)
exports.delete = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).render('error', { message: 'Product not found' });
    }

    res.redirect('/products');
  } catch (err) {
    res.status(500).render('error', { message: err.message });
  }
};
