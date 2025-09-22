'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link'; // Import Link for navigation
import './ViewAllOrders.css'; // Import the new CSS file

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
            return 'status-badge-Pending';
        case 'Admin Confirmed':
            return 'status-badge-AdminConfirmed';
        case 'Delivered':
            return 'status-badge-Delivered';
        case 'Cancelled':
            return 'status-badge-Cancelled';
        default:
            return '';
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

    const navItems = [
        { href: '/admin/admin-dashboard', label: 'Dashboard', active: false },
        { href: '/admin/add-shop', label: 'Manage Shops', active: false },
        { href: '/admin/manage-delivery-people', label: 'Manage delivery People', active: false },
        { href: '/admin/view-all-orders', label: 'View All Orders', active: true },
        { href: '/admin/report', label: 'Reports', active: false },
        { href: '/admin/settings', label: 'Settings', active: false },
    ];
    
    return (
        <div className="dashboard-container">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="admin-panel-title">Admin Panel</div>
                <nav>
                    <ul className="nav-list">
                        {navItems.map((item) => (
                            <li key={item.href} className="nav-item">
                                <Link
                                    href={item.href}
                                    className={`nav-link ${item.active ? 'active' : ''}`}
                                >
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                        <li>
                            <button
                                // onClick={handleLogout} // Assumes logout function is available
                                className="logout-btn"
                            >
                                Logout
                            </button>
                        </li>
                    </ul>
                </nav>
            </aside>

            {/* Main Content Area */}
            <div className="main-content">
                <div className="content-wrapper">
                    {/* Header */}
                    <header className="dashboard-header">
                        <h1 className="header-title">All System Orders</h1>
                        <div className="welcome-message">Welcome, <span className="welcome-username">Admin</span>!</div>
                    </header>

                    {/* Alert Messages */}
                    {errorMessage && (
                        <div className="error-message">
                            <strong>Error!</strong>
                            <span>{errorMessage}</span>
                        </div>
                    )}
                    {successMessage && (
                        <div className="success-message">
                            <strong>Success!</strong>
                            <span>{successMessage}</span>
                        </div>
                    )}

                    {/* Table Container */}
                    <div className="orders-table-container">
                        {loading ? (
                            <p className="loading-message">Loading orders...</p>
                        ) : orders.length === 0 ? (
                            <p className="no-orders-message">No orders found in the system.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="orders-table">
                                    <thead>
                                        <tr>
                                            <th>Order ID</th>
                                            <th>Order Date</th>
                                            <th>Shop Name</th>
                                            <th>Shop Address</th>
                                            <th>Items Summary</th>
                                            <th>Total Amount</th>
                                            <th>Delivery Person</th>
                                            <th>Status</th>
                                            <th>Expected Delivery</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.map((order) => (
                                            <tr key={order.order_id}>
                                                <td>{order.order_id}</td>
                                                <td>{formattedDate(order.order_date)}</td>
                                                <td>{order.shop_name}</td>
                                                <td>{order.shop_address}</td>
                                                <td>{order.order_items_summary || 'N/A'}</td>
                                                <td>${order.total_amount.toFixed(2)}</td>
                                                <td>{order.delivery_person_name || 'Unassigned'}</td>
                                                <td>
                                                    <span className={`status-badge ${getStatusBadgeClass(order.status)}`}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td>{order.expected_delivery_date || 'N/A'}</td>
                                                <td>
                                                    {order.status === 'Pending' && (
                                                        <button
                                                            onClick={() => handleConfirm(order.order_id)}
                                                            className="action-button confirm-button"
                                                        >
                                                            Confirm Order
                                                        </button>
                                                    )}
                                                    {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
                                                        <button
                                                            onClick={() => handleCancel(order.order_id)}
                                                            className="action-button cancel-button"
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
