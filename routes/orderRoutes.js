const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.get('/', orderController.index);
router.get('/new', orderController.newForm);
router.get('/:id/edit', orderController.editForm);
router.get('/:id', orderController.show);
router.post('/', orderController.create);
router.put('/:id', orderController.update);
router.delete('/:id', orderController.delete);

module.exports = router;
