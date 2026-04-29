const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { requireAuth, requireRole } = require('../middleware/authMiddleware');

router.get('/', requireAuth, categoryController.index);
router.get('/new', requireAuth, requireRole('admin'), categoryController.newForm);
router.get('/:id/edit', requireAuth, requireRole('admin'), categoryController.editForm);
router.get('/:id', requireAuth, categoryController.show);
router.post('/', requireAuth, requireRole('admin'), categoryController.create);
router.put('/:id', requireAuth, requireRole('admin'), categoryController.update);
router.delete('/:id', requireAuth, requireRole('admin'), categoryController.delete);

module.exports = router;
