const {
  createBook,
  updateBook,
  deleteBook,
  getAllBooks
} = require('../models/bookModel');

// Add book
async function addBook(req, res) {
  try {
    const newBook = await createBook(req.body);
    res.status(201).json(newBook);
  } catch (err) {
    res.status(500).json({ message: 'Failed to add book', error: err.message });
  }
}

// Update book
async function editBook(req, res) {
  try {
    const bookId = req.params.id;
    const updated = await updateBook(bookId, req.body);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update book', error: err.message });
  }
}

// Delete book
async function removeBook(req, res) {
  try {
    await deleteBook(req.params.id);
    res.json({ message: 'Book deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete book', error: err.message });
  }
}

// Get all books
async function fetchBooks(req, res) {
  try {
    const books = await getAllBooks();
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch books', error: err.message });
  }
}

module.exports = {
  addBook,
  editBook,
  removeBook,
  fetchBooks
};