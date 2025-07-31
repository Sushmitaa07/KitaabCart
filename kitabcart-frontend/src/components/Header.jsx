import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/api';

const Header = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Get current user on component mount and check if admin
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setIsAdmin(currentUser?.role === 'admin');
    
    // Listen for storage events (login/logout)
    const handleStorageChange = () => {
      const updatedUser = authService.getCurrentUser();
      setUser(updatedUser);
      setIsAdmin(updatedUser?.role === 'admin');
    };
    
    // Add event listener for storage events AND custom event
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('userStateChanged', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userStateChanged', handleStorageChange);
    };
  }, []);

  const handleHomeClick = (e) => {
    if (e) e.preventDefault();
    navigateTo(isAdmin ? '/admin' : '/');
  };

  const navigateTo = (path) => {
    // Always navigate even if we're already on a similar path
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setIsAdmin(false);
    
    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event('userStateChanged'));
    
    navigateTo('/');
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link 
              to={isAdmin ? "/admin" : "/"} 
              className="text-2xl font-bold text-gray-800 hover:text-gray-600 transition-colors cursor-pointer"
              onClick={(e) => handleHomeClick(e)}
            >
              {isAdmin ? 'KitabCart Admin' : 'KitabCart'}
            </Link>
          </div>
          
          {/* Desktop Navigation - Depends on user role */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {isAdmin ? (
                // Admin Navigation
                <>
                  <Link 
                    to="/admin" 
                    onClick={(e) => {
                      e.preventDefault();
                      navigateTo('/admin');
                    }}
                    className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                  >
                    Dashboard
                  </Link>
                  <Link 
                    to="/admin/books" 
                    onClick={(e) => {
                      e.preventDefault();
                      navigateTo('/admin/books');
                    }}
                    className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                  >
                    Books
                  </Link>
                  <Link 
                    to="/admin/users" 
                    onClick={(e) => {
                      e.preventDefault();
                      navigateTo('/admin/users');
                    }}
                    className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                  >
                    Users
                  </Link>
                  <Link 
                    to="/admin/orders" 
                    onClick={(e) => {
                      e.preventDefault();
                      navigateTo('/admin/orders');
                    }}
                    className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                  >
                    Orders
                  </Link>
                </>
              ) : (
                // Regular User Navigation
                <>
                  <Link 
                    to="/" 
                    onClick={(e) => {
                      e.preventDefault();
                      navigateTo('/');
                    }}
                    className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-all duration-300 hover:scale-105"
                  >
                    Home
                  </Link>
                  <Link 
                    to="/books" 
                    onClick={(e) => {
                      e.preventDefault();
                      navigateTo('/books');
                    }}
                    className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-all duration-300 hover:scale-105"
                  >
                    Books
                  </Link>
                  
                  {user && (
                    <>
                      <Link 
                        to="/cart" 
                        onClick={(e) => {
                          e.preventDefault();
                          navigateTo('/cart');
                        }}
                        className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-all duration-300 hover:scale-105"
                      >
                        Cart
                      </Link>
                      <Link 
                        to="/orders" 
                        onClick={(e) => {
                          e.preventDefault();
                          navigateTo('/orders');
                        }}
                        className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-all duration-300 hover:scale-105"
                      >
                        Orders
                      </Link>
                    </>
                  )}
                </>
              )}
              
              {/* Authentication Buttons */}
              {user ? (
                <div className="flex items-center space-x-4">
                  <div className="bg-gray-100 rounded-full px-3 py-1 text-sm font-medium text-gray-700">
                    {user.name || user.email}
                  </div>
                  <button 
                    onClick={handleLogout} 
                    className="bg-gray-800 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-900 transition-all duration-300 transform hover:scale-105"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link 
                    to="/login" 
                    onClick={(e) => {
                      e.preventDefault();
                      navigateTo('/login');
                    }}
                    className="bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition-all duration-300 transform hover:scale-105"
                  >
                    Login
                  </Link>
                  <Link 
                    to="/signup" 
                    onClick={(e) => {
                      e.preventDefault();
                      navigateTo('/signup');
                    }}
                    className="bg-gray-800 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-900 transition-all duration-300 transform hover:scale-105"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-gray-700 hover:text-gray-900 focus:outline-none focus:text-gray-900"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
              {isAdmin ? (
                // Admin Mobile Navigation
                <>
                  <Link 
                    to="/admin" 
                    onClick={(e) => {
                      e.preventDefault();
                      navigateTo('/admin');
                    }}
                    className="block text-gray-700 hover:text-gray-900 px-3 py-2 text-base font-medium"
                  >
                    Dashboard
                  </Link>
                  <Link 
                    to="/admin/books" 
                    onClick={(e) => {
                      e.preventDefault();
                      navigateTo('/admin/books');
                    }}
                    className="block text-gray-700 hover:text-gray-900 px-3 py-2 text-base font-medium"
                  >
                    Books
                  </Link>
                  <Link 
                    to="/admin/users" 
                    onClick={(e) => {
                      e.preventDefault();
                      navigateTo('/admin/users');
                    }}
                    className="block text-gray-700 hover:text-gray-900 px-3 py-2 text-base font-medium"
                  >
                    Users
                  </Link>
                  <Link 
                    to="/admin/orders" 
                    onClick={(e) => {
                      e.preventDefault();
                      navigateTo('/admin/orders');
                    }}
                    className="block text-gray-700 hover:text-gray-900 px-3 py-2 text-base font-medium"
                  >
                    Orders
                  </Link>
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    <div className="px-3 py-1 text-sm text-gray-500">
                      Signed in as: {user?.name || user?.email || 'Admin'}
                    </div>
                    <button 
                      onClick={handleLogout} 
                      className="block w-full text-left bg-gray-800 text-white px-3 py-2 rounded-md text-base font-medium hover:bg-gray-900 mt-1"
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                // Regular User Mobile Navigation
                <>
                  <Link 
                    to="/" 
                    onClick={(e) => {
                      e.preventDefault();
                      navigateTo('/');
                    }}
                    className="block text-gray-700 hover:text-gray-900 px-3 py-2 text-base font-medium"
                  >
                    Home
                  </Link>
                  <Link 
                    to="/books" 
                    onClick={(e) => {
                      e.preventDefault();
                      navigateTo('/books');
                    }}
                    className="block text-gray-700 hover:text-gray-900 px-3 py-2 text-base font-medium"
                  >
                    Books
                  </Link>
                  
                  {user ? (
                    <>
                      <Link 
                        to="/cart" 
                        onClick={(e) => {
                          e.preventDefault();
                          navigateTo('/cart');
                        }}
                        className="block text-gray-700 hover:text-gray-900 px-3 py-2 text-base font-medium"
                      >
                        Cart
                      </Link>
                      <Link 
                        to="/orders" 
                        onClick={(e) => {
                          e.preventDefault();
                          navigateTo('/orders');
                        }}
                        className="block text-gray-700 hover:text-gray-900 px-3 py-2 text-base font-medium"
                      >
                        Orders
                      </Link>
                      <div className="mt-2 pt-2 border-t border-gray-200">
                        <div className="px-3 py-1 text-sm text-gray-500">
                          Signed in as: {user.name || user.email}
                        </div>
                        <button 
                          onClick={handleLogout} 
                          className="block w-full text-left bg-gray-800 text-white px-3 py-2 rounded-md text-base font-medium hover:bg-gray-900 mt-1"
                        >
                          Logout
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="mt-2 space-y-2">
                      <Link 
                        to="/login" 
                        onClick={(e) => {
                          e.preventDefault();
                          navigateTo('/login');
                        }}
                        className="block bg-gray-600 text-white px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700"
                      >
                        Login
                      </Link>
                      <Link 
                        to="/signup" 
                        onClick={(e) => {
                          e.preventDefault();
                          navigateTo('/signup');
                        }}
                        className="block bg-gray-800 text-white px-3 py-2 rounded-md text-base font-medium hover:bg-gray-900"
                      >
                        Sign Up
                      </Link>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
