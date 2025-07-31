// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const { placeOrder, getUserOrders } = require('../controllers/orderController');

// POST /api/orders - place a new order (buyer only)
router.post('/', verifyToken, placeOrder);

// GET /api/orders/user - get user's orders
router.get('/user', verifyToken, getUserOrders);

// GET /api/orders/latest - get user's latest order
router.get('/latest', verifyToken, async (req, res) => {
  try {
    const db = require('../db');
    const userId = req.user.id;
    
    // Get the latest order
    const result = await db.query(`
      SELECT o.id, o.created_at, o.total_price, o.status
      FROM orders o
      WHERE o.user_id = $1
      ORDER BY o.created_at DESC
      LIMIT 1
    `, [userId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No orders found' });
    }
    
    const order = result.rows[0];
    
    // Get order items
    const itemsResult = await db.query(`
      SELECT oi.book_id, oi.quantity, oi.price, b.title as book_title
      FROM order_items oi
      JOIN books b ON oi.book_id = b.id
      WHERE oi.order_id = $1
    `, [order.id]);
    
    order.items = itemsResult.rows;
    
    res.json(order);
  } catch (err) {
    console.error('Error fetching latest order:', err);
    res.status(500).json({ message: 'Failed to fetch latest order', error: err.message });
  }
});

module.exports = router;