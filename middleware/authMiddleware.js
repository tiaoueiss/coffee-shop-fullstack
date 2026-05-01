const jwt = require('jsonwebtoken');

// checks if user is logged in, if not redirects to login page
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

// attaches user to req and res.locals if token is valid, otherwise clears cookie
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

// checks if user has one of the required roles, if not shows access denied error
exports.requireRole = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).render('error', { message: 'Access denied' });
  }
  next();
};
