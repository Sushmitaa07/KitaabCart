// controllers/orderController.js
const { createOrder, addOrderItem } = require('../models/orderModel');
const db = require('../db');

async function placeOrder(req, res) {
  const userId = req.user.id;
  const { cartItems } = req.body;

  if (!cartItems || !cartItems.length) {
    return res.status(400).json({ message: 'Cart items are required' });
  }

  try {
    // Calculate total price
    const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Create order
    const order = await createOrder(userId, totalPrice);

    // Add order items
    for (const item of cartItems) {
      await addOrderItem(order.id, item.bookId, item.quantity, item.price);
    }

    res.status(201).json({ message: 'Order placed successfully', orderId: order.id });
  } catch (err) {
    res.status(500).json({ message: 'Failed to place order', error: err.message });
  }
}

async function getUserOrders(req, res) {
  try {
    const userId = req.user.id;
    console.log(`Fetching orders for user ID: ${userId}`);
    
    // Get all orders for the user, ordered by created_at DESC
    const ordersResult = await db.query(`
      SELECT o.id, o.created_at, o.total_price, o.status
      FROM orders o
      WHERE o.user_id = $1
      ORDER BY o.created_at DESC
    `, [userId]);
    
    const orders = ordersResult.rows;
    console.log(`Found ${orders.length} orders for user ID: ${userId}`);
    
    // Get order items for each order
    for (const order of orders) {
      const itemsResult = await db.query(`
        SELECT oi.book_id, oi.quantity, oi.price, b.title as book_title, b.author, b.image_url
        FROM order_items oi
        JOIN books b ON oi.book_id = b.id
        WHERE oi.order_id = $1
      `, [order.id]);
      
      order.items = itemsResult.rows;
    }
    
    res.json(orders);
  } catch (err) {
    console.error('Error fetching user orders:', err);
    res.status(500).json({ message: 'Failed to fetch orders', error: err.message });
  }
}

async function getAllOrders(req, res) {
  try {
    // Get all orders with user information, ordered by created_at DESC
    const ordersResult = await db.query(`
      SELECT o.id, o.created_at, o.total_price, o.status, 
             o.user_id, u.name as user_name, u.email as user_email
      FROM orders o
      JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
    `);
    
    const orders = ordersResult.rows;
    console.log(`Found ${orders.length} orders in total`);
    
    // Get order items for each order
    for (const order of orders) {
      const itemsResult = await db.query(`
        SELECT oi.book_id, oi.quantity, oi.price, b.title as book_title
        FROM order_items oi
        JOIN books b ON oi.book_id = b.id
        WHERE oi.order_id = $1
      `, [order.id]);
      
      order.items = itemsResult.rows;
    }
    
    res.json(orders);
  } catch (err) {
    console.error('Error fetching all orders:', err);
    res.status(500).json({ message: 'Failed to fetch orders', error: err.message });
  }
}

async function updateOrderStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }
    
    // Update order status
    const result = await db.query(`
      UPDATE orders
      SET status = $1
      WHERE id = $2
      RETURNING *
    `, [status, id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json({ message: 'Order status updated successfully', order: result.rows[0] });
  } catch (err) {
    console.error('Error updating order status:', err);
    res.status(500).json({ message: 'Failed to update order status', error: err.message });
  }
}

module.exports = {
  placeOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus
};