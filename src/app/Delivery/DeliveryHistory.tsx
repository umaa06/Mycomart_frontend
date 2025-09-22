"use client";

import { useState, useEffect } from 'react';
import './DeliveryHistory.css';

// Mock data to simulate the PHP backend's output
const mockDeliveryHistory:DeliveryRecord[] = [
    {
        order_id: 101,
        order_date: '2025-09-18 10:30:00',
        status: 'Delivered',
        total_amount: 55.75,
        expected_delivery_date: '2025-09-19',
        delivery_date: '2025-09-18 14:45:00',
        shop_name: 'Mushroom Mania',
        shop_address: '456 Fungi Rd, Forestville',
        order_items_summary: '2x Portobello, 1x Shiitake',
        delivery_person_id: null,
    },
    {
        order_id: 102,
        order_date: '2025-09-17 08:00:00',
        status: 'Delivered',
        total_amount: 32.50,
        expected_delivery_date: '2025-09-18',
        delivery_date: '2025-09-17 11:00:00',
        shop_name: 'Fresh Harvest',
        shop_address: '789 Green St, Meadow Creek',
        order_items_summary: '1x Oyster Mushroom, 3x Chanterelle',
        delivery_person_id: null,
    },
    {
        order_id: 103,
        order_date: '2025-09-16 14:00:00',
        status: 'Delivered',
        total_amount: 89.99,
        expected_delivery_date: '2025-09-17',
        delivery_date: '2025-09-16 17:20:00',
        shop_name: 'Gourmet Fungi',
        shop_address: '101 Truffle Lane, Truffleton',
        order_items_summary: '4x Truffle Oil, 2x Morel Mushrooms',
        delivery_person_id: null,
    },
];

const DeliveryHistoryPage = () => {
    const [deliveryHistory, setDeliveryHistory] = useState<DeliveryRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    // Simulate fetching data on component mount
    useEffect(() => {
        // In a real app, you would fetch data from an API endpoint here
        // For example:
        // fetch('/api/delivery_history')
        //   .then(res => res.json())
        //   .then(data => {
        //     setDeliveryHistory(data.history);
        //     setIsLoading(false);
        //   })
        //   .catch(err => {
        //     setError('Failed to fetch delivery history.');
        //     setIsLoading(false);
        //   });

        // Using mock data for now
        const fetchHistory = async () => {
            try {
                // Simulate network delay
                await new Promise(resolve => setTimeout(resolve, 500));
                setDeliveryHistory(mockDeliveryHistory);
            } catch (err) {
                setError('Failed to load data.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchHistory();
    }, []);

    const loggedInUsername = "Delivery Person"; // This would come from a real authentication context

    return (
        <div className="delivery-history-container">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="delivery-panel-title">Delivery Panel</div>
                <nav>
                    <ul>
                        <li>
                            <a href="/delivery/delivery-dashboard" className="nav-item-link">
                                Assigned Deliveries
                            </a>
                        </li>
                        <li>
                            <a href="/delivery/delivery-history" className="nav-item-link active">
                                Delivery History
                            </a>
                        </li>
                        <li>
                            <a href="#" className="logout-btn">
                                Logout
                            </a>
                        </li>
                    </ul>
                </nav>
            </aside>

            {/* Main Content */}
            <div className="main-content">
                <header className="main-header">
                    <h1 className="header-title">Delivery History</h1>
                    <div className="welcome-message">
                        Welcome, <span>{loggedInUsername}!</span>
                    </div>
                </header>

                {error && (
                    <div className="alert-message" role="alert">
                        <strong>Error!</strong>
                        <span className="block sm:inline ml-2">{error}</span>
                    </div>
                )}

                <div className="history-table-container">
                    {isLoading ? (
                        <p className="loading-message">Loading delivery history...</p>
                    ) : deliveryHistory.length === 0 ? (
                        <p className="empty-message">No completed deliveries in your history yet.</p>
                    ) : (
                        <table className="history-table">
                            <thead className="table-header">
                                    <tr>
                                        <th scope="col" className="table-th">Order ID</th>
                                        <th scope="col" className="table-th">Order Date</th>
                                        <th scope="col" className="table-th">Shop Name</th>
                                        <th scope="col" className="table-th">Shop Address</th>
                                        <th scope="col" className="table-th">Items Summary</th>
                                        <th scope="col" className="table-th">Total Amount</th>
                                        <th scope="col" className="table-th">Expected Delivery</th>
                                        <th scope="col" className="table-th">Actual Delivery Date</th>
                                        <th scope="col" className="table-th">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {deliveryHistory.map((delivery, index) => (
                                    <tr key={delivery.order_id} className="table-row">
                                        <td className="table-td">{delivery.order_id}</td>
                                        <td className="table-td">{new Date(delivery.order_date).toLocaleString()}</td>
                                        <td className="table-td">{delivery.shop_name}</td>
                                        <td className="table-td">{delivery.shop_address}</td>
                                        <td className="table-td">{delivery.order_items_summary || 'N/A'}</td>
                                        <td className="table-td">${delivery.total_amount.toFixed(2)}</td>
                                        <td className="table-td">{delivery.expected_delivery_date}</td>
                                        <td className="table-td">{new Date(delivery.order_date).toLocaleString()}</td>
                                        <td className="table-td">
                                            <span className="status-badge delivered">
                                                {delivery.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DeliveryHistoryPage;
