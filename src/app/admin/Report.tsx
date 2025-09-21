'use client';

<<<<<<< HEAD
import React from 'react';
import './Report.css'; // Import the new CSS file
=======
import React, { useState, useEffect } from 'react';

// This is a mock data object to simulate what would be fetched from a backend.
const mockOrders = [
  {
    id: "101",
    order_id: "101",
    order_date: '2023-10-26T10:00:00',
    status: 'Admin Confirmed',
    total_amount: 45.50,
    shop_name: 'Green Grocers',
    shop_address: '123 Forest Path, Woodland',
    order_items_summary: '2x Shiitake, 1x Oyster',
    delivery_person_id: null
  },
  {
    id: "102",
    order_date: '2023-10-25T14:30:00',
    status: 'Assigned for delivery',
    total_amount: 75.00,
    shop_name: 'Mushroom Market',
    shop_address: '456 Hill Street, Meadowville',
    order_items_summary: '5x Cremini, 3x Portobello',
    delivery_person_id: 'mockUserId123'
  },
  {
    id: "103",
    order_date: '2023-10-26T09:00:00',
    status: 'Out for delivery',
    total_amount: 25.25,
    shop_name: 'Fungi Friends',
    shop_address: '789 Grove Avenue, Green Acres',
    order_items_summary: '1x Truffle',
    delivery_person_id: 'mockUserId123'
  },
  {
    id: "104",
    order_date: '2023-10-25T11:45:00',
    status: 'Admin Confirmed',
    total_amount: 32.00,
    shop_name: 'Shop C',
    shop_address: '101 Pine Road, Woodville',
    order_items_summary: '4x Lion\'s Mane',
    delivery_person_id: null
  },
];

