const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { attachUser } = require('../middleware/authMiddleware');

router.get('/register', attachUser, authController.showRegisterForm);
router.post('/register', authController.register);
router.get('/login', attachUser, authController.showLoginForm);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

module.exports = router;
