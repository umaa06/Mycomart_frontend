"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authService } from '@/app/api/authService';
import { dashboardService } from '@/app/api/dashboardService';

import './AdminDashboard.css'; // Import the new CSS file

const AdminDashboard = () => {
  const router = useRouter();
  const userName = localStorage.getItem('userName');
  const adminUsername = userName ? userName : 'Admin';
  const [dashboardData, setDashboardData] = useState({
    totalShops: 0,
    totalDeliveryPeople: 0,
    totalPendingOrders: 0,
    todayAvailableMushrooms: 0
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [sessionMessages, setSessionMessages] = useState({ success: '', error: '' });

  // Simulate fetching dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const dashBoardDetails = await dashboardService.dashboardDetails();
        console.log(dashBoardDetails);

        // Mock data for demonstration
        setDashboardData({
          totalShops: dashBoardDetails.totalShops,
          totalDeliveryPeople: dashBoardDetails.totalDeliveryPersons,
          totalPendingOrders: dashBoardDetails.pendingOrders,
          todayAvailableMushrooms: dashBoardDetails.availableToday
        });
      } catch (error) {
        if (error.status && (error.status === 401 || error.status === 403)) {
          router.push("/");
        }
        setErrorMessage('Failed to load dashboard data');
      }
    };

    fetchDashboardData();
  }, []);

  const handleLogout = () => {
    authService.logout().then(r => {
      router.push('/');
    });
  };

  const SessionMessages = () => {
    if (!sessionMessages.success && !sessionMessages.error) return null;

    return (
      <div className="mb-6">
        {sessionMessages.success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg relative" role="alert">
            <strong className="font-bold">Success!</strong>
            <span className="block sm:inline ml-2">{sessionMessages.success}</span>
          </div>
        )}
        {sessionMessages.error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline ml-2">{sessionMessages.error}</span>
          </div>
        )}
      </div>
    );
  };

  const navItems = [
    { href: '/admin/AdminDashboard', label: 'Dashboard', active: true },
    { href: '/admin/Addshop', label: 'Manage Shops', active: false },
    { href: '/admin/ManageDeliveryPerson', label: 'Manage Delivery People', active: false },
    { href: '/admin/ViewAllORders', label: 'View All Orders', active: false },
    { href: '/admin/Reports', label: 'Reports', active: false },
    { href: '/admin/Settings', label: 'Settings', active: false },
  ];

  const quickActions = [
    {
      href: '/admin/add-shop',
      title: 'Register new Shops',
      description: 'Add new mushroom to the shop'
    },
    {
      href: '/admin/AddDeliveryPerson.tsx',
      title: 'Add Delivery People',
      description: 'On board a new delivery driver'
    },
    {
      href: '/admin/view-all-orders',
      title: 'Review Orders',
      description: 'Check and manage all income orders'
    },
    {
      href: '/admin/UpdateDailyAvailability.tsx',
      title: 'Update Daily Availability',
      description: 'Set available mushroom types'
    }
  ];

  const statsCards = [
    {
      title: 'Total Shops',
      value: dashboardData.totalShops,
      color: 'stats-value'
    },
    {
      title: 'Total Delivery People',
      value: dashboardData.totalDeliveryPeople,
      color: 'stats-value'
    },
    {
      title: 'Pending Orders',
      value: dashboardData.totalPendingOrders,
      color: 'stats-value'
    },
    {
      title: 'Today Mushroom Availability',
      value: `${dashboardData.todayAvailableMushrooms}kg`,
      color: 'stats-value-green'
    }
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
                onClick={handleLogout}
                className="logout-btn"
              >
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="main-content">
        <div className="content-wrapper">
          {/* Header */}
          <header className="dashboard-header">
            <h1 className="header-title">Admin Dashboard</h1>
            <div className="welcome-message">
              Welcome, <span className="welcome-username">{adminUsername}</span>!
            </div>
          </header>

          {/* Session Messages */}
          <SessionMessages />

          {/* Error Message */}
          {errorMessage && (
            <div className="error-message" role="alert">
              <strong>Error!</strong>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Stats Cards */}
          <div className="stats-grid">
            {statsCards.map((card, index) => (
              <div key={index} className="stats-card">
                <h2 className="stats-card-title">{card.title}</h2>
                <p className={`stats-card-value ${card.color}`}>{card.value}</p>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <h2 className="quick-actions-heading">Quick Actions</h2>
          <div className="quick-actions-grid">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                href={action.href}
                className="quick-action-link"
              >
                <h3 className="quick-action-title">{action.title}</h3>
                <p className="quick-action-description">{action.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;