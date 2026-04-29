const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/', userController.index);
router.get('/new', userController.newForm);
router.post('/', userController.create);
router.get('/:id/edit', userController.editForm);
router.get('/:id/orders', userController.showOrders);
router.get('/:id', userController.show);
router.put('/:id', userController.update);
router.delete('/:id', userController.delete);

module.exports = router;
