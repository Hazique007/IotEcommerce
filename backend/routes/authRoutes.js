const express = require('express');
const router = express.Router();
// const adminOnly = require('../middleware/adminonly');
const { signup, login, getAllUsers, getUserById,updateUser,deleteUser } = require('../controllers/authController');

router.post('/signup', signup);
router.post('/login', login);
router.get('/users', getAllUsers);        // admin can use this
router.get('/user/:id', getUserById);     // get one user by ID
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

module.exports = router;
