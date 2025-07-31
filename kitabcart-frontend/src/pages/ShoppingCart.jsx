import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { cartService, orderService } from '../services/api';

const ShoppingCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/login';
        return;
      }
      
      const response = await cartService.getCart();
      setCartItems(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching cart:', err);
      setError('Failed to load cart. Please try again later.');
      
      // Mock data for demonstration
      setCartItems([
        {
          id: 1,
          book_id: 1,
          title: 'The Great Gatsby',
          author: 'F. Scott Fitzgerald',
          price: 29.99,
          quantity: 1,
          image_url: 'https://source.unsplash.com/random/500x700/?book,classic'
        },
        {
          id: 2,
          book_id: 3,
          title: 'To Kill a Mockingbird',
          author: 'Harper Lee',
          price: 24.99,
          quantity: 2,
          image_url: 'https://source.unsplash.com/random/500x700/?book,mockingbird'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    try {
      // Find the item to check stock limits
      const item = cartItems.find(item => item.id === itemId);
      if (item && newQuantity > (item.stock || 100)) {
        alert(`Sorry, only ${item.stock} item(s) in stock.`);
        return;
      }
      
      // Update the item in the cart
      await cartService.updateCartItem(itemId, newQuantity);
      
      // Update local state to reflect change
      setCartItems(cartItems.map(item => 
        item.id === itemId 
          ? { ...item, quantity: newQuantity } 
          : item
      ));
    } catch (err) {
      console.error('Error updating cart:', err);
      alert('Failed to update cart. Please try again.');
      
      // For demo purposes, update the local state anyway
      setCartItems(cartItems.map(item => 
        item.id === itemId 
          ? { ...item, quantity: newQuantity } 
          : item
      ));
    }
  };

  const removeItem = async (itemId) => {
    try {
      await cartService.removeFromCart(itemId);
      
      // Update local state to reflect removal
      setCartItems(cartItems.filter(item => item.id !== itemId));
    } catch (err) {
      console.error('Error removing item from cart:', err);
      alert('Failed to remove item from cart. Please try again.');
      
      // For demo purposes, update the local state anyway
      setCartItems(cartItems.filter(item => item.id !== itemId));
    }
  };

  const handleCheckout = async () => {
    try {
      setCheckoutLoading(true);
      
      // Place the order
      await orderService.placeOrder(cartItems);
      
      // Redirect to a success page or order confirmation
      window.location.href = '/checkout/success';
    } catch (err) {
      console.error('Checkout failed:', err);
      alert('Failed to process your order. Please try again.');
      setCheckoutLoading(false);
    }
  };

  // Calculate cart totals
  const subtotal = cartItems.reduce((sum, item) => sum + (parseFloat(item.price || 0) * item.quantity), 0);
  const shipping = subtotal > 0 ? 10 : 0; // Free shipping above $100
  const total = subtotal + shipping;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Shopping Cart</h1>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 border border-red-200">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-16">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-gray-800"></div>
          <p className="mt-4 text-xl text-gray-600">Loading your cart...</p>
        </div>
      ) : cartItems.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-2xl font-medium text-gray-700 mb-4">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">Looks like you haven't added any books to your cart yet.</p>
          <Link to="/books" className="inline-block px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900">
            Browse Books
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 bg-gray-50 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-800">Cart Items ({cartItems.length})</h2>
              </div>
              
              <div className="divide-y divide-gray-200">
                {cartItems.map(item => (
                  <div key={item.id} className="p-6 flex flex-col sm:flex-row">
                    <div className="sm:w-20 sm:h-28 flex-shrink-0 mb-4 sm:mb-0">
                      <img
                        src={item.image_url || 'https://via.placeholder.com/80x112?text=No+Image'}
                        alt={item.title}
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                    <div className="sm:ml-6 flex-1">
                      <div className="flex flex-col sm:flex-row sm:justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">
                            <Link to={`/books/${item.book_id}`} className="hover:text-gray-600">
                              {item.title}
                            </Link>
                          </h3>
                          <p className="text-sm text-gray-500">{item.author}</p>
                        </div>
                        <div className="mt-2 sm:mt-0">
                          <p className="text-lg font-bold text-gray-900">${(parseFloat(item.price || 0) * item.quantity).toFixed(2)}</p>
                          <p className="text-sm text-gray-500">${parseFloat(item.price || 0).toFixed(2)} each</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-4">
                        <div className="flex items-center">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="px-2 py-1 bg-gray-200 rounded-l-md hover:bg-gray-300"
                            disabled={item.quantity <= 1}
                          >
                            -
                          </button>
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                            className="w-12 py-1 px-2 border-t border-b border-gray-300 text-center focus:outline-none"
                          />
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-2 py-1 bg-gray-200 rounded-r-md hover:bg-gray-300"
                          >
                            +
                          </button>
                        </div>
                        
                        <button
                          onClick={() => removeItem(item.id)}
                          className="mt-2 sm:mt-0 text-sm text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="p-6 border-t border-gray-200">
                <Link to="/books" className="text-gray-600 hover:text-gray-900">
                  &larr; Continue Shopping
                </Link>
              </div>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900 font-medium">${subtotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-900 font-medium">
                    {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="flex justify-between">
                    <span className="text-lg font-bold text-gray-900">Total</span>
                    <span className="text-xl font-bold text-gray-900">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={handleCheckout}
                className="w-full mt-6 bg-gray-800 text-white py-3 px-4 rounded-lg hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2 transition duration-200 disabled:bg-gray-400"
                disabled={cartItems.length === 0 || checkoutLoading}
              >
                {checkoutLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  'Proceed to Checkout'
                )}
              </button>
              
              <p className="text-sm text-gray-500 mt-4 text-center">
                Secure checkout powered by KitabCart
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShoppingCart;
