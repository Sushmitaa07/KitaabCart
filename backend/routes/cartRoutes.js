const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const {
  getUserCart,
  addToCart,
  removeFromCart
} = require('../controllers/cartController');

router.get('/', verifyToken, getUserCart);
router.post('/', verifyToken, addToCart);
router.delete('/:id', verifyToken, removeFromCart);

module.exports = router;