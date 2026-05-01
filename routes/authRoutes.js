const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { attachUser } = require('../middleware/authMiddleware');

// we pass attach user because these pages need to know wether user is already logged in
router.get('/', attachUser, (req, res) => {
  if (req.user) return res.redirect('/dashboard');
  res.redirect('/login');
});

router.get('/register', attachUser, authController.showRegisterForm);
router.post('/register', authController.register);
router.get('/login', attachUser, authController.showLoginForm);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

module.exports = router;
