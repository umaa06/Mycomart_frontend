'use client';
import React, { useState } from 'react';

// The main App component that contains the entire application.
const App = () => {
  // State to manage which page is currently active.
  const [activePage, setActivePage] = useState('Dashboard');

  // Renders the main content based on the active page.
  const renderContent = () => {
    switch (activePage) {
      case 'Dashboard':
        return <DeliveryDashboardContent />;
      case 'Delivery History':
        return <DeliveryHistoryContent />;
      case 'Customer Ratings':
        return <CustomerRatingsContent />;
      default:
        return <DeliveryDashboardContent />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F0EAD6] font-sans">
      <SidePanel activePage={activePage} setActivePage={setActivePage} />
      <main className="flex-1 p-8 relative">
        <div className="absolute top-8 right-8 text-black text-sm">
          Welcome Deliver
        </div>
        <div className="absolute inset-0 z-0 overflow-hidden rounded-xl">
          <img
            src="/public/background.jpg"
            alt="Background of various mushrooms"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="relative z-10">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

// Component for the side navigation panel.
const SidePanel = ({ activePage, setActivePage }) => {
  const navItems = [
    'Dashboard',
    'Delivery History',
    'Customer Ratings',
  ];

  return (
    <nav className="w-64 bg-white bg-opacity-80 p-6 shadow-lg rounded-r-3xl">
      <h2 className="text-2xl font-bold mb-8 text-[#5C4533]">Delivery Panel</h2>
      <ul>
        {navItems.map((item) => (
          <li key={item} className="mb-4">
            <button
              onClick={() => setActivePage(item)}
              className={`w-full text-left px-4 py-2 rounded-xl transition-colors duration-200 ease-in-out ${
                activePage === item
                  ? 'bg-[#EAD8B4] text-[#5C4533] font-bold shadow-md'
                  : 'text-[#5C4533] hover:bg-gray-200'
              }`}
            >
              {item}
            </button>
          </li>
        ))}
        <li className="mb-4 mt-8">
          <button
            onClick={() => setActivePage('Logout')}
            className="w-full text-left px-4 py-2 rounded-xl text-red-500 hover:bg-red-100 transition-colors duration-200 ease-in-out font-bold"
          >
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
};

// Component for the Delivery Dashboard content.
const DeliveryDashboardContent = () => {
  return (
    <>
      <h1 className="text-4xl font-bold mb-8 text-[#5C4533]">Delivery Dashboard</h1>
      <div className="space-y-6">
        <StatusCard
          title="Available Orders to Accept"
          message="No new orders are currently available for assignment"
        />
        <StatusCard
          title="Your Assigned Deliveries"
          message="No active deliveries assigned to you at this time."
        />
      </div>
    </>
  );
};

// A reusable component for displaying a status message.
const StatusCard = ({ title, message }) => {
  return (
    <div className="bg-white bg-opacity-80 p-6 rounded-3xl shadow-lg transition-transform transform hover:scale-105">
      <h3 className="text-lg font-bold text-[#5C4533] mb-4">{title}</h3>
      <p className="text-center text-gray-600 italic">{message}</p>
    </div>
  );
};

// Placeholder components for other pages to demonstrate navigation.
const DeliveryHistoryContent = () => <div className="p-8 text-center text-gray-500 text-lg">Delivery History Content (Placeholder)</div>;
const CustomerRatingsContent = () => <div className="p-8 text-center text-gray-500 text-lg">Customer Ratings Content (Placeholder)</div>;

export default App;