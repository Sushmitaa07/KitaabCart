// models/orderModel.js
const db = require('../db');

// Create an order record
async function createOrder(userId, totalPrice) {
  const result = await db.query(
    `INSERT INTO orders (user_id, total_price)
     VALUES ($1, $2) RETURNING *`,
    [userId, totalPrice]
  );
  return result.rows[0];
}

// Add order items
async function addOrderItem(orderId, bookId, quantity, price) {
  await db.query(
    `INSERT INTO order_items (order_id, book_id, quantity, price)
     VALUES ($1, $2, $3, $4)`,
    [orderId, bookId, quantity, price]
  );
}

// Get cart items with book price
async function getCartItemsWithDetails(userId) {
  const result = await db.query(`
    SELECT ci.book_id, ci.quantity, b.price
    FROM cart_items ci
    JOIN books b ON ci.book_id = b.id
    WHERE ci.user_id = $1
  `, [userId]);
  return result.rows;
}

// Clear user's cart after order
async function clearCart(userId) {
  await db.query(`DELETE FROM cart_items WHERE user_id = $1`, [userId]);
}

module.exports = {
  createOrder,
  addOrderItem,
  getCartItemsWithDetails,
  clearCart,
};