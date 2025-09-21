'use client';

import React, { useState, useEffect } from 'react';

// Mock data to simulate fetching all orders
const mockAllOrders = [
  {
    order_id: 'ORD001',
    order_date: '2025-09-20T10:30:00Z',
    total_amount: 45.50,
    status: 'Pending',
    expected_delivery_date: '2025-09-22',
    notes_by_shop: 'Handle with care',
    shop_name: 'Green Farms',
    shop_address: '123 Forest Lane, Mushroom City',
    shop_phone: '555-1234',
    delivery_person_name: 'Unassigned',
    order_items_summary: '2x Shiitake; 1x Portobello',
  },
  {
    order_id: 'ORD002',
    order_date: '2025-09-19T14:45:00Z',
    total_amount: 75.00,
    status: 'Admin Confirmed',
    expected_delivery_date: '2025-09-21',
    notes_by_shop: '',
    shop_name: 'Fungi Funhouse',
    shop_address: '456 Mossy Path, Fungus Town',
    shop_phone: '555-5678',
    delivery_person_name: 'John Doe',
    order_items_summary: '5x Cremini; 2x Oyster',
  },
  {
    order_id: 'ORD003',
    order_date: '2025-09-18T09:00:00Z',
    total_amount: 20.00,
    status: 'Delivered',
    expected_delivery_date: '2025-09-18',
    notes_by_shop: 'Delivered to front porch',
    shop_name: 'Mushroom Market',
    shop_address: '789 Spore Street, Myco Village',
    shop_phone: '555-9012',
    delivery_person_name: 'Jane Smith',
    order_items_summary: '1x Lion\'s Mane',
  },
  {
    order_id: 'ORD004',
    order_date: '2025-09-17T11:00:00Z',
    total_amount: 32.75,
    status: 'Cancelled',
    expected_delivery_date: '2025-09-17',
    notes_by_shop: 'Customer requested cancellation',
    shop_name: 'The Shroomery',
    shop_address: '101 Fungi Road, Agaric City',
    shop_phone: '555-3456',
    delivery_person_name: 'Unassigned',
    order_items_summary: '3x Shiitake',
  },
];

// Helper function to get the status badge class
const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'Pending':
      return 'bg-yellow-100 text-yellow-700';
    case 'Confirmed by Shop':
      return 'bg-blue-100 text-blue-700';
    case 'Admin Confirmed':
      return 'bg-green-100 text-green-700';
    case 'Assigned for Delivery':
      return 'bg-indigo-100 text-indigo-600';
    case 'Out for Delivery':
      return 'bg-red-100 text-red-700';
    case 'Delivered':
      return 'bg-green-100 text-green-800';
    case 'Cancelled':
      return 'bg-red-100 text-red-500';
    default:
      return 'bg-gray-200 text-gray-800';
  }
};

const ViewAllOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Simulate fetching data from an API
  useEffect(() => {
    setTimeout(() => {
      setOrders(mockAllOrders);
      setLoading(false);
    }, 1000);
  }, []);

  const handleUpdateStatus = (orderId, newStatus) => {
    // In a real app, you would make an API call here.
    const message = `Order ${orderId} status updated to ${newStatus}.`;
    setSuccessMessage(message);
    setOrders(prevOrders => prevOrders.map(order =>
      order.order_id === orderId ? { ...order, status: newStatus } : order
    ));
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleConfirm = (orderId) => {
    handleUpdateStatus(orderId, 'Admin Confirmed');
  };

  const handleCancel = (orderId) => {
    handleUpdateStatus(orderId, 'Cancelled');
  };

  const formattedDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="flex min-h-screen bg-[#D5CDB5] text-gray-800 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-[#C2B79A] p-6 shadow-xl flex-shrink-0">
        <div className="text-2xl font-bold mb-8">Admin Panel</div>
        <nav>
          <ul className="space-y-4">
            <li><a href="/admin/AdminDashboard" className="block px-4 py-3 rounded-lg hover:bg-[#EAE2CE] transition-colors duration-200">Dashboard</a></li>
            <li><a href="/admin/" className="block px-4 py-3 rounded-lg hover:bg-[#EAE2CE] transition-colors duration-200">Manage Shops</a></li>
            <li><a href="#" className="block px-4 py-3 rounded-lg hover:bg-[#EAE2CE] transition-colors duration-200">Manage Delivery People</a></li>
            <li><a href="#" className="block px-4 py-3 rounded-lg bg-[#EAE2CE] text-gray-800 font-bold transition-colors duration-200">View All Orders</a></li>
            <li><a href="#" className="block px-4 py-3 rounded-lg hover:bg-[#EAE2CE] transition-colors duration-200">Reports</a></li>
            <li><a href="#" className="block px-4 py-3 rounded-lg hover:bg-[#EAE2CE] transition-colors duration-200">Customer Ratings</a></li>
            <li><a href="#" className="block px-4 py-3 rounded-lg hover:bg-[#EAE2CE] transition-colors duration-200">Settings</a></li>
            <li><a href="#" className="block px-4 py-3 rounded-lg text-red-600 hover:text-red-700 transition-colors duration-200">Logout</a></li>
          </ul>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 p-10 relative overflow-auto">
        {/* Background Image Container */}
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: "url('https://placehold.co/1200x800/8B7E66/FFFFFF?text=MUSHROOMS')" }}></div>
          <div className="absolute inset-0 bg-white opacity-60"></div>
        </div>
        
        <div className="relative z-10 flex flex-col min-h-full">
          {/* Header */}
          <header className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-extrabold text-gray-900">All System Orders</h1>
            <div className="text-xl font-semibold">Welcome Admin</div>
          </header>

          {/* Alert Messages */}
          {errorMessage && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-6" role="alert">
              <strong className="font-bold">Error!</strong>
              <span className="block sm:inline ml-2">{errorMessage}</span>
            </div>
          )}
          {successMessage && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg relative mb-6" role="alert">
              <strong className="font-bold">Success!</strong>
              <span className="block sm:inline ml-2">{successMessage}</span>
            </div>
          )}

          {/* Table Container */}
          <div className="bg-white bg-opacity-80 shadow-xl rounded-lg overflow-hidden">
            {loading ? (
              <p className="p-6 text-center text-gray-600">Loading orders...</p>
            ) : orders.length === 0 ? (
              <p className="p-6 text-center text-gray-600">No orders found in the system.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Date</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shop Name</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shop Address</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items Summary</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Amount</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delivery Person</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expected Delivery</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orders.map((order) => (
                      <tr key={order.order_id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.order_id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{formattedDate(order.order_date)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{order.shop_name}</td>
                        <td className="px-6 py-4 text-sm text-gray-600 max-w-xs overflow-hidden text-ellipsis">{order.shop_address}</td>
                        <td className="px-6 py-4 text-sm text-gray-600 max-w-xs overflow-hidden text-ellipsis">{order.order_items_summary || 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">${order.total_amount.toFixed(2)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{order.delivery_person_name || 'Unassigned'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`status-badge px-2 py-1 rounded-full font-semibold ${getStatusBadgeClass(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {order.expected_delivery_date || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {order.status === 'Pending' && (
                            <button
                              onClick={() => handleConfirm(order.order_id)}
                              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 mb-1"
                            >
                              Confirm Order
                            </button>
                          )}
                          {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
                            <button
                              onClick={() => handleCancel(order.order_id)}
                              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                              Cancel Order
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewAllOrders;
