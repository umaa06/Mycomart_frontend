"use client";

import { useState, useEffect } from 'react';

// Mock data to simulate the backend API response
const mockShopData = {
    shop_name: 'The Mushroom Emporium',
    previous_day_stock: 125,
    previous_day_sales: 345.50,
};

const mockTodayRequiredQuantity = 75;
const loggedInUsername = "Shop Owner"; // In a real app, this would come from a user context

const ShopDashboardPage = () => {
    const [shopData, setShopData] = useState({});
    const [todayRequiredQuantity, setTodayRequiredQuantity] = useState('N/A');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Simulate fetching data on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Simulate a network delay
                await new Promise(resolve => setTimeout(resolve, 500));
                setShopData(mockShopData);
                setTodayRequiredQuantity(mockTodayRequiredQuantity);
            } catch (err) {
                setError('Failed to load dashboard data.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="flex min-h-screen font-inter">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-md h-screen p-6">
                <div className="text-2xl font-bold text-gray-800 mb-8">Shop Panel</div>
                <nav>
                    <ul className="space-y-2">
                        <li>
                            <a href="/shop/dashboard" className="nav-link rounded-lg active">
                                Dashboard
                            </a>
                        </li>
                        <li>
                            <a href="/shop/update_daily_info" className="nav-link rounded-lg">
                                Update Daily Info
                            </a>
                        </li>
                        <li>
                            <a href="/shop/order_history" className="nav-link rounded-lg">
                                Order History
                            </a>
                        </li>
                        <li>
                            <a href="/shop/profile" className="nav-link rounded-lg">
                                Manage Profile
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
                    <h1 className="text-4xl font-extrabold text-gray-900">Shop Dashboard</h1>
                    <div className="text-lg text-gray-700">
                        Welcome, <span className="font-semibold text-indigo-600">{loggedInUsername}</span>!
                    </div>
                </header>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-6" role="alert">
                        <strong className="font-bold">Error!</strong>
                        <span className="block sm:inline ml-2">{error}</span>
                    </div>
                )}

                {isLoading ? (
                    <p className="p-6 text-center text-gray-600">Loading dashboard data...</p>
                ) : (
                    <>
                        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                            <div className="dashboard-card bg-white rounded-lg shadow-md p-6 text-center">
                                <h3 className="text-lg font-semibold text-gray-600">Previous Day's Stock</h3>
                                <p className="text-5xl font-bold text-indigo-600 mt-2">{shopData.previous_day_stock ?? 'N/A'}</p>
                            </div>
                            <div className="dashboard-card bg-white rounded-lg shadow-md p-6 text-center">
                                <h3 className="text-lg font-semibold text-gray-600">Previous Day's Sales</h3>
                                <p className="text-5xl font-bold text-green-600 mt-2">${(shopData.previous_day_sales ?? 0).toFixed(2)}</p>
                            </div>
                            <div className="dashboard-card bg-white rounded-lg shadow-md p-6 text-center">
                                <h3 className="text-lg font-semibold text-gray-600">Today's Required Quantity</h3>
                                <p className="text-5xl font-bold text-blue-600 mt-2">{todayRequiredQuantity}</p>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Quick Actions</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <a href="/shop/update_daily_info" className="dashboard-card bg-white hover:bg-indigo-50 transition-colors duration-200">
                                    <p className="text-xl font-semibold text-indigo-700">Update Daily Info</p>
                                    <p className="text-gray-500 text-sm mt-1">Report yesterday's stock/sales and request today's quantity.</p>
                                </a>
                                <a href="/shop/order_history" className="dashboard-card bg-white hover:bg-indigo-50 transition-colors duration-200">
                                    <p className="text-xl font-semibold text-indigo-700">View Order History</p>
                                    <p className="text-gray-500 text-sm mt-1">Review your past and current orders.</p>
                                </a>
                                <a href="/shop/profile" className="dashboard-card bg-white hover:bg-indigo-50 transition-colors duration-200">
                                    <p className="text-xl font-semibold text-indigo-700">Manage Profile</p>
                                    <p className="text-gray-500 text-sm mt-1">Update your shop's contact details.</p>
                                </a>
                            </div>
                        </section>
                    </>
                )}
            </div>
        </div>
    );
};

export default ShopDashboardPage;
