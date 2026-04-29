const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController.js');
const orderController = require('../controllers/orderController.js');


router.get('/', customerController.getAllCustomers);
router.get('/:id/orders', orderController.getCustomerOrders);
router.get('/:id', customerController.getCustomerById);
router.post('/new', customerController.newCustomerForm);
router.post('/new', customerController.createCustomer);
router.put('/edit/:id', customerController.updateCustomer);
router.put('/edit/:id', customerController.editCustomerForm);
router.delete('/delete/:id', customerController.deleteCustomer);

module.exports = router;

