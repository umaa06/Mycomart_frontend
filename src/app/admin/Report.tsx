'use client';

import React from 'react';
import './Report.css'; // Import the new CSS file

const Report = () => {
  const handleLogout = () => {
    // You'll implement the actual logout logic here, such as clearing user session data
    console.log("Logging out...");
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
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Report;