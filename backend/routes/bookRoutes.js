// routes/bookRoutes.js
const express = require('express');
const router = express.Router();
const { fetchBooks } = require('../controllers/bookController');

// GET /api/books - get all books (public endpoint)
router.get('/', fetchBooks);

// GET /api/books/:id - get book by id (public endpoint)
router.get('/:id', async (req, res) => {
  try {
    const { getAllBooks } = require('../models/bookModel');
    const books = await getAllBooks();
    const book = books.find(b => b.id === parseInt(req.params.id));
    
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch book', error: err.message });
  }
});

module.exports = router;
