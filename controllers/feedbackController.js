const Feedback = require('../models/Feedback');

// GET /feedback
exports.index = async (req, res) => {
  try {
    const filter = req.user.role === 'customer' ? { email: req.user.email } : {};
    const feedbacks = await Feedback.find(filter).sort({ createdAt: -1 });
    res.render('feedback/index', { feedbacks, user: req.user });
  } catch (err) {
    res.status(500).render('error', { message: err.message });
  }
};

// GET /feedback/:id
exports.show = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) return res.status(404).render('error', { message: 'Feedback not found' });

    if (req.user.role === 'customer' && feedback.email !== req.user.email) {
      return res.status(403).render('error', { message: 'Access denied' });
    }

    res.render('feedback/show', { feedback, user: req.user });
  } catch (err) {
    res.status(500).render('error', { message: err.message });
  }
};

// GET /feedback/new
exports.newForm = (req, res) => {
  res.render('feedback/new', { user: req.user, error: null });
};

// POST /feedback
exports.create = async (req, res) => {
  try {
    const { customerName, email, rating, comment } = req.body;
    await Feedback.create({
      user: req.user.id,
      customerName: customerName || req.user.name,
      email: email || req.user.email,
      rating,
      comment
    });
    res.redirect('/feedback');
  } catch (err) {
    res.status(400).render('feedback/new', { user: req.user, error: err.message });
  }
};

// GET /feedback/:id/edit
exports.editForm = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) return res.status(404).render('error', { message: 'Feedback not found' });

    if (req.user.role === 'customer' && feedback.email !== req.user.email) {
      return res.status(403).render('error', { message: 'You can only edit your own feedback' });
    }

    res.render('feedback/edit', { feedback, user: req.user, error: null });
  } catch (err) {
    res.status(500).render('error', { message: err.message });
  }
};

// PUT /feedback/:id
exports.update = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) return res.status(404).render('error', { message: 'Feedback not found' });

    if (req.user.role === 'customer' && feedback.email !== req.user.email) {
      return res.status(403).render('error', { message: 'You can only edit your own feedback' });
    }

    await Feedback.findByIdAndUpdate(
      req.params.id,
      { rating: req.body.rating, comment: req.body.comment },
      { runValidators: true }
    );
    res.redirect(`/feedback/${req.params.id}`);
  } catch (err) {
    const feedback = await Feedback.findById(req.params.id);
    res.status(400).render('feedback/edit', { feedback, user: req.user, error: err.message });
  }
};

// DELETE /feedback/:id
exports.delete = async (req, res) => {
  try {
    await Feedback.findByIdAndDelete(req.params.id);
    res.redirect('/feedback');
  } catch (err) {
    res.status(500).render('error', { message: err.message });
  }
};
