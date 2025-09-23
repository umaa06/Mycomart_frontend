"use client";

import { useState, useEffect } from 'react';
import './ShopDashboard.css'; // Import the new CSS file

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
        <div className="shop-dashboard-container">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="shop-panel-title">Shop Panel</div>
                <nav>
                    <ul>
                        <li>
                            <a href="/shop/dashboard" className="nav-item-link active">
                                Dashboard
                            </a>
                        </li>
                        <li>
                            <a href="/shop/update_daily_info" className="nav-item-link">
                                Update Daily Info
                            </a>
                        </li>
                        <li>
                            <a href="/shop/order_history" className="nav-item-link">
                                Order History
                            </a>
                        </li>
                        <li>
                            <a href="/shop/profile" className="nav-item-link">
                                Manage Profile
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
                    <h1 className="header-title">Shop Dashboard</h1>
                    <div className="welcome-message">
                        Welcome, <span>{loggedInUsername}</span>!
                    </div>
                </header>

                {error && (
                    <div className="alert-message" role="alert">
                        <strong>Error!</strong>
                        <span className="block sm:inline ml-2">{error}</span>
                    </div>
                )}

                {isLoading ? (
                    <p className="loading-message">Loading dashboard data...</p>
                ) : (
                    <>
                        <section className="grid-cols-3">
                            <div className="dashboard-card">
                                <h3>Previous Day's Stock</h3>
                                <p className="metric-value metric-stock">{shopData.previous_day_stock ?? 'N/A'}</p>
                            </div>
                            <div className="dashboard-card">
                                <h3>Previous Day's Sales</h3>
                                <p className="metric-value metric-sales">${(shopData.previous_day_sales ?? 0).toFixed(2)}</p>
                            </div>
                            <div className="dashboard-card">
                                <h3>Today's Required Quantity</h3>
                                <p className="metric-value metric-quantity">{todayRequiredQuantity}</p>
                            </div>
                        </section>

                        <section>
                            <h2 className="dashboard-section-title">Quick Actions</h2>
                            <div className="grid-cols-2-lg">
                                <a href="/shop/update_daily_info" className="quick-actions-card">
                                    <p className="quick-actions-title">Update Daily Info</p>
                                    <p className="quick-actions-description">Report yesterday's stock/sales and request today's quantity.</p>
                                </a>
                                <a href="/shop/order_history" className="quick-actions-card">
                                    <p className="quick-actions-title">View Order History</p>
                                    <p className="quick-actions-description">Review your past and current orders.</p>
                                </a>
                                <a href="/shop/profile" className="quick-actions-card">
                                    <p className="quick-actions-title">Manage Profile</p>
                                    <p className="quick-actions-description">Update your shop's contact details.</p>
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
