// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const { placeOrder ,buyNowOrder,getBuyNowItems,getTempOrder,getOrderSummary,deleteOrderItem } = require('../controllers/ordercontroller');
const verifyToken = require('../middleware/auth');

router.post('/place', verifyToken, placeOrder);
router.get('/buynow-items', verifyToken, getBuyNowItems);
router.get('/temp', verifyToken, getTempOrder);
router.get('/summary', verifyToken, getOrderSummary);
router.delete('/delete/:source/:productID', verifyToken, deleteOrderItem);



router.post('/buynow', verifyToken, buyNowOrder);

module.exports = router;
