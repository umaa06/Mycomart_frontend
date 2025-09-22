import { useState, useEffect } from 'react';
import Link from 'next/link';
import './Report.css';

// Mock data to simulate the backend API response for total sales
const mockTotalSalesData = [
    { sales_month: '2024-01', monthly_sales: 15000.50 },
    { sales_month: '2024-02', monthly_sales: 18500.75 },
    { sales_month: '2024-03', monthly_sales: 22000.00 },
    { sales_month: '2024-04', monthly_sales: 25000.25 },
    { sales_month: '2024-05', monthly_sales: 28000.90 },
    { sales_month: '2024-06', monthly_sales: 31000.50 },
    { sales_month: '2024-07', monthly_sales: 35000.00 },
];

const AdminReportsPage = () => {
    const [totalSalesOverTime, setTotalSalesOverTime] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Simulate fetching data on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Simulate a network delay
                await new Promise(resolve => setTimeout(resolve, 500));
                setTotalSalesOverTime(mockTotalSalesData);
            } catch (err) {
                setError('Failed to load reports data.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleLogout = () => {
        // You'll implement the actual logout logic here, such as clearing user session data
        console.log("Logging out...");
    };

    return (
        <div className="dashboard-container">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="admin-panel-title">Admin Panel</div>
                <nav>
                    <ul className="nav-list">
                        <li className="nav-item"><Link href="/admin/admin-dashboard" className="nav-link">Dashboard</Link></li>
                        <li className="nav-item"><Link href="/admin/manage-shops" className="nav-link">Manage Shops</Link></li>
                        <li className="nav-item"><Link href="/admin/manage-delivery-people" className="nav-link">Manage Delivery People</Link></li>
                        <li className="nav-item"><Link href="/admin/view-all-orders" className="nav-link">View All Orders</Link></li>
                        <li className="nav-item"><Link href="/admin/reports" className="nav-link active">Reports</Link></li>
                        <li className="nav-item"><Link href="/admin/settings" className="nav-link">Settings</Link></li>
                        <li className="nav-item">
                            <a href="#" onClick={handleLogout} className="logout-btn">
                                Logout
                            </a>
                        </li>
                    </ul>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="main-content">
                <div className="content-wrapper">
                    <header className="dashboard-header">
                        <h1 className="header-title">Reports</h1>
                    </header>
    
                    {error && (
                        <div className="error-message" role="alert">
                            <strong className="error-title">Error!</strong>
                            <span className="error-text">{error}</span>
                        </div>
                    )}
    
                    {isLoading ? (
                        <p className="loading-text">Loading reports data...</p>
                    ) : (
                        <>
                            <section className="report-section">
                                <h2 className="report-section-title">Total Sales Over Time</h2>
                                <div className="report-card">
                                    {totalSalesOverTime.length === 0 ? (
                                        <p className="coming-soon-text">No sales data available yet.</p>
                                    ) : (
                                        <div className="table-responsive">
                                            <table className="report-table">
                                                <thead>
                                                    <tr>
                                                        <th className="table-header">Month</th>
                                                        <th className="table-header">Total Sales</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {totalSalesOverTime.map((data, index) => (
                                                        <tr key={index} className="table-row">
                                                            <td className="table-data">{data.sales_month}</td>
                                                            <td className="table-data">${data.monthly_sales.toFixed(2)}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            </section>
    
                            <section className="report-section">
                                <h2 className="report-section-title">Sales by Shop (Coming Soon)</h2>
                                <div className="report-card">
                                    <p className="coming-soon-text">This section will display sales performance per shop.</p>
                                </div>
                            </section>
    
                            <section className="report-section">
                                <h2 className="report-section-title">Deliveries per Delivery Person (Coming Soon)</h2>
                                <div className="report-card">
                                    <p className="coming-soon-text">This section will show delivery metrics for each delivery person.</p>
                                </div>
                            </section>
                        </>
                    )}
                </div>
            </main>
        </div>
    );
};

export default AdminReportsPage;