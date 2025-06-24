const express = require('express');
const router = express.Router();
const {
  addProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  getProductById
} = require('../controllers/productcontroller');

// Add Product
router.post('/add', addProduct);

// Get All Products
router.get('/getallproducts', getAllProducts);

//get a specific product
router.get('/:id',getProductById )

// Update Product
router.put('/:id', updateProduct);

// Delete Product
router.delete('/:id', deleteProduct);

module.exports = router;
