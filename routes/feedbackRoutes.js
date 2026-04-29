const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');
const { requireAuth, requireRole } = require('../middleware/authMiddleware');

router.get('/', requireAuth, feedbackController.index);
router.get('/new', requireAuth, feedbackController.newForm);
router.get('/:id/edit', requireAuth, feedbackController.editForm);
router.get('/:id', requireAuth, feedbackController.show);
router.post('/', requireAuth, feedbackController.create);
router.put('/:id', requireAuth, feedbackController.update);
router.delete('/:id', requireAuth, requireRole('admin'), feedbackController.delete);

module.exports = router;
