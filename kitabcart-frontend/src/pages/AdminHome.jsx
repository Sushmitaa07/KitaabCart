import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LatestCollections from '../components/LatestCollections';
import Reviews from '../components/Reviews';

const AdminHome = () => {
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalUsers: 0,
    totalOrders: 0,
    revenue: 0
  });

  // Mock data - replace with actual API calls
  useEffect(() => {
    // Simulate API call
    setStats({
      totalBooks: 1247,
      totalUsers: 892,
      totalOrders: 156,
      revenue: 45280
    });
  }, []);

  const quickActions = [
    {
      title: 'Add New Book',
      description: 'Add books to your inventory',
      icon: '📚',
      link: '/admin/books',
      color: 'bg-blue-50 hover:bg-blue-100 border-blue-200'
    },
    {
      title: 'Manage Orders',
      description: 'View and process orders',
      icon: '📦',
      link: '/admin/orders',
      color: 'bg-green-50 hover:bg-green-100 border-green-200'
    },
    {
      title: 'User Management',
      description: 'Manage user accounts',
      icon: '👥',
      link: '/admin/users',
      color: 'bg-purple-50 hover:bg-purple-100 border-purple-200'
    },
    {
      title: 'Analytics',
      description: 'View detailed reports',
      icon: '📊',
      link: '/admin',
      color: 'bg-yellow-50 hover:bg-yellow-100 border-yellow-200'
    }
  ];

  const recentActivities = [
    { action: 'New order received', details: 'Order #1234 - $89.99', time: '2 minutes ago', type: 'order' },
    { action: 'Book added', details: 'The Great Gatsby added to inventory', time: '15 minutes ago', type: 'book' },
    { action: 'User registered', details: 'john.doe@email.com joined', time: '1 hour ago', type: 'user' },
    { action: 'Order completed', details: 'Order #1230 delivered successfully', time: '2 hours ago', type: 'order' },
    { action: 'Book updated', details: 'Atomic Habits - Price updated', time: '3 hours ago', type: 'book' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Welcome Section */}
        <div className="mb-8 bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-8 text-white">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-4xl font-bold mb-2">Admin Dashboard 🚀</h1>
              <p className="text-gray-200 text-lg mb-4">
                Manage your bookstore efficiently with these powerful tools and insights.
              </p>
              <div className="flex items-center space-x-6 text-sm text-gray-300">
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                  System Online
                </span>
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                  Last updated: Today
                </span>
              </div>
            </div>              <div className="mt-6 md:mt-0 flex flex-col sm:flex-row gap-3">
                <Link 
                  to="/admin/books"
                  className="bg-white text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                  </svg>
                  Manage Books
                </Link>
                <button className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-gray-800 transition-colors inline-flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
                  </svg>
                View Reports
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Books</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalBooks.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 text-xl">📚</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 text-xl">👥</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalOrders.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-purple-600 text-xl">📦</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${stats.revenue.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <span className="text-yellow-600 text-xl">💰</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quickActions.map((action, index) => (
                  <Link
                    key={index}
                    to={action.link}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 hover:shadow-md ${action.color}`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{action.icon}</span>
                      <div>
                        <h3 className="font-medium text-gray-900">{action.title}</h3>
                        <p className="text-sm text-gray-600">{action.description}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Activities</h2>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3 pb-4 border-b border-gray-100 last:border-b-0 last:pb-0">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs ${
                      activity.type === 'order' ? 'bg-green-100 text-green-600' :
                      activity.type === 'book' ? 'bg-blue-100 text-blue-600' :
                      'bg-purple-100 text-purple-600'
                    }`}>
                      {activity.type === 'order' ? '📦' : activity.type === 'book' ? '📚' : '👤'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                      <p className="text-xs text-gray-600 truncate">{activity.details}</p>
                      <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <Link 
                  to="/admin/activities" 
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  View all activities →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Section */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">24</div>
              <div className="text-sm text-gray-600">Orders Today</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">18</div>
              <div className="text-sm text-gray-600">New Users This Week</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">96%</div>
              <div className="text-sm text-gray-600">Customer Satisfaction</div>
            </div>
          </div>
        </div>
      </div>

      {/* Latest Collections */}
      <LatestCollections />

      {/* Reviews */}
      <Reviews />

      {/* Admin Newsletter Section */}
      <section className="py-16 bg-gradient-to-r from-gray-800 to-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              Admin Updates & Insights 🚀
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Stay informed about platform updates, sales analytics, and business insights to grow your bookstore.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter admin email address"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              <button className="bg-white text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors whitespace-nowrap">
                Subscribe
              </button>
            </div>
            
            <p className="text-sm text-white/70 mt-4">
              Join 500+ admins who stay ahead with business insights. Unsubscribe anytime.
            </p>
            
            {/* Admin Benefits */}
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
                  </svg>
                </div>
                <h3 className="font-semibold text-white mb-1">Sales Analytics</h3>
                <p className="text-sm text-white/80">Weekly performance reports</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
                <h3 className="font-semibold text-white mb-1">Platform Updates</h3>
                <p className="text-sm text-white/80">New features and improvements</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
                <h3 className="font-semibold text-white mb-1">Best Practices</h3>
                <p className="text-sm text-white/80">Tips to optimize your business</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminHome;
