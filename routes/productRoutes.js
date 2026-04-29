const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { requireAuth, requireRole } = require('../middleware/authMiddleware');

router.get('/', requireAuth, productController.index);
router.get('/new', requireAuth, requireRole('admin'), productController.newForm);
router.get('/:id/edit', requireAuth, requireRole('admin'), productController.editForm);
router.get('/:id/restock', requireAuth, requireRole('admin'), productController.restockForm);
router.get('/:id', requireAuth, productController.show);
router.post('/', requireAuth, requireRole('admin'), productController.create);
router.post('/:id/restock', requireAuth, requireRole('admin'), productController.restock);
router.put('/:id', requireAuth, requireRole('admin'), productController.update);
router.delete('/:id', requireAuth, requireRole('admin'), productController.delete);

module.exports = router;
