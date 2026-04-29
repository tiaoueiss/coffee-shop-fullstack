const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { requireAuth, requireRole } = require('../middleware/authMiddleware');

router.get('/', requireAuth, requireRole('admin', 'employee'), userController.index);
router.get('/new', requireAuth, requireRole('admin'), userController.newForm);
router.post('/', requireAuth, requireRole('admin'), userController.create);
router.get('/:id/edit', requireAuth, userController.editForm);
router.get('/:id/orders', requireAuth, userController.showOrders);
router.get('/:id', requireAuth, userController.show);
router.put('/:id', requireAuth, userController.update);
router.delete('/:id', requireAuth, requireRole('admin'), userController.delete);

module.exports = router;
