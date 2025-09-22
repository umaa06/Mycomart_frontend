"use client";

import { useState, useEffect } from 'react';

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

    return (
        <div className="flex min-h-screen font-inter">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-md h-screen p-6">
                <div className="text-2xl font-bold text-gray-800 mb-8">Admin Panel</div>
                <nav>
                    <ul className="space-y-2">
                        <li><a href="/admin/admin-dashboard" className="nav-link rounded-lg">Dashboard</a></li>
                        <li><a href="/admin/manage-shops" className="nav-link rounded-lg">Manage Shops</a></li>
                        <li><a href="/admin/manage-delivery-people" className="nav-link rounded-lg">Manage Delivery People</a></li>
                        <li><a href="/admin/view-all-orders" className="nav-link rounded-lg">View All Orders</a></li>
                        <li><a href="/admin/report" className="nav-link rounded-lg active">Reports</a></li>
                        <li><a href="/admin/setting" className="nav-link rounded-lg">Settings</a></li>
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
                    <h1 className="text-4xl font-extrabold text-gray-900">Reports</h1>
                </header>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-6" role="alert">
                        <strong className="font-bold">Error!</strong>
                        <span className="block sm:inline ml-2">{error}</span>
                    </div>
                )}

                {isLoading ? (
                    <p className="p-6 text-center text-gray-600">Loading reports data...</p>
                ) : (
                    <>
                        <section className="mb-10">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Total Sales Over Time</h2>
                            <div className="report-card bg-white rounded-lg shadow-md p-6">
                                {totalSalesOverTime.length === 0 ? (
                                    <p className="text-center text-gray-600">No sales data available yet.</p>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50 rounded-t-lg">
                                                <tr>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Sales</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200">
                                                {totalSalesOverTime.map((data, index) => (
                                                    <tr key={index} className="odd:bg-white even:bg-gray-50">
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{data.sales_month}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">${data.monthly_sales.toFixed(2)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </section>

                        <section className="mb-10">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Sales by Shop (Coming Soon)</h2>
                            <div className="report-card bg-white rounded-lg shadow-md p-6">
                                <p className="text-center text-gray-600">This section will display sales performance per shop.</p>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Deliveries per Delivery Person (Coming Soon)</h2>
                            <div className="report-card bg-white rounded-lg shadow-md p-6">
                                <p className="text-center text-gray-600">This section will show delivery metrics for each delivery person.</p>
                            </div>
                        </section>
                    </>
                )}
            </div>
        </div>
    );
};

export default AdminReportsPage;