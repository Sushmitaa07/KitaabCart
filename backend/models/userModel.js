const db = require('../db');

// 🔍 Find user by email (used in login)
async function findUserByEmail(email) {
  const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0];
}

// ➕ Create a new user (used in signup)
async function createUser(name, email, hashedPassword, role) {
  const result = await db.query(
    `INSERT INTO users (name, email, password, role)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [name, email, hashedPassword, role]
  );
  return result.rows[0];
}

// 📋 Get all users with role = 'buyer' (for admin)
async function fetchAllUsers() {
  const result = await db.query(
    `SELECT id, name, email, role, created_at
     FROM users
     WHERE role = 'buyer'
     ORDER BY id`
  );
  return result.rows;
}

// ✏️ Update user role (admin can promote to seller/admin)
async function changeUserRole(userId, newRole) {
  const result = await db.query(
    `UPDATE users SET role = $1 WHERE id = $2
     RETURNING id, name, email, role`,
    [newRole, userId]
  );
  return result.rows[0];
}

// ❌ Delete a user
async function removeUser(userId) {
  await db.query(`DELETE FROM users WHERE id = $1`, [userId]);
}

// ✏️ Update user information (admin can edit name and email)
async function updateUserInfo(userId, name, email) {
  const result = await db.query(
    `UPDATE users SET name = $1, email = $2 WHERE id = $3
     RETURNING id, name, email, role`,
    [name, email, userId]
  );
  return result.rows[0];
}

module.exports = {
  findUserByEmail,
  createUser,
  fetchAllUsers,
  changeUserRole,
  removeUser,
  updateUserInfo
};