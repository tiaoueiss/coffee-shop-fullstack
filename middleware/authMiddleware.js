const jwt = require('jsonwebtoken');

// Strict — blocks unauthenticated requests
exports.requireAuth = (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) return res.redirect('/login');
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    res.locals.user = req.user;
    next();
  } catch {
    res.clearCookie('token');
    res.redirect('/login');
  }
};

// Soft — attaches user if logged in, never blocks
exports.attachUser = (req, res, next) => {
  const token = req.cookies?.token;
  if (token) {
    try {
      req.user = jwt.verify(token, process.env.JWT_SECRET);
      res.locals.user = req.user;
    } catch {
      res.clearCookie('token');
    }
  }
  next();
};

// Role gate — call after requireAuth
exports.requireRole = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).render('error', { message: 'Access denied' });
  }
  next();
};
