const express = require('express');
const router = express.Router();
const {
  addProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  getProductById,
  getAllWithoutPagination
} = require('../controllers/productcontroller');

// Add Product
router.post('/add', addProduct);

// Get All Products (paginated)
router.get('/getallproducts', getAllProducts);

// Get All Products (no pagination)
router.get('/getall', getAllWithoutPagination);

// Update Product
router.put('/:id', updateProduct);

// Delete Product
router.delete('/:id', deleteProduct);

// ✅ This should be the LAST route
router.get('/:id', getProductById);

module.exports = router;
