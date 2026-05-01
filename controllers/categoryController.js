const Category = require('../models/Category');

// GET /categories
exports.index = async (req, res) => {
  try {
    const categories = await Category.find();
    res.render('categories/index', { categories, user: req.user });
  } catch (err) {
    res.status(500).render('error', { message: err.message });
  }
};

// GET /categories/:id
exports.show = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).render('error', { message: 'Category not found' });
    res.render('categories/show', { category, user: req.user });
  } catch (err) {
    res.status(500).render('error', { message: err.message });
  }
};

// GET /categories/new
exports.newForm = (req, res) => {
  res.render('categories/new', { user: req.user, error: null });
};

// POST /categories
exports.create = async (req, res) => {
  try {
    const { name, description, image } = req.body;
    await Category.create({ name, description, image: image || `${name}.png` });
    res.redirect('/categories');
  } catch (err) {
    res.status(400).render('categories/new', { user: req.user, error: err.message });
  }
};

// GET /categories/:id/edit
exports.editForm = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).render('error', { message: 'Category not found' });
    res.render('categories/edit', { category, user: req.user, error: null });
  } catch (err) {
    res.status(500).render('error', { message: err.message });
  }
};

// PUT /categories/:id
exports.update = async (req, res) => {
  try {
    const { name, description, image } = req.body;
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name, description, image },
      { new: true, runValidators: true }
    );
    if (!category) return res.status(404).render('error', { message: 'Category not found' });
    res.redirect(`/categories/${req.params.id}`);
  } catch (err) {
    const category = await Category.findById(req.params.id);
    res.status(400).render('categories/edit', { category, user: req.user, error: err.message });
  }
};

// DELETE /categories/:id
exports.delete = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.redirect('/categories');
  } catch (err) {
    res.status(500).render('error', { message: err.message });
  }
};
