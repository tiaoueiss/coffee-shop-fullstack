const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController.js');

router.get('/', categoryController.getAllCategories);
router.get('/:id/products', categoryController.getCategoryProducts);
router.get('/:id', categoryController.getCategoryById);
router.post('/new', categoryController.newCategoryForm);
router.post('/new', categoryController.createCategory);
router.put('/edit/:id', categoryController.updateCategory);
router.put('/edit/:id', categoryController.editItemForm);
router.delete('/delete/:id', categoryController.deleteCategory);

module.exports = router;

