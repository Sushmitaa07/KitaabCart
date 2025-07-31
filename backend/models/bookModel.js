const db = require('../db');

// Create a book
async function createBook(book) {
  const { title, author, description, category, price, stock, image_url } = book;
  const result = await db.query(
    `INSERT INTO books (title, author, description, category, price, stock, image_url)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [title, author, description, category, price, stock, image_url]
  );
  return result.rows[0];
}

// Update book
async function updateBook(id, updates) {
  const { title, author, description, category, price, stock, image_url } = updates;
  const result = await db.query(
    `UPDATE books SET title=$1, author=$2, description=$3, category=$4,
     price=$5, stock=$6, image_url=$7 WHERE id=$8 RETURNING *`,
    [title, author, description, category, price, stock, image_url, id]
  );
  return result.rows[0];
}

// Delete book
async function deleteBook(id) {
  await db.query(`DELETE FROM books WHERE id = $1`, [id]);
}

// Get all books
async function getAllBooks() {
  const result = await db.query(`SELECT * FROM books ORDER BY created_at DESC`);
  return result.rows;
}

module.exports = {
  createBook,
  updateBook,
  deleteBook,
  getAllBooks
};