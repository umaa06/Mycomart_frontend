"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {authService} from '@/app/api/authService';
import {dashboardService} from '@/app/api/dashboardService';

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
        console.log(dashBoardDetails)
        
        // Mock data for demonstration
        setDashboardData({
          totalShops: dashBoardDetails.totalShops,
          totalDeliveryPeople: dashBoardDetails.totalDeliveryPersons,
          totalPendingOrders: dashBoardDetails.pendingOrders,
          todayAvailableMushrooms: dashBoardDetails.availableToday
        });
      } catch (error) {
        if(error.status && (error.status === 401 || error.status === 403)){
          router.push("/");
        }
        setErrorMessage('Failed to load dashboard data');
      }
    };

    fetchDashboardData();
  }, []);

  const handleLogout = () => {
    authService.logout().then(r=>{
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
      icon: '🛍️',
      title: 'Register New Shop',
      description: 'Add a new mushroom shop to the system.'
    },
    {
      href: '/admin/AddDeliveryPerson.tsx',
      icon: '🚴',
      title: 'Add Delivery Person',
      description: 'Onboard a new delivery driver.'
    },
    {
      href: '/admin/view-all-orders',
      icon: '📋',
      title: 'Review Orders',
      description: 'Check and manage all incoming orders.'
    },
    {
      href: '/admin/UpdateDailyAvailability.tsx',
      icon: '📈',
      title: 'Update Daily Availability',
      description: 'Set available mushroom types and quantities for the day.'
    }
  ];

  const statsCards = [
    {
      title: 'Total Shops',
      value: dashboardData.totalShops,
      color: 'text-blue-600'
    },
    {
      title: 'Total Delivery People',
      value: dashboardData.totalDeliveryPeople,
      color: 'text-purple-600'
    },
    {
      title: 'Pending Orders',
      value: dashboardData.totalPendingOrders,
      color: 'text-indigo-600'
    },
    {
      title: 'Mushrooms Available Today',
      value: `${dashboardData.todayAvailableMushrooms} kg`,
      color: 'text-green-600',
      subtitle: 'Total quantity available for current date.'
    }
  ];

  return (
    <div className="flex min-h-screen bg-gray-100" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md h-screen p-6">
        <div className="text-2xl font-bold text-gray-800 mb-8">Admin Panel</div>
        <nav>
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link 
                  href={item.href}
                  className={`block px-4 py-3 rounded-lg transition-all duration-200 ${
                    item.active 
                      ? 'bg-indigo-600 text-white font-semibold' 
                      : 'text-gray-700 hover:bg-indigo-100 hover:text-indigo-600'
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-3 rounded-lg text-red-600 hover:bg-red-100 hover:text-red-700 transition-all duration-200"
              >
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-10">
        {/* Header */}
        <header className="flex justify-between items-center pb-8 border-b border-gray-200 mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900">Admin Dashboard</h1>
          <div className="text-lg text-gray-700">
            Welcome, <span className="font-semibold text-indigo-600">{adminUsername}</span>!
          </div>
        </header>

        {/* Session Messages */}
        <SessionMessages />

        {/* Error Message */}
        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-6" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline ml-2">{errorMessage}</span>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {statsCards.map((card, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6 text-center">
              <h2 className="text-xl font-semibold text-gray-700 mb-2">{card.title}</h2>
              <p className={`text-5xl font-bold ${card.color} mb-2`}>{card.value}</p>
              {card.subtitle && (
                <p className="text-gray-500 text-sm">{card.subtitle}</p>
              )}
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickActions.map((action, index) => (
            <Link 
              key={index}
              href={action.href}
              className="bg-white rounded-xl shadow-lg p-6 text-center transition-all duration-200 hover:transform hover:-translate-y-1 hover:shadow-xl flex flex-col items-center justify-center"
            >
              <span className="text-indigo-500 text-4xl mb-2">{action.icon}</span>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{action.title}</h3>
              <p className="text-sm text-gray-600">{action.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
