const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin } = require('../middleware/auth');

const {
  addBook,
  editBook,
  removeBook,
  fetchBooks
} = require('../controllers/bookController');

// 🧑‍💼 Admin-only book routes
router.post('/books', verifyToken, isAdmin, addBook);
router.put('/books/:id', verifyToken, isAdmin, editBook);
router.delete('/books/:id', verifyToken, isAdmin, removeBook);
router.get('/books', verifyToken, isAdmin, fetchBooks);

const {
  getAllUsers,
  updateUserRole,
  deleteUser,
  updateUser
} = require('../controllers/userController');

router.get('/users', verifyToken, isAdmin, getAllUsers);
router.patch('/users/:id', verifyToken, isAdmin, updateUserRole);
router.put('/users/:id', verifyToken, isAdmin, updateUser);
router.delete('/users/:id', verifyToken, isAdmin, deleteUser);

// Admin order routes
const {
  getAllOrders,
  updateOrderStatus
} = require('../controllers/orderController');

router.get('/orders', verifyToken, isAdmin, getAllOrders);
router.patch('/orders/:id', verifyToken, isAdmin, updateOrderStatus);

// Add more admin routes later (orders, users, reviews, etc.)

module.exports = router;