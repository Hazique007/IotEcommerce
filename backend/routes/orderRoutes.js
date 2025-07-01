const express = require('express');
const router = express.Router();
const {
  placeOrder,
  buyNowOrder,
  getBuyNowItems,
  getTempOrder,
  getOrderSummary,
  deleteOrderItem,
  getUserOrdersWithDateFilter,
  getUserOrders,
  getAllOrdersForAdminPaginated,getOrdersOverview
} = require('../controllers/ordercontroller');
const verifyToken = require('../middleware/auth');
// const isAdmin = require('../middleware/isAdmin'); // optional if using role-based access

// ✅ User Routes
router.post('/place', verifyToken, placeOrder);
router.post('/buynow', verifyToken, buyNowOrder);
router.get('/buynow-items', verifyToken, getBuyNowItems);
router.get('/temp', verifyToken, getTempOrder);
router.get('/summary', verifyToken, getOrderSummary);
router.get('/user-orders', verifyToken, getUserOrders);
router.get('/user-history', verifyToken, getUserOrdersWithDateFilter);
router.delete('/delete/:source/:productID', verifyToken, deleteOrderItem);
router.get('/overview', getOrdersOverview);
// ✅ Admin Route to get all orders with pagination + email search
router.get('/admin-orders',  getAllOrdersForAdminPaginated);

// Optionally: add `isAdmin` middleware to secure this route

module.exports = router;
