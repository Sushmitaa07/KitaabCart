import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { bookService, cartService } from '../services/api';
import Notification from '../components/Notification';

const BookCatalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [categories, setCategories] = useState([]);
  const [notification, setNotification] = useState(null);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      // Use the public books endpoint
      const response = await bookService.getPublicBooks();
      setBooks(response.data);
      
      // Extract unique categories
      const uniqueCategories = [...new Set(response.data.map(book => book.category))];
      setCategories(uniqueCategories);
      
      setError(null);
    } catch (err) {
      console.error('Error fetching books:', err);
      setError('Failed to load books. Please try again later.');
      setNotification({
        message: 'Could not load books. Please try again.',
        type: 'error'
      });
      setBooks([]);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // Handle URL parameters for category filtering
  useEffect(() => {
    const categoryFromUrl = searchParams.get('category');
    if (categoryFromUrl) {
      setCategoryFilter(categoryFromUrl);
    }
  }, [searchParams]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (e) => {
    const newCategory = e.target.value;
    setCategoryFilter(newCategory);
    
    // Update URL parameters
    if (newCategory === 'all') {
      setSearchParams({});
    } else {
      setSearchParams({ category: newCategory });
    }
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const addToCart = async (bookId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        // Redirect to login if not authenticated
        window.location.href = '/login';
        return;
      }
      
      await cartService.addToCart(bookId, 1);
      setNotification({
        message: 'Book added to cart successfully!',
        type: 'success'
      });
    } catch (err) {
      console.error('Error adding to cart:', err);
      setNotification({
        message: 'Failed to add book to cart. Please try again.',
        type: 'error'
      });
    }
  };

  // Filter books based on search term and category
  let filteredBooks = books.filter(book => {
    const matchesSearch = 
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || book.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  // Sort filtered books
  switch (sortBy) {
    case 'newest':
      filteredBooks.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      break;
    case 'price-low':
      filteredBooks.sort((a, b) => a.price - b.price);
      break;
    case 'price-high':
      filteredBooks.sort((a, b) => b.price - a.price);
      break;
    case 'title-az':
      filteredBooks.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case 'title-za':
      filteredBooks.sort((a, b) => b.title.localeCompare(a.title));
      break;
    default:
      break;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {notification && (
        <Notification 
          message={notification.message} 
          type={notification.type} 
          onClose={() => setNotification(null)} 
        />
      )}
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Book Catalog</h1>
      </div>

      {/* Filter and Search Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Search Books</label>
            <input
              id="search"
              type="text"
              placeholder="Search by title, author, or description..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              id="category"
              value={categoryFilter}
              onChange={handleCategoryChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
            <select
              id="sort"
              value={sortBy}
              onChange={handleSortChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              <option value="newest">Newest Arrivals</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="title-az">Title: A to Z</option>
              <option value="title-za">Title: Z to A</option>
            </select>
          </div>
        </div>
      </div>

      {/* Books Grid */}
      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-gray-800"></div>
          <p className="mt-4 text-xl text-gray-600">Loading books...</p>
        </div>
      ) : error ? (
        <div className="text-center py-16 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-medium text-gray-700 mb-4">Error loading books</h2>
          <p className="text-gray-500 mb-4">{error}</p>
          <button 
            onClick={fetchBooks} 
            className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : filteredBooks.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-medium text-gray-700 mb-4">No books found</h2>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredBooks.map(book => (
            <div key={book.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <Link to={`/books/${book.id}`} className="block">
                <div className="h-64 overflow-hidden">
                  <img 
                    src={book.image_url || 'https://via.placeholder.com/500x700?text=No+Image'} 
                    alt={book.title} 
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>                  <div className="p-4">
                  <h3 className="font-bold text-gray-800 text-lg mb-1 line-clamp-2">{book.title}</h3>
                  <p className="text-gray-600 text-sm mb-2">{book.author}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-800 font-bold">Rs. {parseFloat(book.price || 0).toFixed(2)}</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${book.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {book.stock > 0 ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>
                </div>
              </Link>
              <div className="px-4 pb-4">
                <button 
                  onClick={() => addToCart(book.id)} 
                  className="w-full bg-gray-800 hover:bg-gray-900 text-white py-2 rounded-lg transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  disabled={book.stock <= 0}
                >
                  {book.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookCatalog;
