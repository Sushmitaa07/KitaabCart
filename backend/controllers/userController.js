const {
  fetchAllUsers,
  changeUserRole,
  removeUser,
  updateUserInfo
} = require('../models/userModel');

// 📋 Admin: Get all users (buyers only)
async function getAllUsers(req, res) {
  try {
    const users = await fetchAllUsers();
    res.json(users);
  } catch (err) {
    console.error("❌ Failed to fetch users:", err.message);
    res.status(500).json({ message: 'Failed to fetch users', error: err.message });
  }
}

// ✏️ Admin: Update a user's role
async function updateUserRole(req, res) {
  const { id } = req.params;
  const { role } = req.body;

  try {
    const updatedUser = await changeUserRole(id, role);
    res.json(updatedUser);
  } catch (err) {
    console.error("❌ Failed to update user role:", err.message);
    res.status(500).json({ message: 'Failed to update user role', error: err.message });
  }
}

// ❌ Admin: Delete a user
async function deleteUser(req, res) {
  const { id } = req.params;

  try {
    await removeUser(id);
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error("❌ Failed to delete user:", err.message);
    res.status(500).json({ message: 'Failed to delete user', error: err.message });
  }
}

// 📝 Admin: Update a user's information
async function updateUser(req, res) {
  const { id } = req.params;
  const { name, email } = req.body;

  try {
    const updatedUser = await updateUserInfo(id, name, email);
    res.json(updatedUser);
  } catch (err) {
    console.error("❌ Failed to update user information:", err.message);
    res.status(500).json({ message: 'Failed to update user information', error: err.message });
  }
}

module.exports = {
  getAllUsers,
  updateUserRole,
  deleteUser,
  updateUser
};