'use client';
import React, { useState } from 'react';
import './DeliveryDashboard.css';
import {authService} from '@/app/api/authService';
import {useRouter} from 'next/navigation';

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

const DeliveryDash = () => {
  const [activePage, setActivePage] = useState('Dashboard');
  const [availableOrders, setAvailableOrders] = useState(MOCK_AVAILABLE_ORDERS);
  const [assignedDeliveries, setAssignedDeliveries] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({});
  const router = useRouter();

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
        return <DeliveryDashboardContent
            availableOrders={availableOrders}
            assignedDeliveries={assignedDeliveries}
            onAcceptOrder={handleAcceptOrder}
            onMarkDelivered={handleMarkDelivered}/>;
    }
  };

  return (
    <div className="delivery-dashboard-container">
      <SidePanel activePage={activePage} setActivePage={setActivePage} />
      <main className="main-content">
        <div className="welcome-message">
          Welcome Deliver
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
  <div className="modal-overlay">
    <div className="modal-content">
      <h3 className="modal-title">{title}</h3>
      <p className="modal-message">{message}</p>
      <div className="modal-actions">
        <button
          onClick={onCancel}
          className="modal-button cancel"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="modal-button confirm"
        >
          Confirm
        </button>
      </div>
    </div>
  </div>
);

// Component for the side navigation panel.
const SidePanel = ({ activePage, setActivePage }) => {

    const router = useRouter();
  const handleLogout = () => {
    authService.logout().then(r => {
      router.push('/');
    }).catch(ra=>{router.push('/')});
  };
  const navItems = [
    'Dashboard',
    'Delivery History',
    'Customer Ratings',
  ];

  return (
    <nav className="sidebar">
      <h2 className="delivery-panel-title">Delivery Panel</h2>
      <ul>
        {navItems.map((item) => (
          <li key={item} className="nav-item">
            <button
              onClick={() => setActivePage(item)}
              className={`nav-item-button ${activePage === item ? 'active' : ''}`}
            >
              {item}
            </button>
          </li>
        ))}
        <li className="nav-item">
          <button
            onClick={() => handleLogout()}
            className="logout-btn"
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
      <h1 className="dashboard-header">Delivery Dashboard</h1>
      <section className="order-section">
        <h2 className="section-title">Available Orders to Accept</h2>
        {availableOrders.length === 0 ? (
          <div className="order-box">
            <p className="empty-message">No new orders are currently available for assignment.</p>
          </div>
        ) : (
          <OrderTable orders={availableOrders} onAction={onAcceptOrder} actionLabel="Accept Order" />
        )}
      </section>

      <section className="order-section">
        <h2 className="section-title">Your Assigned Deliveries</h2>
        {assignedDeliveries.length === 0 ? (
          <div className="order-box">
            <p className="empty-message">No active deliveries assigned to you at this time.</p>
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
  <div className="order-box">
    <div className="order-table-container">
      <table className="order-table">
        <thead className="table-header">
          <tr>
            <th className="table-th">Order ID</th>
            <th className="table-th">Order Date</th>
            <th className="table-th">Shop Name</th>
            <th className="table-th">Items Summary</th>
            <th className="table-th">Total Amount</th>
            <th className="table-th">Expected Delivery</th>
            {actionLabel === 'Mark Delivered' && (
              <th className="table-th">Status</th>
            )}
            <th className="table-th">Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.order_id}>
              <td className="table-td table-td-bold table-td-nowrap">{order.order_id}</td>
              <td className="table-td table-td-nowrap">{new Date(order.order_date).toLocaleDateString()}</td>
              <td className="table-td">{order.shop_name}</td>
              <td className="table-td">{order.order_items_summary}</td>
              <td className="table-td">${order.total_amount.toFixed(2)}</td>
              <td className="table-td table-td-nowrap">{order.expected_delivery_date}</td>
              {actionLabel === 'Mark Delivered' && (
                <td className="table-td">
                  <span className="status-badge bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-semibold">{order.status}</span>
                </td>
              )}
              <td className="table-td">
                <button
                  onClick={() => onAction(order)}
                  className={`action-button ${
                    actionLabel === 'Accept Order'
                      ? 'accept-button'
                      : 'delivered-button'
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
  </div>
);

export default DeliveryDash;
