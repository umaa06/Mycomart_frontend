"use client";

import { useState, useEffect } from 'react';

// Mock data to simulate the PHP backend's output
const mockDeliveryHistory = [
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
        <div className="flex min-h-screen font-inter">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-md h-screen p-6">
                <div className="text-2xl font-bold text-gray-800 mb-8">Delivery Panel</div>
                <nav>
                    <ul className="space-y-2">
                        <li>
                            <a href="/delivery/delivery-dashboard" className="nav-link rounded-lg">
                                Assigned Deliveries
                            </a>
                        </li>
                        <li>
                            <a href="/delivery/delivery-history" className="nav-link rounded-lg active">
                                Delivery History
                            </a>
                        </li>
                        <li>
                            <a href="#" className="nav-link rounded-lg text-red-600 hover:bg-red-100 hover:text-red-700">
                                Logout
                            </a>
                        </li>
                    </ul>
                </nav>
            </aside>

            {/* Main Content */}
            <div className="flex-1 p-10 bg-gray-100">
                <header className="flex justify-between items-center pb-8 border-b border-gray-200 mb-8">
                    <h1 className="text-4xl font-extrabold text-gray-900">Delivery History</h1>
                    <div className="text-lg text-gray-700">
                        Welcome, <span className="font-semibold text-indigo-600">{loggedInUsername}!</span>
                    </div>
                </header>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-6" role="alert">
                        <strong className="font-bold">Error!</strong>
                        <span className="block sm:inline ml-2">{error}</span>
                    </div>
                )}

                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    {isLoading ? (
                        <p className="p-6 text-center text-gray-600">Loading delivery history...</p>
                    ) : deliveryHistory.length === 0 ? (
                        <p className="p-6 text-center text-gray-600">No completed deliveries in your history yet.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Date</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shop Name</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shop Address</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items Summary</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Amount</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expected Delivery</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actual Delivery Date</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {deliveryHistory.map((delivery, index) => (
                                        <tr key={delivery.order_id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{delivery.order_id}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{new Date(delivery.order_date).toLocaleString()}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{delivery.shop_name}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600 max-w-xs overflow-hidden text-ellipsis">{delivery.shop_address}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600 max-w-xs overflow-hidden text-ellipsis">{delivery.order_items_summary || 'N/A'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">${delivery.total_amount.toFixed(2)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{delivery.expected_delivery_date}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{new Date(delivery.delivery_date).toLocaleString()}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                    {delivery.status}
                                                </span>
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
    );
};

export default DeliveryHistoryPage;
