const express = require('express');
const router = express.Router();
const {
  addInventoryMovement,
  getAllInventoryMovements,
  getInventoryMovementById,
  deleteInventoryMovement,getLowStockProducts,getInventorySummary,getProductStockDistribution,getPopularProducts,sendLowStockEmail,
  getMovementsByProduct,getFullProductHistory
} = require('../controllers/inventoryController');

router.post('/inventory-movement', addInventoryMovement);
router.get('/inventory-movement', getAllInventoryMovements);
router.get('/inventory-movement/:id', getInventoryMovementById);
router.delete('/inventory-movement/:id', deleteInventoryMovement);
router.get('/low-stock', getLowStockProducts);
router.get('/summary', getInventorySummary);
router.get('/stock-distribution', getProductStockDistribution);
router.get('/popular-products', getPopularProducts);
router.post('/notify-low-stock', sendLowStockEmail);
router.get('/product-history/:productId', getMovementsByProduct);
router.get('full-history/:productId', getFullProductHistory);

module.exports = router;