const DeliveryDashboard = () => {
  const [assignedDeliveries, setAssignedDeliveries] = useState([]);
  const [availableOrders, setAvailableOrders] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  // Use a mock user ID for frontend demonstration
  const [userId, setUserId] = useState('mockUserId123');

  // Simulate fetching data from the backend
  useEffect(() => {
    // Filter available orders (status 'Admin Confirmed' and not assigned)
    const available = mockOrders.filter(order => order.status === 'Admin Confirmed' && order.delivery_person_id === null);
    setAvailableOrders(available);

    // Filter assigned deliveries for the current mock user
    const assigned = mockOrders.filter(order => order.delivery_person_id === userId);
    setAssignedDeliveries(assigned);
  }, [userId]);

  const clearMessages = () => {
    setTimeout(() => {
      setSuccessMessage('');
      setErrorMessage('');
    }, 3000);
  };
>>>>>>> 17913f82d21836026f3a6d4b0d017f170bdf2903

const Report = () => {
  const handleLogout = () => {
<<<<<<< HEAD
    // You'll implement the actual logout logic here, such as clearing user session data
    console.log("Logging out...");
=======
    setSuccessMessage('Logging out...');
    setUserId(null); // Simulate logging out by clearing the user ID
    setAssignedDeliveries([]);
    clearMessages();
  };

  // Fixed the handleAcceptOrder function to use immutable state updates
  const handleAcceptOrder = (orderId) => {
    setSuccessMessage(`Simulating acceptance of order ${orderId}...`);
    try {
      // Simulate backend update with a delay
      setTimeout(() => {
        const orderToAccept = availableOrders.find(order => order.id === orderId);
        if (orderToAccept) {
          // Create a new, updated object instead of mutating the old one
          const updatedOrder = {
            ...orderToAccept,
            status: 'Assigned for delivery',
            delivery_person_id: userId
          };

          // Update state immutably
          setAvailableOrders(prev => prev.filter(order => order.id !== orderId));
          setAssignedDeliveries(prev => [...prev, updatedOrder]);
          setSuccessMessage(`Order ${orderId} has been successfully accepted!`);
        } else {
          setErrorMessage(`Failed to accept order ${orderId}. Order not found.`);
        }
        clearMessages();
      }, 1000);
    } catch (e) {
      setErrorMessage(`An error occurred while accepting order ${orderId}.`);
      clearMessages();
    }
  };

  // Fixed the handleUpdateStatus function to use immutable state updates
  const handleUpdateStatus = (orderId, newStatus) => {
    setSuccessMessage(`Simulating status update for order ${orderId} to '${newStatus}'...`);
    try {
      // Simulate backend update with a delay
      setTimeout(() => {
        setAssignedDeliveries(prev => prev.map(delivery => {
          if (delivery.id === orderId) {
            // Create a new object with the updated status
            return { ...delivery, status: newStatus };
          }
          return delivery;
        }));
        setSuccessMessage(`Order ${orderId} status updated to '${newStatus}'!`);
        clearMessages();
      }, 1000);
    } catch (e) {
      setErrorMessage(`An error occurred while updating status for order ${orderId}.`);
      clearMessages();
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Assigned for delivery': return 'bg-indigo-100 text-indigo-600';
      case 'Out for delivery': return 'bg-red-100 text-red-600';
      case 'Delivered': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-200 text-gray-800';
    }
>>>>>>> 17913f82d21836026f3a6d4b0d017f170bdf2903
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="admin-panel-title">Admin Panel</div>
        <nav>
          <ul>
            <li className="nav-item">
              <a href="#" className="nav-link">
                Dashboard
              </a>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link">
                Manage Shops
              </a>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link">
                Manage Delivery People
              </a>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link">
                View All orders
              </a>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link active">
                Reports
              </a>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link">
                Customer Ratings
              </a>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link">
                Settings
              </a>
            </li>
            <li className="nav-item">
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </aside>
      <main className="main-content">
        <div className="content-wrapper">
          <header className="dashboard-header">
            <h1 className="header-title">Reports</h1>
          </header>
          
          <section className="report-section">
            <h2 className="report-section-title">Total Sales Overtime</h2>
            <div className="report-card">
              <table className="report-table">
                <thead>
                  <tr>
                    <th>Month</th>
                    <th>Total Sales</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>July</td>
                    <td>Rs. 300000</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

<<<<<<< HEAD
          <section className="report-section">
            <h2 className="report-section-title">Sales By Shops (Coming Soon)</h2>
            <div className="report-card">
              <p className="coming-soon-text">This section will display sales performance per shop</p>
            </div>
          </section>

          <section className="report-section">
            <h2 className="report-section-title">Deliveries per Delivery Person (Coming Soon)</h2>
            <div className="report-card">
              <p className="coming-soon-text">This section will show delivery metrics for each delivery person</p>
=======
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Assigned Deliveries</h2>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              {assignedDeliveries.length === 0 ? (
                <p className="p-6 text-center text-gray-600">No active deliveries assigned to you at this time.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-[#D2C8B5]">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Order ID</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Order Date</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Shop Name</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Address</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Items Summary</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Total Amount</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Status</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {assignedDeliveries.map((delivery) => (
                        <tr key={delivery.id} className="bg-white even:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{delivery.order_id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{new Date(delivery.order_date).toLocaleString()}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{delivery.shop_name}</td>
                          <td className="px-6 py-4 text-sm text-gray-600 max-w-xs overflow-hidden text-ellipsis">{delivery.shop_address}</td>
                          <td className="px-6 py-4 text-sm text-gray-600 max-w-xs overflow-hidden text-ellipsis">{delivery.order_items_summary}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">${delivery.total_amount.toFixed(2)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={`px-3 py-1.5 rounded-full font-semibold text-xs ${getStatusBadgeClass(delivery.status)}`}>
                              {delivery.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            {delivery.status === 'Assigned for delivery' && (
                              <button onClick={() => handleUpdateStatus(delivery.id, 'Out for delivery')} className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-200">
                                Mark Out for Delivery
                              </button>
                            )}
                            {delivery.status === 'Out for delivery' && (
                              <button onClick={() => handleUpdateStatus(delivery.id, 'Delivered')} className="bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-green-700 transition-colors duration-200">
                                Mark Delivered
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
>>>>>>> 17913f82d21836026f3a6d4b0d017f170bdf2903
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Report;