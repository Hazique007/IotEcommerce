const express = require('express');
const router = express.Router();
const { postcartorder, getcartorder ,updateCartItemQty } = require('../controllers/cartcontroller');
const verifyToken = require('../middleware/auth'); // <- import

router.post('/add', verifyToken, postcartorder);
router.get('/', verifyToken, getcartorder); // optional: secure this too
router.put('/update', verifyToken, updateCartItemQty);

module.exports = router;
