const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController.js');

router.get('/', orderController.getAllOrders);
router.get('/:id', orderController.getOrderById);
router.post('/new', orderController.newOrderForm);
router.post('/new', orderController.createOrder);
router.put('/edit/:id', orderController.updateOrder);
router.put('/edit/:id', orderController.editOrderForm);
router.delete('/delete/:id', orderController.deleteOrder);

module.exports = router;

