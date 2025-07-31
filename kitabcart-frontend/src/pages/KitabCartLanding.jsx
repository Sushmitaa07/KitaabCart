import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LatestCollections from '../components/LatestCollections';
import Reviews from '../components/Reviews';
import { bookService, cartService } from '../services/api';

const KitabCartLanding = () => {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState({});
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartLoading, setCartLoading] = useState({});

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch books from API
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const response = await bookService.getPublicBooks();
        setBooks(response.data || []);
      } catch (error) {
        console.error('Error fetching books:', error);
        setBooks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({
              ...prev,
              [entry.target.id]: true
            }));
          }
        });
      },
      { threshold: 0.1 }
    );

    // Observe all sections
    const sections = document.querySelectorAll('[data-animate]');
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  // Handle add to cart
  const handleAddToCart = async (bookId) => {
    try {
      setCartLoading(prev => ({ ...prev, [bookId]: true }));
      await cartService.addToCart(bookId, 1);
      
      // Show success message
      alert('Book added to cart successfully!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add book to cart. Please try again.');
    } finally {
      setCartLoading(prev => ({ ...prev, [bookId]: false }));
    }
  };

  // Handle book click to show details
  const handleBookClick = (bookId) => {
    navigate(`/books/${bookId}`);
  };

  const features = [
    {
      icon: (
        <svg className="w-8 h-8 text-gray-800" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM7 7h10v2H7V7zm0 4h10v2H7v-2zm0 4h7v2H7v-2z"/>
        </svg>
      ),
      title: 'Vast Collection',
      description: 'Explore thousands of books across all genres and categories'
    },
    {
      icon: (
        <svg className="w-8 h-8 text-gray-800" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 7c0-1.1-.9-2-2-2h-3v2h3v11l-7-3-7 3V7h3V5H5c-1.1 0-2 .9-2 2v11l9-4 9 4V7z"/>
        </svg>
      ),
      title: 'Fast Delivery',
      description: 'Get your books delivered to your doorstep within 2-3 business days'
    },
    {
      icon: (
        <svg className="w-8 h-8 text-gray-800" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
      ),
      title: 'Best Prices',
      description: 'Enjoy competitive prices and amazing discounts on your favorite books'
    },
    {
      icon: (
        <svg className="w-8 h-8 text-gray-800" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm9 14H6V10h12v10zm-6-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"/>
        </svg>
      ),
      title: 'Secure Payment',
      description: 'Shop with confidence using our secure and encrypted payment system'
    }
  ];

  const categories = [
    'Fiction', 'Non-Fiction', 'Science', 'Technology', 'History', 'Biography', 
    'Romance', 'Mystery', 'Fantasy', 'Self-Help', 'Business', 'Academic'
  ];

  // Get first 4 books for popular section
  const popularBooks = books.slice(0, 4);
  
  // Get next 5 books for bestsellers section
  const bestSellingBooks = books.slice(4, 9);

  return (
    <div className="min-h-screen">
      {/* Scroll Progress Indicator */}
      <div 
        className="scroll-indicator"
        style={{
          width: `${(scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100}%`
        }}
      ></div>

      {/* Hero Section - Minimal Design */}
      <section id="home" className="relative py-24 bg-gray-50" style={{backgroundColor: '#f8f9fa'}}>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-slideInLeft">
              <div className="inline-block mb-6">
                <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                  New Books Every Week!
                </span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6 text-gray-900">
                Your Gateway to
                <span className="block text-black">Endless Stories</span>
              </h1>
              
              <p className="text-xl text-gray-700 mb-8 leading-relaxed animate-fadeInUp" style={{animationDelay: '0.8s'}}>
                Discover, explore, and purchase books from our vast collection. From bestsellers to hidden gems, 
                find your next favorite read at unbeatable prices with exclusive discounts!
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8 animate-fadeInUp" style={{animationDelay: '1s'}}>
                <Link 
                  to="/signup" 
                  className="group bg-gradient-to-r from-gray-800 to-gray-900 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-gray-700 hover:to-gray-800 transition-all duration-300 text-center transform hover:scale-105 hover:shadow-2xl hover:-translate-y-1 relative overflow-hidden"
                >
                  <span className="relative z-10">Start Shopping</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                </Link>
                <button className="group border-3 border-gray-800 text-gray-800 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-800 hover:text-white transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:-translate-y-1 relative overflow-hidden">
                  <span className="relative z-10">Explore Collection</span>
                  <div className="absolute inset-0 bg-gray-800 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                </button>
              </div>

              {/* Enhanced Stats */}
              <div className="grid grid-cols-3 gap-6 animate-fadeInUp" style={{animationDelay: '1.2s'}}>
                <div className="text-center group cursor-pointer transform hover:scale-110 transition-all duration-300">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 hover:bg-white/20 transition-all duration-300 hover:shadow-xl">
                    <div className="text-4xl font-bold text-gray-800 group-hover:text-gray-900 transition-colors">{books.length}+</div>
                    <div className="text-gray-700 group-hover:text-gray-800 transition-colors">Books Available</div>
                  </div>
                </div>
                <div className="text-center group cursor-pointer transform hover:scale-110 transition-all duration-300">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 hover:bg-white/20 transition-all duration-300 hover:shadow-xl">
                    <div className="text-4xl font-bold text-gray-800 group-hover:text-gray-900 transition-colors">5K+</div>
                    <div className="text-gray-700 group-hover:text-gray-800 transition-colors">Happy Customers</div>
                  </div>
                </div>
                <div className="text-center group cursor-pointer transform hover:scale-110 transition-all duration-300">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 hover:bg-white/20 transition-all duration-300 hover:shadow-xl">
                    <div className="text-4xl font-bold text-gray-800 group-hover:text-gray-900 transition-colors">99%</div>
                    <div className="text-gray-700 group-hover:text-gray-800 transition-colors">Satisfaction Rate</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Enhanced Right Side with Image */}
            <div className="relative animate-slideInRight">
              {/* Main Image Container */}
              <div className="relative group">
                {/* Beautiful Book Library Image */}
                <div className="relative overflow-hidden rounded-3xl shadow-2xl transform group-hover:scale-105 transition-all duration-500 hover:shadow-3xl">
                  <img 
                    src="https://i.pinimg.com/736x/dc/bc/71/dcbc7172f7092dc3697f02f0fa10e839.jpg" 
                    alt="Beautiful library with books"
                    className="w-full h-96 md:h-[500px] object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  
                  {/* Overlay with gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                  
                  {/* Bottom Info Bar */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-black/80 to-black/60 text-white p-6 rounded-b-3xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium">{books.length}+ Books Available</div>
                        <div className="text-xs text-gray-300">New arrivals every week</div>
                      </div>
                      <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 px-4 py-2 rounded-full text-sm font-bold hover:from-yellow-300 hover:to-orange-300 transition-all duration-300 cursor-pointer transform hover:scale-110">
                        Shop Now
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Books Section with Scroll Animation */}
      <section 
        id="popular" 
        className="py-20 bg-white"
        data-animate
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            className={`text-center mb-16 transition-all duration-1000 ${
              isVisible.popular ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Popular Books</h2>
            <p className="text-xl text-gray-600">Discover what everyone's reading right now</p>
          </div>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
              <p className="mt-4 text-gray-600">Loading books...</p>
            </div>
          ) : popularBooks.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {popularBooks.map((book, index) => (
                                 <div 
                   key={book.id} 
                   className={`group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-2 hover:scale-105 book-card cursor-pointer ${
                     isVisible.popular 
                       ? 'opacity-100 translate-y-0' 
                       : 'opacity-0 translate-y-20'
                   }`}
                   style={{
                     transitionDelay: isVisible.popular ? `${index * 150}ms` : '0ms'
                   }}
                   onClick={() => handleBookClick(book.id)}
                 >
                  <div className="relative overflow-hidden rounded-t-xl">
                    <img 
                      src={book.image_url || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop"} 
                      alt={book.title}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-xs font-bold">
                        Popular
                      </span>
                    </div>
                    <div className="absolute top-4 right-4 bg-white/90 px-2 py-1 rounded-full">
                      <span className="text-yellow-400 text-sm">4.8</span>
                    </div>
                  </div>
                                     <div className="p-6 flex flex-col h-full book-content">
                     <div className="flex-grow">
                       <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-gray-700 transition-colors line-clamp-2">
                         {book.title}
                       </h3>
                       <p className="text-gray-600 mb-3">by {book.author}</p>
                     </div>
                     <div className="mt-auto book-actions">
                       <div className="flex items-center justify-between mb-3">
                                                   <div className="flex items-center space-x-2">
                            <span className="text-xl font-bold text-gray-900">Rs. {book.price}</span>
                            <span className="text-sm text-gray-500 line-through">Rs. {(book.price * 1.2).toFixed(2)}</span>
                          </div>
                       </div>
                                               <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(book.id);
                          }}
                          disabled={cartLoading[book.id]}
                          className={`w-full bg-gray-800 text-white px-4 py-3 rounded-lg text-sm font-medium hover:bg-gray-700 transition-all duration-300 transform hover:scale-105 ${
                            cartLoading[book.id] ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                        >
                          {cartLoading[book.id] ? 'Adding...' : 'Add to Cart'}
                        </button>
                     </div>
                   </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No books available at the moment.</p>
            </div>
          )}
          
          <div 
            className={`text-center mt-12 transition-all duration-1000 delay-700 ${
              isVisible.popular ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <Link 
              to="/catalog" 
              className="bg-gray-800 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            >
              View All Books
            </Link>
          </div>
        </div>
      </section>

      {/* Best Selling Books Section with Parallax Scroll */}
      <section 
        id="bestsellers" 
        style={{backgroundColor: '#cdcdcd'}} 
        className="py-20"
        data-animate
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            className={`text-center mb-16 transition-all duration-1000 ${
              isVisible.bestsellers ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Best Selling Books</h2>
            <p className="text-xl text-gray-600">Top picks that are flying off our shelves</p>
          </div>
          
          {bestSellingBooks.length > 0 ? (
            <div className="relative">
              <div className="flex overflow-x-auto space-x-6 pb-6 scrollbar-hide">
                {bestSellingBooks.map((book, index) => (
                                     <div 
                     key={book.id} 
                     className={`flex-none w-64 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-3 hover:scale-105 book-card cursor-pointer ${
                       isVisible.bestsellers 
                         ? 'opacity-100 translate-x-0' 
                         : 'opacity-0 translate-x-20'
                     }`}
                     style={{
                       transitionDelay: isVisible.bestsellers ? `${index * 200}ms` : '0ms'
                     }}
                     onClick={() => handleBookClick(book.id)}
                   >
                    <div className="relative overflow-hidden rounded-t-xl">
                      <img 
                        src={book.image_url || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop"} 
                        alt={book.title}
                        className="w-full h-72 object-cover hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                          #{index + 1} Bestseller
                        </span>
                      </div>
                    </div>
                                         <div className="p-6 flex flex-col h-full">
                       <div className="flex-grow">
                         <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{book.title}</h3>
                         <p className="text-gray-600 mb-2">by {book.author}</p>
                         <p className="text-sm text-green-600 font-medium mb-3">In Stock</p>
                       </div>
                       <div className="mt-auto">
                                                   <div className="flex items-center justify-between mb-3">
                            <span className="text-xl font-bold text-gray-900">Rs. {book.price}</span>
                          </div>
                                                   <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToCart(book.id);
                            }}
                            disabled={cartLoading[book.id]}
                            className={`w-full bg-red-500 text-white px-4 py-3 rounded-lg text-sm font-medium hover:bg-red-600 transition-all duration-300 transform hover:scale-105 ${
                              cartLoading[book.id] ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                          >
                            {cartLoading[book.id] ? 'Adding...' : 'Buy Now'}
                          </button>
                       </div>
                     </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No bestsellers available at the moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* Features Section with Staggered Animation */}
      <section 
        id="features" 
        className="py-20 bg-white"
        data-animate
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            className={`text-center mb-16 transition-all duration-1000 ${
              isVisible.features ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose KitabCart?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're committed to providing the best book shopping experience with unmatched quality and service.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className={`text-center p-8 rounded-xl hover:shadow-xl transition-all duration-700 transform hover:-translate-y-2 hover:scale-105 group ${
                  isVisible.features 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-20'
                }`}
                style={{
                  backgroundColor: '#f8f9fa', 
                  transitionDelay: isVisible.features ? `${index * 100}ms` : '0ms'
                }}
              >
                <div 
                  className={`w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mb-6 mx-auto transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-lg ${
                    isVisible.features ? 'animate-bounce' : ''
                  }`}
                  style={{animationDelay: `${index * 200}ms`}}
                >
                  <div className="group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-gray-700 transition-colors">{feature.title}</h3>
                <p className="text-gray-700 leading-relaxed group-hover:text-gray-600 transition-colors">{feature.description}</p>
                
                {/* Decorative line */}
                <div className="w-12 h-1 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full mx-auto mt-4 transform scale-0 group-hover:scale-100 transition-transform duration-300"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Collections Section with Scale Animation */}
      <LatestCollections />

      {/* Categories Section with Wave Animation */}
      <section 
        id="categories" 
        className="py-20 bg-white"
        data-animate
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            className={`text-center mb-16 transition-all duration-1000 ${
              isVisible.categories ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Explore Categories</h2>
            <p className="text-xl text-gray-600">Find books in your favorite genres</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category, index) => (
              <div 
                key={index} 
                className={`bg-white p-4 rounded-lg text-center hover:shadow-md transition-all duration-500 cursor-pointer transform hover:scale-105 hover:-translate-y-1 border-2 border-transparent hover:border-gray-300 ${
                  isVisible.categories 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-10'
                }`}
                style={{
                  backgroundColor: '#cdcdcd', 
                  transitionDelay: isVisible.categories ? `${index * 50}ms` : '0ms'
                }}
              >
                <span className="text-gray-800 font-medium hover:text-gray-900 transition-colors">{category}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section with Counter Animation */}
      <section 
        id="stats"
        className="py-20 bg-gray-800 text-white"
        data-animate
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div 
              className={`transition-all duration-1000 ${
                isVisible.stats ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{transitionDelay: '0ms'}}
            >
              <div className="text-5xl font-bold mb-2">{books.length}+</div>
              <div className="text-gray-300 text-lg">Books in Stock</div>
            </div>
            <div 
              className={`transition-all duration-1000 ${
                isVisible.stats ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{transitionDelay: '200ms'}}
            >
              <div className="text-5xl font-bold mb-2">5,000+</div>
              <div className="text-gray-300 text-lg">Happy Customers</div>
            </div>
            <div 
              className={`transition-all duration-1000 ${
                isVisible.stats ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{transitionDelay: '400ms'}}
            >
              <div className="text-5xl font-bold mb-2">50+</div>
              <div className="text-gray-300 text-lg">Authors Featured</div>
            </div>
            <div 
              className={`transition-all duration-1000 ${
                isVisible.stats ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{transitionDelay: '600ms'}}
            >
              <div className="text-5xl font-bold mb-2">24/7</div>
              <div className="text-gray-300 text-lg">Customer Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section with Slide Animation */}
      <Reviews />

      {/* CTA Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Your Reading Journey?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of book lovers who have made KitabCart their go-to destination for quality books.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/signup" 
              className="bg-white text-gray-900 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Create Account
            </Link>
            <Link 
              to="/login" 
              className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-gray-900 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Enhanced CSS Animations with Scroll Effects */}
      <style>{`
        /* Smooth scrolling for the entire page */
        html {
          scroll-behavior: smooth;
        }

        /* Parallax and scroll animations */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes floatSlow {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-30px) rotate(180deg);
          }
        }

        @keyframes bounceSlow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-15px);
          }
        }

        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes slideInFromLeft {
          from {
            opacity: 0;
            transform: translateX(-100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInFromRight {
          from {
            opacity: 0;
            transform: translateX(100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes flipIn {
          from {
            opacity: 0;
            transform: rotateY(-90deg);
          }
          to {
            opacity: 1;
            transform: rotateY(0);
          }
        }

        @keyframes zoomIn {
          from {
            opacity: 0;
            transform: scale(0.3);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        /* Animation classes */
        .animate-fadeInUp {
          animation: fadeInUp 1s ease-out forwards;
        }

        .animate-fadeInDown {
          animation: fadeInDown 0.8s ease-out forwards;
        }

        .animate-slideInUp {
          animation: slideInUp 0.8s ease-out forwards;
          opacity: 0;
        }

        .animate-slideInRight {
          animation: slideInRight 0.8s ease-out forwards;
          opacity: 0;
        }

        .animate-slideInLeft {
          animation: slideInLeft 0.8s ease-out forwards;
          opacity: 0;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float 3s ease-in-out infinite;
          animation-delay: 1s;
        }

        .animate-float-slow {
          animation: floatSlow 4s ease-in-out infinite;
        }

        .animate-bounce-slow {
          animation: bounceSlow 2s ease-in-out infinite;
        }

        .animate-bounce-delayed {
          animation: bounceSlow 2s ease-in-out infinite;
          animation-delay: 0.5s;
        }

        .animate-scale-in {
          animation: scaleIn 0.8s ease-out forwards;
        }

        .animate-slide-from-left {
          animation: slideInFromLeft 0.8s ease-out forwards;
        }

        .animate-slide-from-right {
          animation: slideInFromRight 0.8s ease-out forwards;
        }

        .animate-flip-in {
          animation: flipIn 0.8s ease-out forwards;
        }

        .animate-zoom-in {
          animation: zoomIn 0.6s ease-out forwards;
        }

        /* Scroll behavior */
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        /* Hover effects */
        .group:hover .group-hover\\:scale-110 {
          transform: scale(1.1);
        }

        .border-3 {
          border-width: 3px;
        }

        .shadow-3xl {
          box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
        }

        /* Gradient text animation */
        .bg-gradient-to-r {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }

        /* Custom hover effects */
        .hover\\:shadow-3xl:hover {
          box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
        }

        /* Backdrop blur effects */
        .backdrop-blur-lg {
          backdrop-filter: blur(16px);
        }

        .backdrop-blur-sm {
          backdrop-filter: blur(4px);
        }

        /* Smooth transitions for all elements */
        * {
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Scroll progress indicator */
        .scroll-indicator {
          position: fixed;
          top: 0;
          left: 0;
          height: 4px;
          background: linear-gradient(90deg, #f59e0b, #ef4444, #8b5cf6);
          z-index: 1000;
          transition: width 0.3s ease;
        }

        /* Parallax container */
        .parallax-container {
          will-change: transform;
        }

        /* Intersection animation triggers */
        [data-animate] {
          transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Staggered animation delays */
        .stagger-1 { transition-delay: 0.1s; }
        .stagger-2 { transition-delay: 0.2s; }
        .stagger-3 { transition-delay: 0.3s; }
        .stagger-4 { transition-delay: 0.4s; }
        .stagger-5 { transition-delay: 0.5s; }

        /* Loading states */
        .loading {
          opacity: 0;
          transform: translateY(20px);
        }

        .loaded {
          opacity: 1;
          transform: translateY(0);
        }

        /* Mobile optimizations */
        @media (max-width: 768px) {
          .parallax-container {
            transform: none !important;
          }
        }

        /* Line clamp utilities */
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* Ensure consistent card heights */
        .book-card {
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .book-card .book-content {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .book-card .book-actions {
          margin-top: auto;
        }
      `}</style>
    </div>
  );
};

export default KitabCartLanding;