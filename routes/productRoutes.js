const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController.js');


router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.post('/new', productController.newProductForm);
router.post('/new', productController.createProduct);
router.put('/edit/:id', productController.updateProduct);
router.put('/edit/:id', productController.editProductForm);
router.delete('/delete/:id', productController.deleteProduct);

module.exports = router;

