'use client';

import React, { useState, useEffect } from 'react';

// This is a mock data object to simulate what would be fetched from a database.
const mockSettings = {
  default_delivery_charge: 5.50,
  business_name: 'The Mushroom Emporium',
  business_address: '101 Fungi Lane, Mycotopia, 12345',
  business_phone: '+1 (555) 123-4567',
  business_email: 'info@mushroomemporium.com'
};

const AdminSettings = () => {
  const [formData, setFormData] = useState({
    default_delivery_charge: 0.00,
    business_name: '',
    business_address: '',
    business_phone: '',
    business_email: ''
  });
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Simulate a logged-in admin user
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Simulating data fetch from a backend
  useEffect(() => {
    // In a real application, you would fetch data here from your API
    // and check for authentication. We simulate both with a delay.
    setTimeout(() => {
      if (isLoggedIn) {
        setFormData(mockSettings);
        setLoading(false);
      } else {
        setLoading(false);
        setErrorMessage('You must be logged in as an administrator to view this page.');
      }
    }, 1000); // Simulate network delay
  }, [isLoggedIn]);

  const handleInputChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const clearMessages = () => {
    setTimeout(() => {
      setSuccessMessage('');
      setErrorMessage('');
    }, 3000);
  };

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setSuccessMessage('Saving settings...');

    // Simulate an API call to save settings
    setTimeout(() => {
      // In a real app, you'd send formData to a backend endpoint here.
      // E.g., fetch('/api/settings', { method: 'POST', body: JSON.stringify(formData) })
      console.log("Simulating save with data:", formData);
      setSuccessMessage('Settings updated successfully!');
      setErrorMessage('');
      clearMessages();
    }, 1500); // Simulate network delay
  };

  if (!isLoggedIn) {
    return (
      <div className="flex min-h-screen bg-[#F0E6D9] items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-xl text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
          <p className="text-gray-700">You must be logged in as an admin to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#D5CDB5] text-gray-800 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-[#C2B79A] p-6 shadow-xl flex-shrink-0">
        <div className="text-2xl font-bold mb-8">Admin Panel</div>
        <nav>
          <ul className="space-y-4">
            <li><a href="#" className="block px-4 py-3 rounded-lg hover:bg-[#D5CDB5] transition-colors duration-200">Dashboard</a></li>
            <li><a href="#" className="block px-4 py-3 rounded-lg hover:bg-[#D5CDB5] transition-colors duration-200">Manage Shops</a></li>
            <li><a href="#" className="block px-4 py-3 rounded-lg hover:bg-[#D5CDB5] transition-colors duration-200">Manage Delivery People</a></li>
            <li><a href="#" className="block px-4 py-3 rounded-lg hover:bg-[#D5CDB5] transition-colors duration-200">View All Orders</a></li>
            <li><a href="#" className="block px-4 py-3 rounded-lg hover:bg-[#D5CDB5] transition-colors duration-200">Reports</a></li>
            <li><a href="#" className="block px-4 py-3 rounded-lg hover:bg-[#D5CDB5] transition-colors duration-200">Customer Ratings</a></li>
            <li><a href="#" className="block px-4 py-3 rounded-lg bg-[#EAE2CE] font-bold text-gray-900">Settings</a></li>
            <li><a href="#" className="block px-4 py-3 rounded-lg text-red-600 hover:text-red-700 transition-colors duration-200">Logout</a></li>
          </ul>
        </nav>
      </aside>
      
      {/* Main Content Area */}
      <div className="flex-1 p-10 relative overflow-auto">
        {/* Background Image Container */}
        <div className="absolute inset-0 z-0">
          {/* Using a placeholder as a background image to mimic the prototype */}
          <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: "url('/public/backgroung.jpg')" }}></div>
          <div className="absolute inset-0 bg-white opacity-60"></div>
        </div>

        <div className="relative z-10 flex flex-col min-h-full">
          {/* Header */}
          <header className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-extrabold text-gray-900">Settings</h1>
            <div className="text-xl font-semibold">Welcome Admin!</div>
          </header>

          {/* Alert Messages */}
          {errorMessage && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-6" role="alert">
              <strong className="font-bold">Error!</strong>
              <span className="block sm:inline ml-2">{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg relative mb-6" role="alert">
              <strong className="font-bold">Success!</strong>
              <span className="block sm:inline ml-2">{successMessage}</span>
            </div>
          )}

          {/* Form Container */}
          {loading ? (
            <div className="text-center p-10 text-gray-600 font-medium">Loading settings...</div>
          ) : (
            <div className="bg-white bg-opacity-80 p-8 rounded-lg shadow-xl max-w-2xl mx-auto my-auto">
              <form onSubmit={handleSubmit} className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800">General Settings</h2>
                <div>
                  <label htmlFor="default_delivery_charge" className="block text-sm font-medium text-gray-700 mb-1">Default Delivery Charge</label>
                  <input
                    type="number"
                    id="default_delivery_charge"
                    name="default_delivery_charge"
                    step="0.01"
                    min="0"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    value={formData.default_delivery_charge}
                    onChange={handleInputChange}
                  />
                </div>
                
                <h2 className="text-2xl font-bold text-gray-800 pt-4 border-t border-gray-300">Business Details (for Invoices/Emails)</h2>
                <div>
                  <label htmlFor="business_name" className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
                  <input
                    type="text"
                    id="business_name"
                    name="business_name"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    value={formData.business_name}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label htmlFor="business_address" className="block text-sm font-medium text-gray-700 mb-1">Business Address</label>
                  <textarea
                    id="business_address"
                    name="business_address"
                    rows={3}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    value={formData.business_address}
                    onChange={handleInputChange}
                  ></textarea>
                </div>
                <div>
                  <label htmlFor="business_phone" className="block text-sm font-medium text-gray-700 mb-1">Business Phone</label>
                  <input
                    type="tel"
                    id="business_phone"
                    name="business_phone"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    value={formData.business_phone}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label htmlFor="business_email" className="block text-sm font-medium text-gray-700 mb-1">Business Email</label>
                  <input
                    type="email"
                    id="business_email"
                    name="business_email"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    value={formData.business_email}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="flex justify-center pt-4">
                  <button type="submit" className="w-48 px-6 py-3 bg-[#8B7E66] text-white font-semibold rounded-lg shadow-md hover:bg-[#6F6451] transition-colors duration-200">
                    Save Settings
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
