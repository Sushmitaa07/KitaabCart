import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LatestCollections from '../components/LatestCollections';
import { orderService, bookService } from '../services/api';
import Notification from '../components/Notification';

const BuyerHome = () => {
  const [user, setUser] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        if (!token) {
          window.location.href = '/login';
          return;
        }
        
        // Get user data from localStorage
        const userData = JSON.parse(localStorage.getItem('user')) || {};
        setUser({
          name: userData.name || "Book Lover",
          email: userData.email || "",
          memberSince: userData.created_at ? new Date(userData.created_at).getFullYear() : "2024",
          totalOrders: 0,
          totalSpent: 0
        });

        // Fetch recent orders
        try {
          const ordersResponse = await orderService.getUserOrders();
          const orders = ordersResponse.data;
          
          // Update user stats
          if (orders && orders.length > 0) {
            setUser(prev => ({
              ...prev,
              totalOrders: orders.length,
              totalSpent: orders.reduce((sum, order) => sum + parseFloat(order.total_price || 0), 0).toFixed(2)
            }));
            
            // Get recent orders (latest 3)
            const recent = orders.slice(0, 3).map(order => {
              // Just take the first item from each order to display
              const item = order.items && order.items.length > 0 ? order.items[0] : {};
              return {
                id: order.id,
                title: item.book_title || "Book",
                author: item.author || "Unknown",
                price: `$${typeof item.price === 'number' ? item.price.toFixed(2) : parseFloat(item.price || 0).toFixed(2)}`,
                status: order.status || "Processing",
                date: new Date(order.created_at).toISOString().split('T')[0],
                image: item.image_url || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=150&h=200&fit=crop"
              };
            });
            setRecentOrders(recent);
          }
        } catch (err) {
          console.error("Error fetching orders:", err);
          setRecentOrders([]);
          setNotification({
            message: "Could not load your order history.",
            type: "error"
          });
        }
        
        // Fetch recommended books
        try {
          const booksResponse = await bookService.getPublicBooks();
          const books = booksResponse.data;
          
          // Just take the first 3 books as recommendations (in a real app, you'd use a recommendation algorithm)
          const recommendedBooks = books.slice(0, 3).map(book => ({
            id: book.id,
            title: book.title || "Unknown Book",
            author: book.author || "Unknown Author",
            price: `$${typeof book.price === 'number' ? book.price.toFixed(2) : parseFloat(book.price || 0).toFixed(2)}`,
            originalPrice: `$${(parseFloat(book.price || 0) * 1.2).toFixed(2)}`,
            image: book.image_url || "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=150&h=200&fit=crop",
            rating: (4 + Math.random()).toFixed(1),
            reason: "Based on your interests"
          }));
          setRecommendations(recommendedBooks);
        } catch (err) {
          console.error("Error fetching recommendations:", err);
          setRecommendations([]);
        }
        
        // In a real app, you'd fetch the wishlist from the API
        // For now, we'll just use a placeholder
        setWishlist([
          {
            id: 1,
            title: "Project Hail Mary",
            author: "Andy Weir",
            price: "$18.99",
            image: "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=150&h=200&fit=crop"
          },
          {
            id: 2,
            title: "The Silent Patient",
            author: "Alex Michaelides",
            price: "$15.99",
            image: "https://i.pinimg.com/1200x/50/20/2b/50202bdc052d718bc6bd7bcfeceb791d.jpg"
          }
        ]);
      } catch (err) {
        console.error("Error fetching data:", err);
        setNotification({
          message: "Could not load your dashboard data.",
          type: "error"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Shipped': return 'bg-blue-100 text-blue-800';
      case 'Processing': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen">
      {notification && (
        <Notification 
          message={notification.message} 
          type={notification.type} 
          onClose={() => setNotification(null)} 
        />
      )}
      
      {loading ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-gray-800"></div>
            <p className="mt-4 text-xl text-gray-600">Loading your dashboard...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Amazing Hero Section */}
          <section className="relative py-20 bg-gradient-to-br from-gray-100 via-gray-50 to-white overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-64 h-64 bg-gray-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-gray-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{animationDelay: '1s'}}></div>
              <div className="absolute bottom-0 left-1/2 w-64 h-64 bg-gray-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{animationDelay: '2s'}}></div>
            </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <div className="space-y-8">
              <div>
                <div className="inline-flex items-center bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 mb-6 shadow-lg">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                  <span className="text-sm font-medium text-gray-700">Welcome back, {user?.name || 'Reader'}!</span>
                </div>
                
                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Your Personal
                  <span className="block text-gray-600">Reading Journey</span>
                </h1>
                
                <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                  Discover amazing books, track your reading progress, and explore personalized recommendations crafted just for you.
                </p>
              </div>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-6">
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 text-center shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="text-2xl font-bold text-gray-900">{user?.totalOrders || 0}</div>
                  <div className="text-sm text-gray-600">Books Owned</div>
                </div>
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 text-center shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="text-2xl font-bold text-gray-900">{wishlist.length}</div>
                  <div className="text-sm text-gray-600">In Wishlist</div>
                </div>
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 text-center shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="text-2xl font-bold text-gray-900">${user?.totalSpent || 0}</div>
                  <div className="text-sm text-gray-600">Total Spent</div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/books"
                  className="group bg-gray-800 text-white px-8 py-4 rounded-xl font-semibold hover:bg-gray-700 transition-all duration-300 inline-flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <svg className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                  </svg>
                  Explore Books
                </Link>
                <Link
                  to="/buyer/wishlist"
                  className="group border-2 border-gray-800 text-gray-800 px-8 py-4 rounded-xl font-semibold hover:bg-gray-800 hover:text-white transition-all duration-300 inline-flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <svg className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                  My Wishlist
                </Link>
              </div>
            </div>
            
            {/* Hero Visual */}
            <div className="relative">
              <div className="relative group">
                {/* Main Image */}
                <div className="relative overflow-hidden rounded-3xl shadow-2xl transform group-hover:scale-105 transition-all duration-700">
                  <img 
                    src="https://i.pinimg.com/1200x/d5/e1/95/d5e1951255f25d4490eb6c4ffa8f8851.jpg" 
                    alt="Beautiful reading setup"
                    className="w-full h-96 lg:h-[500px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                </div>
                
                {/* Floating Cards */}
                <div className="absolute -top-6 -left-6 bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Reading Goal</div>
                      <div className="text-sm text-gray-600">24/30 books</div>
                    </div>
                  </div>
                </div>
                
                <div className="absolute -bottom-6 -right-6 bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                      </svg>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Favorites</div>
                      <div className="text-sm text-gray-600">{wishlist.length} saved</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Stats */}
      <section className="py-8" style={{backgroundColor: '#cdcdcd'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{user?.totalOrders || 0}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-lg">
                  <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Spent</p>
                  <p className="text-2xl font-bold text-gray-900">${user?.totalSpent || 0}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Wishlist Items</p>
                  <p className="text-2xl font-bold text-gray-900">{wishlist.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <svg className="w-6 h-6 text-orange-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Member Since</p>
                  <p className="text-2xl font-bold text-gray-900">{user?.memberSince || '2024'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Dashboard Content */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Recent Orders */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
                  <Link 
                    to="/buyer/orders" 
                    className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                  >
                    View All
                  </Link>
                </div>
                
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <img 
                        src={order.image} 
                        alt={order.title}
                        className="w-16 h-20 object-cover rounded-lg"
                      />
                      <div className="ml-4 flex-1">
                        <h3 className="font-semibold text-gray-900">{order.title}</h3>
                        <p className="text-gray-600 text-sm">by {order.author}</p>
                        <p className="text-blue-600 font-medium">{order.price}</p>
                      </div>
                      <div className="text-right">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                        <p className="text-gray-500 text-xs mt-1">{order.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions & Wishlist */}
            <div className="space-y-8">
              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
                <div className="space-y-3">
                  <Link 
                    to="/buyer/cart" 
                    className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                      <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                      </svg>
                    </div>
                    <span className="ml-3 font-medium text-gray-900">View Cart</span>
                  </Link>
                  
                  <Link 
                    to="/buyer/wishlist" 
                    className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                      <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                      </svg>
                    </div>
                    <span className="ml-3 font-medium text-gray-900">My Wishlist</span>
                  </Link>
                  
                  <Link 
                    to="/buyer/profile" 
                    className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                      <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                      </svg>
                    </div>
                    <span className="ml-3 font-medium text-gray-900">My Profile</span>
                  </Link>
                  
                  <Link 
                    to="/buyer/orders" 
                    className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    <div className="p-2 bg-orange-100 rounded-lg group-hover:bg-orange-200 transition-colors">
                      <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                      </svg>
                    </div>
                    <span className="ml-3 font-medium text-gray-900">Order History</span>
                  </Link>
                </div>
              </div>

              {/* Wishlist Preview */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Your Wishlist</h2>
                  <Link 
                    to="/buyer/wishlist" 
                    className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                  >
                    View All
                  </Link>
                </div>
                
                <div className="space-y-4">
                  {wishlist.slice(0, 2).map((item) => (
                    <div key={item.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <img 
                        src={item.image} 
                        alt={item.title}
                        className="w-12 h-16 object-cover rounded"
                      />
                      <div className="ml-3 flex-1">
                        <h3 className="font-medium text-gray-900 text-sm">{item.title}</h3>
                        <p className="text-gray-600 text-xs">by {item.author}</p>
                        <p className="text-blue-600 font-medium text-sm">{item.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recommendations Section */}
      <section className="py-12" style={{backgroundColor: '#f8f9fa'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Recommended for You</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {recommendations.map((book) => (
              <div key={book.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow p-6 group">
                <div className="relative overflow-hidden rounded-lg mb-4">
                  <img 
                    src={book.image} 
                    alt={book.title}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium">
                      {book.rating} ⭐
                    </span>
                  </div>
                </div>
                
                <div className="mb-3">
                  <p className="text-blue-600 text-sm font-medium mb-1">{book.reason}</p>
                  <h3 className="font-bold text-gray-900 mb-1">{book.title}</h3>
                  <p className="text-gray-600 text-sm">by {book.author}</p>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xl font-bold text-gray-900">{book.price}</span>
                    <span className="text-sm text-gray-500 line-through ml-2">{book.originalPrice}</span>
                  </div>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Collections */}
      <LatestCollections />

      {/* Newsletter Subscription Section */}
      <section className="py-16 bg-gradient-to-r from-gray-700 to-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              Stay Updated with Our Latest Books! 📚
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Get exclusive access to new releases, special discounts, and personalized book recommendations delivered to your inbox.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              <button className="bg-white text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors whitespace-nowrap">
                Subscribe Now
              </button>
            </div>
            
            <p className="text-sm text-white/70 mt-4">
              Join 10,000+ book lovers who never miss a great read. Unsubscribe anytime.
            </p>
            
            {/* Benefits */}
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                  </svg>
                </div>
                <h3 className="font-semibold text-white mb-1">New Releases</h3>
                <p className="text-sm text-white/80">Be the first to know about new books</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
                <h3 className="font-semibold text-white mb-1">Exclusive Deals</h3>
                <p className="text-sm text-white/80">Special discounts for subscribers</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                </div>
                <h3 className="font-semibold text-white mb-1">Personal Picks</h3>
                <p className="text-sm text-white/80">Curated recommendations just for you</p>
              </div>
            </div>
          </div>
        </div>
      </section>
        </>
      )}
    </div>
  );
};

export default BuyerHome;
