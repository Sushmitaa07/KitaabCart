import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { orderService } from '../services/api';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [orderStatusToUpdate, setOrderStatusToUpdate] = useState('');
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [notification, setNotification] = useState(null);

  // Helper function to safely format currency
  const formatCurrency = (value) => {
    // First convert to number if it's not already
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    
    // Check if it's a valid number
    if (numValue !== null && numValue !== undefined && !isNaN(numValue)) {
      return `$${numValue.toFixed(2)}`;
    }
    
    // Return a default value if not valid
    return '$0.00';
  };

  // OPTIMIZED: Memoized fetchOrders function to prevent unnecessary re-renders
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const response = await orderService.getAllOrders();
      setOrders(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to load orders. Please try again later.');
      
      // Mock data for demonstration if API fails
      setOrders([
        {
          id: 1,
          user_id: 101,
          user_name: 'John Doe',
          user_email: 'john@example.com',
          total_price: 129.95,
          status: 'pending',
          created_at: '2025-06-20T10:30:00Z',
          items: [
            { book_id: 1, book_title: 'The Great Gatsby', quantity: 1, price: 29.99 },
            { book_id: 3, book_title: 'To Kill a Mockingbird', quantity: 2, price: 49.98 }
          ]
        },
        {
          id: 2,
          user_id: 102,
          user_name: 'Jane Smith',
          user_email: 'jane@example.com',
          total_price: 79.98,
          status: 'shipped',
          created_at: '2025-06-18T14:15:00Z',
          items: [
            { book_id: 2, book_title: '1984', quantity: 2, price: 79.98 }
          ]
        },
        {
          id: 3,
          user_id: 103,
          user_name: 'Sam Wilson',
          user_email: 'sam@example.com',
          total_price: 149.97,
          status: 'delivered',
          created_at: '2025-06-15T09:45:00Z',
          items: [
            { book_id: 4, book_title: 'Pride and Prejudice', quantity: 1, price: 24.99 },
            { book_id: 5, book_title: 'The Hobbit', quantity: 1, price: 49.99 },
            { book_id: 6, book_title: 'Harry Potter and the Sorcerer\'s Stone', quantity: 1, price: 74.99 }
          ]
        }
      ]);
    } finally {
      setLoading(false);
    }
  }, []); // FIXED: Empty dependency array since this function doesn't depend on any state

  // FIXED: useEffect with proper dependency array - runs once on mount
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]); // Include fetchOrders since it's now memoized with useCallback

  // OPTIMIZED: Memoized event handlers to prevent unnecessary re-renders
  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  const handleStatusFilterChange = useCallback((e) => {
    setStatusFilter(e.target.value);
  }, []);

  // OPTIMIZED: Memoized filtered orders to prevent unnecessary recalculations
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesSearch = 
        String(order.id).includes(searchTerm) ||
        order.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.user_email?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, statusFilter]);

  // OPTIMIZED: Memoized modal handlers
  const openDetailsModal = useCallback((order) => {
    setCurrentOrder(order);
    setOrderStatusToUpdate(order.status);
    setShowDetailsModal(true);
  }, []);

  const closeDetailsModal = useCallback(() => {
    setShowDetailsModal(false);
    setCurrentOrder(null);
  }, []);

  // OPTIMIZED: Memoized status update handler - simplified without auto-refresh
  const handleUpdateOrderStatus = useCallback(async (e) => {
    e.preventDefault();
    if (!currentOrder) return;
    
    try {
      setUpdatingOrderId(currentOrder.id);
      
      // Call order service to update status
      await orderService.updateOrderStatus(currentOrder.id, orderStatusToUpdate);
      
      // Update local state to reflect change
      setOrders(prevOrders => prevOrders.map(order => 
        order.id === currentOrder.id 
          ? { ...order, status: orderStatusToUpdate } 
          : order
      ));
      
      setNotification({ type: 'success', message: 'Order status updated successfully.' });
      closeDetailsModal();
    } catch (err) {
      console.error('Error updating order status:', err);
      setError('Failed to update order status. Please try again.');
      
      // Mock update for demonstration
      setOrders(prevOrders => prevOrders.map(order => 
        order.id === currentOrder.id 
          ? { ...order, status: orderStatusToUpdate } 
          : order
      ));
      
      closeDetailsModal();
    } finally {
      setUpdatingOrderId(null);
    }
  }, [currentOrder, orderStatusToUpdate, closeDetailsModal]);

  // OPTIMIZED: Simplified status change handler without localStorage notifications
  const handleStatusChange = useCallback(async (orderId, newStatus) => {
    try {
      setUpdatingOrderId(orderId);
      
      // Call the API to update the order status
      await orderService.updateOrderStatus(orderId, newStatus);
      
      // Update the local state
      setOrders(prevOrders => prevOrders.map(order => 
        order.id === orderId 
          ? { ...order, status: newStatus } 
          : order
      ));
      
      // Show success notification
      setNotification({
        type: 'success',
        message: `Order #${orderId} status updated to ${newStatus}`,
      });
      
      // Clear notification after 3 seconds
      setTimeout(() => setNotification(null), 3000);
    } catch (err) {
      console.error('Error updating order status:', err);
      
      // Show error notification
      setNotification({
        type: 'error',
        message: `Failed to update order #${orderId} status: ${err.message}`,
      });
      
      // Clear notification after 5 seconds
      setTimeout(() => setNotification(null), 5000);
    } finally {
      setUpdatingOrderId(null);
    }
  }, []);

  // OPTIMIZED: Memoized helper functions to prevent re-creation on every render
  const getStatusBadgeColor = useCallback((status) => {
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
  }, []);
  
  // Helper function for status indicator dots
  const getStatusColorClass = useCallback((status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-500';
      case 'confirmed':
      case 'accepted':
        return 'bg-blue-500';
      case 'shipped':
        return 'bg-indigo-500';
      case 'delivered':
        return 'bg-green-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  }, []);

  // OPTIMIZED: Memoized date formatter
  const formatDate = useCallback((dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Order Management</h1>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg ${
          notification.type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' 
          : 'bg-red-100 text-red-800 border border-red-200'
        }`}>
          <div className="flex items-center">
            {notification.type === 'success' ? (
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            )}
            <span>{notification.message}</span>
            <button 
              onClick={() => setNotification(null)} 
              className="ml-4 text-gray-500 hover:text-gray-700"
            >
              &times;
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 border border-red-200">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center mb-4 gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search orders by ID, customer name, or email..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          <div>
            <select
              value={statusFilter}
              onChange={handleStatusFilterChange}
              className={`w-full md:w-auto px-4 py-2 rounded-lg ${
                statusFilter !== 'all' ? getStatusBadgeColor(statusFilter) : 'border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400'
              }`}
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-gray-800"></div>
            <p className="mt-2 text-gray-600">Loading orders...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-4 py-4 text-center text-gray-500">
                      No orders found.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">#{order.id}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{order.user_name}</div>
                        <div className="text-sm text-gray-500">{order.user_email}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{formatDate(order.created_at)}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{formatCurrency(order.total_price)}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className={`mr-2 w-2 h-2 rounded-full ${getStatusColorClass(order.status)}`}></span>
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            disabled={updatingOrderId === order.id}
                            className={`text-sm rounded-md px-2 py-1 ${getStatusBadgeColor(order.status)} ${updatingOrderId === order.id ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                          {updatingOrderId === order.id && (
                            <svg className="animate-spin ml-2 h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => openDetailsModal(order)}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {showDetailsModal && currentOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Order #{currentOrder.id} Details</h2>
                <button onClick={closeDetailsModal} className="text-gray-400 hover:text-gray-600">
                  &times;
                </button>
              </div>
              
              <div className="mb-6">
                <div className="flex flex-col md:flex-row md:justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">CUSTOMER</h3>
                    <p className="text-md font-medium text-gray-800">{currentOrder.user_name}</p>
                    <p className="text-sm text-gray-600">{currentOrder.user_email}</p>
                  </div>
                  <div className="mt-4 md:mt-0">
                    <h3 className="text-sm font-medium text-gray-500">ORDER DATE</h3>
                    <p className="text-md text-gray-800">{formatDate(currentOrder.created_at)}</p>
                  </div>
                  <div className="mt-4 md:mt-0">
                    <h3 className="text-sm font-medium text-gray-500">TOTAL</h3>
                    <p className="text-md font-bold text-gray-800">{formatCurrency(currentOrder.total_price)}</p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-500">CURRENT STATUS</h3>
                  <div className="flex items-center mt-1">
                    <span className={`mr-2 w-2 h-2 rounded-full ${getStatusColorClass(currentOrder.status)}`}></span>
                    <span className={`px-3 py-1 text-sm rounded-full ${getStatusBadgeColor(currentOrder.status)}`}>
                      {(currentOrder.status || 'Pending').charAt(0).toUpperCase() + (currentOrder.status || 'pending').slice(1)}
                    </span>
                  </div>
                </div>
                
                <form onSubmit={handleUpdateOrderStatus} className="mb-6">
                  <div className="flex flex-col md:flex-row md:items-end gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Update Order Status</label>
                      <select
                        value={orderStatusToUpdate}
                        onChange={(e) => setOrderStatusToUpdate(e.target.value)}
                        className={`w-full px-4 py-2 rounded-lg ${getStatusBadgeColor(orderStatusToUpdate)}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                    <div>
                      <button
                        type="submit"
                        className="px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-lg hover:bg-gray-900"
                        disabled={updatingOrderId === currentOrder.id} // Disable button while updating
                      >
                        {updatingOrderId === currentOrder.id ? (
                          <div className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Updating...
                          </div>
                        ) : 'Update Status'}
                      </button>
                    </div>
                  </div>
                </form>
                
                <h3 className="text-lg font-medium text-gray-800 mb-2">Order Items</h3>
                <div className="overflow-x-auto border rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Book
                        </th>
                        <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Quantity
                        </th>
                        <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Price
                        </th>
                        <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Subtotal
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentOrder.items.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <div className="text-sm font-medium text-gray-900">{item.book_title}</div>
                            <div className="text-xs text-gray-500">ID: {item.book_id}</div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-sm text-gray-900">{item.quantity}</div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-sm text-gray-900">{formatCurrency(item.price / item.quantity)}</div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-sm font-medium text-gray-900">{formatCurrency(item.price)}</div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-gray-50">
                        <td colSpan="3" className="px-4 py-3 text-right text-sm font-medium text-gray-700">
                          Total:
                        </td>
                        <td className="px-4 py-3 text-sm font-bold text-gray-900">
                          {formatCurrency(currentOrder.total_price)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
              
              <div className="flex justify-end">
                <button
                  onClick={closeDetailsModal}
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

export default AdminOrders;
