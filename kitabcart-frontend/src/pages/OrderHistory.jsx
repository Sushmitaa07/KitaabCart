import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { orderService } from '../services/api';
import Notification from '../components/Notification';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [notification, setNotification] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  // Track if a notification is currently visible
  const [notificationDebounce, setNotificationDebounce] = useState(false);

  // SIMPLIFIED: Helper function to safely show notifications with debounce
  const showNotification = useCallback((message, type) => {
    // Only show notification if we're not already showing one
    if (!notificationDebounce) {
      setNotification({ message, type });
      setNotificationDebounce(true);
      
      // Clear debounce after a delay
      setTimeout(() => {
        setNotificationDebounce(false);
      }, 5000);
    }
  }, [notificationDebounce]);

  // SIMPLIFIED: Basic fetch orders function without status change detection
  const fetchOrders = useCallback(async (showRefreshingState = false) => {
    try {
      if (showRefreshingState) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/login';
        return;
      }
      
      const response = await orderService.getUserOrders();
      console.log('Orders received in component:', response.data);
      
      // Ensure we have an array of orders
      const orderData = Array.isArray(response.data) ? response.data : [];
      
      // Set orders state and update last refresh time
      setOrders(orderData);
      setLastUpdated(new Date());
      
      // Show success notification if manually refreshing
      if (showRefreshingState) {
        showNotification('Order history refreshed successfully!', 'success');
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      showNotification('Could not load your order history.', 'error');
      setOrders([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLastUpdated(new Date());
    }
  }, [showNotification]);

  // SIMPLIFIED: Remove automatic refresh intervals and localStorage cross-tab communication
  // Now the component will only fetch data on mount and manual refresh
  useEffect(() => {
    // Initial data fetch
    fetchOrders();
  }, [fetchOrders]);

  const handleRefresh = () => {
    fetchOrders(true);
  };

  const openOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  const closeOrderDetails = () => {
    setShowDetailsModal(false);
    setSelectedOrder(null);
  };

  const getStatusBadgeColor = (status) => {
    if (!status) return 'bg-gray-100 text-gray-800 border-gray-200';
    
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed':
      case 'accepted':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'shipped':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    
    try {
      const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch (err) {
      console.error('Error formatting date:', err);
      return 'Invalid date';
    }
  };

  // Get a human-readable status description
  const getStatusDescription = (status) => {
    if (!status) return 'Order status is unknown';
    
    switch(status.toLowerCase()) {
      case 'pending':
        return 'Your order has been received and is being processed. Our team will confirm it shortly.';
      case 'confirmed':
      case 'accepted':
        return 'Great news! Your order has been confirmed and is being prepared for shipping. We\'ll notify you once it\'s on its way.';
      case 'shipped':
        return 'Your books are on the way! You should receive them within 7-10 business days.';
      case 'delivered':
        return 'Your order has been delivered. We hope you enjoy your books! If there were any issues, please contact our customer service.';
      case 'cancelled':
        return 'This order has been cancelled. If you didn\'t request this cancellation, please contact our customer service.';
      default:
        return 'Your order is being processed. Thank you for your patience.';
    }
  };

  // Status timeline helper function
  const renderStatusTimeline = (currentStatus) => {
    const statuses = ['pending', 'confirmed', 'shipped', 'delivered'];
    const currentIndex = statuses.indexOf(currentStatus?.toLowerCase() || 'pending');
    
    // If cancelled, show different timeline
    if (currentStatus?.toLowerCase() === 'cancelled') {
      return (
        <div className="w-full mt-4">
          <div className="flex items-center">
            <div className="flex items-center relative">
              <div className="rounded-full h-5 w-5 flex-shrink-0 bg-red-500"></div>
              <div className="ml-3">
                <span className="text-sm font-medium">Order Cancelled</span>
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            This order has been cancelled. If you have any questions, please contact customer support.
          </p>
        </div>
      );
    }
    
    return (
      <div className="w-full mt-4">
        <div className="flex flex-wrap items-center">
          {statuses.map((status, index) => (
            <div key={status} className="flex items-center relative mb-2">
              <div className={`rounded-full h-5 w-5 flex-shrink-0 ${
                index <= currentIndex ? 
                  (index === currentIndex ? 'bg-blue-500 animate-pulse' : 'bg-green-500') : 
                  'bg-gray-300'
              }`}></div>
              <div className="ml-3">
                <span className={`text-sm font-medium ${
                  index <= currentIndex ? 
                    (index === currentIndex ? 'text-blue-500' : 'text-green-500') : 
                    'text-gray-500'
                }`}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </span>
              </div>
              {index < statuses.length - 1 && (
                <div className={`h-1 w-8 md:w-16 ${
                  index < currentIndex ? 'bg-green-500' : 'bg-gray-300'
                } mx-2`}></div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Your Order History</h1>
        <button
          onClick={handleRefresh}
          disabled={loading || refreshing}
          className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium 
            ${refreshing ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-gray-800 text-white hover:bg-gray-700'}`}
        >
          {refreshing ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Refreshing...
            </>
          ) : (
            <>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              Refresh Orders
            </>
          )}
        </button>
      </div>

      {notification && (
        <Notification 
          message={notification.message} 
          type={notification.type} 
          onClose={() => setNotification(null)} 
        />
      )}

      {/* SIMPLIFIED: Removed status change notification banner since we removed auto-refresh */}

      {loading ? (
        <div className="text-center py-16">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-gray-800"></div>
          <p className="mt-4 text-xl text-gray-600">Loading your orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-2xl font-medium text-gray-700 mb-4">No orders found</h2>
          <p className="text-gray-500 mb-6">You haven't placed any orders yet.</p>
          <Link to="/books" className="inline-block px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900">
            Browse Books
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 bg-gray-50 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">Recent Orders</h2>
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500 mt-1">
                Orders are loaded when you visit this page. Use the refresh button to get the latest updates.
                Last updated: {lastUpdated.toLocaleTimeString()}
              </p>
              <div className="text-xs text-gray-500 flex items-center">
                <span className="inline-block h-2 w-2 rounded-full bg-green-500 mr-1"></span> 
                Manual refresh enabled
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order #
                  </th>
                  <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-4 py-3 bg-gray-50 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr 
                    key={order.id} 
                    className="hover:bg-gray-50 transition duration-300"
                  >
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">#{order.id}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{formatDate(order.created_at)}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className={`mr-2 inline-block w-2 h-2 rounded-full ${
                          order.status === 'pending' ? 'bg-yellow-500' :
                          order.status === 'confirmed' || order.status === 'accepted' ? 'bg-blue-500' :
                          order.status === 'shipped' ? 'bg-indigo-500' :
                          order.status === 'delivered' ? 'bg-green-500' :
                          order.status === 'cancelled' ? 'bg-red-500' : 'bg-gray-500'
                        }`}></span>
                        <span className={`px-3 py-1 text-xs leading-5 font-semibold rounded-full border ${getStatusBadgeColor(order.status || 'pending')}`}>
                          {(order.status || 'Pending').charAt(0).toUpperCase() + (order.status || 'pending').slice(1)}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">${parseFloat(order.total_price || 0).toFixed(2)}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{order.items?.length || 0} item(s)</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-center">
                      <button
                        onClick={() => openOrderDetails(order)}
                        className="text-gray-600 hover:text-gray-900 text-sm font-medium"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {showDetailsModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Order #{selectedOrder.id} Details</h2>
                <button onClick={closeOrderDetails} className="text-gray-400 hover:text-gray-600">
                  &times;
                </button>
              </div>
              
              <div className="mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-gray-600 mb-1">Order Date:</p>
                    <p className="font-medium text-gray-900">{formatDate(selectedOrder.created_at)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">Status:</p>
                    <div className="flex items-center">
                      <span className={`mr-2 inline-block w-2 h-2 rounded-full ${
                        selectedOrder.status === 'pending' ? 'bg-yellow-500' :
                        selectedOrder.status === 'confirmed' || selectedOrder.status === 'accepted' ? 'bg-blue-500' :
                        selectedOrder.status === 'shipped' ? 'bg-indigo-500' :
                        selectedOrder.status === 'delivered' ? 'bg-green-500' :
                        selectedOrder.status === 'cancelled' ? 'bg-red-500' : 'bg-gray-500'
                      }`}></span>
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusBadgeColor(selectedOrder.status)}`}>
                        {(selectedOrder.status || 'Pending').charAt(0).toUpperCase() + (selectedOrder.status || 'pending').slice(1)}
                      </span>
                    </div>
                    {selectedOrder.status_updated_at && (
                      <p className="text-xs text-gray-500 mt-1">
                        Updated: {formatDate(selectedOrder.status_updated_at)}
                      </p>
                    )}
                  </div>
                  
                  {selectedOrder.status === 'shipped' && (
                    <div>
                      <p className="text-gray-600 mb-1">Estimated Delivery:</p>
                      <p className="font-medium text-gray-900">
                        {selectedOrder.estimated_delivery 
                          ? formatDate(selectedOrder.estimated_delivery).split(',')[0] 
                          : 'Within 7-10 business days'}
                      </p>
                    </div>
                  )}
                  
                  {selectedOrder.status === 'delivered' && (
                    <div>
                      <p className="text-gray-600 mb-1">Delivered On:</p>
                      <p className="font-medium text-gray-900">
                        {selectedOrder.delivered_date 
                          ? formatDate(selectedOrder.delivered_date) 
                          : 'Date not available'}
                      </p>
                    </div>
                  )}
                </div>
                
                {/* Status Timeline */}
                <div className="mb-6 mt-4 border-t border-b py-4">
                  <h3 className="text-md font-medium text-gray-800 mb-2">Order Progress</h3>
                  {renderStatusTimeline(selectedOrder.status)}
                  
                  <div className="mt-3 text-sm text-gray-600">
                    <p>{getStatusDescription(selectedOrder.status)}</p>
                  </div>
                </div>
                
                <h3 className="text-lg font-medium text-gray-800 mb-2">Order Items</h3>
                <div className="overflow-x-auto border rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Book
                        </th>
                        <th className="px-4 py-3 bg-gray-50 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Quantity
                        </th>
                        <th className="px-4 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Price
                        </th>
                        <th className="px-4 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Subtotal
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedOrder.items.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <div className="text-sm font-medium text-gray-900">{item.book_title}</div>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <div className="text-sm text-gray-500">{item.quantity}</div>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="text-sm text-gray-500">${(item.price / item.quantity).toFixed(2)}</div>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="text-sm font-medium text-gray-900">${item.price.toFixed(2)}</div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-gray-50">
                        <td colSpan="3" className="px-4 py-3 text-right text-sm font-medium text-gray-700">
                          Total:
                        </td>
                        <td className="px-4 py-3 text-right text-sm font-bold text-gray-900">
                          ${parseFloat(selectedOrder.total_price || 0).toFixed(2)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
              
              {/* Status Timeline */}
              {renderStatusTimeline(selectedOrder.status)}
              
              <div className="flex justify-end">
                {selectedOrder.status === 'delivered' && (
                  <Link
                    to="/books"
                    className="mr-3 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    Buy Again
                  </Link>
                )}
                <button
                  onClick={closeOrderDetails}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
