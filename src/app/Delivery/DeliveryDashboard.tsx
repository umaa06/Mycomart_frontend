'use client';
import React, { useState } from 'react';

// Mock data to simulate fetching from a backend API.
// In a real application, this data would come from an API call.
const MOCK_AVAILABLE_ORDERS = [
  {
    order_id: 101,
    order_date: '2025-09-22 10:30:00',
    shop_name: 'Mushroom Hub',
    shop_address: '123 Forest Path, Green Valley',
    order_items_summary: '2x Shiitake, 1x Oyster',
    total_amount: 15.50,
    expected_delivery_date: '2025-09-22',
  },
  {
    order_id: 102,
    order_date: '2025-09-22 11:15:00',
    shop_name: 'Fungi Fun',
    shop_address: '456 Mossy Lane, Old Woods',
    order_items_summary: '5x Portobello',
    total_amount: 25.00,
    expected_delivery_date: '2025-09-22',
  },
];

const App = () => {
  const [activePage, setActivePage] = useState('Dashboard');
  const [availableOrders, setAvailableOrders] = useState(MOCK_AVAILABLE_ORDERS);
  const [assignedDeliveries, setAssignedDeliveries] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({});

  // Function to handle the "Accept Order" action.
  const handleAcceptOrder = (order) => {
    // Show confirmation modal
    setModalContent({
      title: 'Confirm Acceptance',
      onConfirm: () => {
        // Remove the order from available orders and add it to assigned.
        setAvailableOrders(availableOrders.filter(o => o.order_id !== order.order_id));
        setAssignedDeliveries([...assignedDeliveries, { ...order, status: 'Assigned for Delivery' }]);
        setShowModal(false);
      },
      onCancel: () => setShowModal(false),
    });
    setShowModal(true);
  };

  // Function to handle the "Mark Delivered" action.
  const handleMarkDelivered = (order) => {
    // Show confirmation modal
    setModalContent({
      title: 'Confirm Delivery',
      onConfirm: () => {
        // Remove the order from assigned deliveries.
        setAssignedDeliveries(assignedDeliveries.filter(o => o.order_id !== order.order_id));
        setShowModal(false);
      },
      onCancel: () => setShowModal(false),
    });
    setShowModal(true);
  };

  const renderContent = () => {
    switch (activePage) {
      case 'Dashboard':
        return (
          <DeliveryDashboardContent
            availableOrders={availableOrders}
            assignedDeliveries={assignedDeliveries}
            onAcceptOrder={handleAcceptOrder}
            onMarkDelivered={handleMarkDelivered}
          />
        );
      case 'Delivery History':
        return <div className="p-8 text-center text-gray-500 text-lg">Delivery History Content (Placeholder)</div>;
      case 'Customer Ratings':
        return <div className="p-8 text-center text-gray-500 text-lg">Customer Ratings Content (Placeholder)</div>;
      default:
        return <DeliveryDashboardContent />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F0EAD6] font-sans">
      <SidePanel activePage={activePage} setActivePage={setActivePage} />
      <main className="flex-1 p-8 relative">
        <div className="absolute top-8 right-8 text-black text-sm">
          Welcome Deliver
        </div>
        <div className="absolute inset-0 z-0 overflow-hidden rounded-xl">
          <img
            src="https://placehold.co/1200x800/EAD8B4/000000?text=Background+Image"
            alt="Background of various mushrooms"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="relative z-10">
          {renderContent()}
        </div>
      </main>
      {showModal && (
        <ConfirmationModal
          title={modalContent.title}
          message={modalContent.message}
          onConfirm={modalContent.onConfirm}
          onCancel={modalContent.onCancel}
        />
      )}
    </div>
  );
};

// Confirmation Modal component to replace browser's native alert/confirm.
const ConfirmationModal = ({ title, message, onConfirm, onCancel }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm mx-auto">
      <h3 className="text-xl font-bold mb-4">{title}</h3>
      <p className="text-gray-600 mb-6">{message}</p>
      <div className="flex justify-end space-x-4">
        <button
          onClick={onCancel}
          className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors"
        >
          Confirm
        </button>
      </div>
    </div>
  </div>
);

// Component for the side navigation panel.
const SidePanel = ({ activePage, setActivePage }) => {
  const navItems = [
    'Dashboard',
    'Delivery History',
    'Customer Ratings',
  ];

  return (
    <nav className="w-64 bg-white bg-opacity-80 p-6 shadow-lg rounded-r-3xl">
      <h2 className="text-2xl font-bold mb-8 text-[#5C4533]">Delivery Panel</h2>
      <ul>
        {navItems.map((item) => (
          <li key={item} className="mb-4">
            <button
              onClick={() => setActivePage(item)}
              className={`w-full text-left px-4 py-2 rounded-xl transition-colors duration-200 ease-in-out ${
                activePage === item
                  ? 'bg-[#EAD8B4] text-[#5C4533] font-bold shadow-md'
                  : 'text-[#5C4533] hover:bg-gray-200'
              }`}
            >
              {item}
            </button>
          </li>
        ))}
        <li className="mb-4 mt-8">
          <button
            onClick={() => setActivePage('Logout')}
            className="w-full text-left px-4 py-2 rounded-xl text-red-500 hover:bg-red-100 transition-colors duration-200 ease-in-out font-bold"
          >
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
};

// Component for the Delivery Dashboard content.
const DeliveryDashboardContent = ({ availableOrders, assignedDeliveries, onAcceptOrder, onMarkDelivered }) => {
  return (
    <>
      <h1 className="text-4xl font-bold mb-8 text-[#5C4533]">Delivery Dashboard</h1>
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Available Orders to Accept</h2>
        {availableOrders.length === 0 ? (
          <div className="bg-white bg-opacity-80 p-6 rounded-3xl shadow-lg">
            <p className="text-center text-gray-600 italic">No new orders are currently available for assignment.</p>
          </div>
        ) : (
          <OrderTable orders={availableOrders} onAction={onAcceptOrder} actionLabel="Accept Order" />
        )}
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Assigned Deliveries</h2>
        {assignedDeliveries.length === 0 ? (
          <div className="bg-white bg-opacity-80 p-6 rounded-3xl shadow-lg">
            <p className="text-center text-gray-600 italic">No active deliveries assigned to you at this time.</p>
          </div>
        ) : (
          <OrderTable orders={assignedDeliveries} onAction={onMarkDelivered} actionLabel="Mark Delivered" />
        )}
      </section>
    </>
  );
};

// A reusable table component for orders.
const OrderTable = ({ orders, onAction, actionLabel }) => (
  <div className="bg-white shadow-md rounded-lg overflow-hidden">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Date</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shop Name</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items Summary</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Amount</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expected Delivery</th>
          {actionLabel === 'Mark Delivered' && (
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
          )}
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {orders.map((order) => (
          <tr key={order.order_id}>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.order_id}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{new Date(order.order_date).toLocaleDateString()}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{order.shop_name}</td>
            <td className="px-6 py-4 text-sm text-gray-600 max-w-xs overflow-hidden text-ellipsis">{order.order_items_summary}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">${order.total_amount.toFixed(2)}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{order.expected_delivery_date}</td>
            {actionLabel === 'Mark Delivered' && (
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <span className="status-badge bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-semibold">{order.status}</span>
              </td>
            )}
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <button
                onClick={() => onAction(order)}
                className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  actionLabel === 'Accept Order'
                    ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
                    : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
                }`}
              >
                {actionLabel}
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default App;