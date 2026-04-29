const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { requireAuth, requireRole } = require('../middleware/authMiddleware');

router.get('/', requireAuth, orderController.index);
router.get('/new', requireAuth, orderController.newForm);
router.get('/:id/edit', requireAuth, requireRole('admin', 'employee'), orderController.editForm);
router.get('/:id', requireAuth, orderController.show);
router.post('/', requireAuth, orderController.create);
router.put('/:id', requireAuth, requireRole('admin', 'employee'), orderController.update);
router.delete('/:id', requireAuth, requireRole('admin'), orderController.delete);

module.exports = router;
