const db = require('../db');

// Get cart items for a user (with book details)
async function getCartItems(userId) {
  const result = await db.query(`
    SELECT ci.id, ci.quantity, b.id AS book_id, b.title, b.price, b.image_url
    FROM cart_items ci
    JOIN books b ON ci.book_id = b.id
    WHERE ci.user_id = $1
  `, [userId]);
  return result.rows;
}

// Add or update cart item
async function addOrUpdateCartItem(userId, bookId, quantity) {
  // Try updating first
  const updateResult = await db.query(`
    UPDATE cart_items SET quantity = quantity + $3
    WHERE user_id = $1 AND book_id = $2
    RETURNING *
  `, [userId, bookId, quantity]);

  if (updateResult.rowCount === 0) {
    // Insert new if no update happened
    const insertResult = await db.query(`
      INSERT INTO cart_items (user_id, book_id, quantity)
      VALUES ($1, $2, $3) RETURNING *
    `, [userId, bookId, quantity]);
    return insertResult.rows[0];
  }
  return updateResult.rows[0];
}

// Remove cart item
async function removeCartItem(cartItemId) {
  await db.query(`DELETE FROM cart_items WHERE id = $1`, [cartItemId]);
}

// Clear all cart items for user (after checkout)
async function clearCart(userId) {
  await db.query(`DELETE FROM cart_items WHERE user_id = $1`, [userId]);
}

module.exports = {
  getCartItems,
  addOrUpdateCartItem,
  removeCartItem,
  clearCart
};