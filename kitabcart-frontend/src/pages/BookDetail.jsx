import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { bookService, cartService } from '../services/api';

const BookDetail = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        // This endpoint should be public - no token required
        const response = await bookService.getBookById(id);
        setBook(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching book details:', err);
        setError('Failed to load book details. Please try again later.');
        
        // Mock data for demonstration
        setBook({
          id: parseInt(id),
          title: 'The Great Gatsby',
          author: 'F. Scott Fitzgerald',
          description: 'The Great Gatsby is a 1925 novel by American writer F. Scott Fitzgerald. Set in the Jazz Age on Long Island, near New York City, the novel depicts first-person narrator Nick Carraway\'s interactions with mysterious millionaire Jay Gatsby and Gatsby\'s obsession to reunite with his former lover, Daisy Buchanan.',
          category: 'Classic',
          price: 29.99,
          stock: 15,
          image_url: 'https://source.unsplash.com/random/500x700/?book,classic',
          created_at: '2023-01-15T00:00:00Z',
          pages: 180,
          publisher: 'Scribner',
          language: 'English',
          isbn: '9780743273565',
          published_date: '1925-04-10'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= (book?.stock || 0)) {
      setQuantity(value);
    }
  };

  const incrementQuantity = () => {
    if (quantity < (book?.stock || 0)) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const addToCart = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        // Redirect to login if not authenticated
        window.location.href = '/login';
        return;
      }
      
      await cartService.addToCart(book.id, quantity);
      
      alert('Book added to cart successfully!');
    } catch (err) {
      console.error('Error adding to cart:', err);
      alert('Failed to add book to cart. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-gray-800"></div>
        <p className="mt-4 text-xl text-gray-600">Loading book details...</p>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="bg-red-50 text-red-700 p-6 rounded-lg border border-red-200 text-center">
          <h2 className="text-2xl font-bold mb-2">Error</h2>
          <p>{error || 'Book not found'}</p>
          <Link to="/books" className="mt-4 inline-block px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900">
            Back to Books
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/books" className="text-gray-600 hover:text-gray-900">
          &larr; Back to Books
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="md:flex">
          {/* Left Column - Book Image */}
          <div className="md:w-1/3 p-6 flex justify-center">
            <img
              src={book.image_url || 'https://via.placeholder.com/500x700?text=No+Image'}
              alt={book.title}
              className="h-auto max-h-[500px] object-contain rounded-lg shadow-sm"
            />
          </div>

          {/* Right Column - Book Details */}
          <div className="md:w-2/3 p-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{book.title}</h1>
              <p className="text-xl text-gray-600 mb-4">by {book.author}</p>
              
              <div className="flex items-center mb-6">
                <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                  {book.category}
                </span>
                <span className={`ml-4 px-3 py-1 rounded-full text-sm font-medium ${
                  book.stock > 10 
                    ? 'bg-green-100 text-green-800' 
                    : book.stock > 0 
                    ? 'bg-yellow-100 text-yellow-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {book.stock > 10 
                    ? 'In Stock' 
                    : book.stock > 0 
                    ? `Only ${book.stock} left` 
                    : 'Out of Stock'}
                </span>
              </div>
              
              <p className="text-3xl font-bold text-gray-900 mb-6">
                ${parseFloat(book.price || 0).toFixed(2)}
              </p>
              
              <div className="border-t border-b border-gray-200 py-6 mb-6">
                <p className="text-gray-700 leading-relaxed mb-4">
                  {book.description}
                </p>
              </div>
              
              {book.stock > 0 && (
                <div className="mb-6">
                  <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity
                  </label>
                  <div className="flex">
                    <button
                      onClick={decrementQuantity}
                      className="px-3 py-2 bg-gray-200 rounded-l-lg hover:bg-gray-300"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      id="quantity"
                      value={quantity}
                      onChange={handleQuantityChange}
                      min="1"
                      max={book.stock}
                      className="w-16 px-3 py-2 text-center border-t border-b border-gray-300 focus:outline-none"
                    />
                    <button
                      onClick={incrementQuantity}
                      className="px-3 py-2 bg-gray-200 rounded-r-lg hover:bg-gray-300"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}
              
              <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3">
                <button
                  onClick={addToCart}
                  className="px-8 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  disabled={book.stock <= 0}
                >
                  {book.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                </button>
                <Link
                  to="/cart"
                  className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-300 text-center"
                >
                  View Cart
                </Link>
              </div>
            </div>
            
            {/* Book Specifications */}
            <div className="mt-10 border-t border-gray-200 pt-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Book Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600 mb-1">Publisher:</p>
                  <p className="font-medium">{book.publisher || 'Unknown'}</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Publication Date:</p>
                  <p className="font-medium">
                    {book.published_date 
                      ? new Date(book.published_date).toLocaleDateString() 
                      : 'Unknown'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Pages:</p>
                  <p className="font-medium">{book.pages || 'Unknown'}</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Language:</p>
                  <p className="font-medium">{book.language || 'English'}</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">ISBN:</p>
                  <p className="font-medium">{book.isbn || 'Unknown'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
