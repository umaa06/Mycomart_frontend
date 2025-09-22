"use client";

import { useState, useEffect } from 'react';

// Mock data to simulate the profile data fetched from an API
const MOCK_SHOP_DATA = {
  shop_name: "AGND",
  contact_person: "Nawodya",
  address: "Nawalapitiya",
  phone_number: "0774589125",
  username: "nawodya",
  email: "nawodya@gmail.com",
};

export default function ShopProfilePage() {
  const [shopData, setShopData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulate API call with a delay
    const fetchProfile = async () => {
      try {
        setLoading(true);
        // In a real application, you would fetch data from an API endpoint.
        // const response = await fetch("/api/shop/profile");
        // const data = await response.json();
        
        // Using mock data for this example
        await new Promise(resolve => setTimeout(resolve, 500));
        setShopData(MOCK_SHOP_DATA);

      } catch (e) {
        setError("Failed to load profile data.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Helper function to render a single profile detail row
  const renderDetail = (label, value) => (
    <div className="flex justify-between items-start py-2 border-b border-gray-200">
      <span className="font-medium text-gray-700">{label}:</span>
      <span className="text-gray-900 text-right max-w-md">{value}</span>
    </div>
  );

  return (
    // Main container with a flex layout and a background image from the prototype
    <div 
      className="flex min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: 'url(https://placehold.co/1920x1080/f0f0f0/cccccc?text=)', 
        backgroundAttachment: 'fixed' 
      }}
    >
      {/* Sidebar - Positioned on the left side */}
      <div className="w-64 p-6 bg-white/70 backdrop-blur-sm shadow-xl rounded-r-2xl h-screen sticky top-0 overflow-y-auto">
        <h2 className="text-xl font-bold text-gray-800 mb-8 border-b pb-4">Shop Panel</h2>
        
        {/* Navigation links */}
        <nav className="space-y-4 text-gray-700 font-medium">
          <a href="/shop/dashboard" className="block p-3 rounded-lg hover:bg-gray-200 transition-colors">
            Dashboard
          </a>
          <a href="/shop/update_info" className="block p-3 rounded-lg hover:bg-gray-200 transition-colors">
            Update Daily Info
          </a>
          <a href="/shop/order_history" className="block p-3 rounded-lg hover:bg-gray-200 transition-colors">
            Order History
          </a>
          <a href="/shop/profile" className="block p-3 rounded-lg bg-yellow-400 text-yellow-900 shadow-md">
            Manage Profile
          </a>
        </nav>
        <div className="mt-8 pt-4 border-t border-gray-300">
          <a href="/logout" className="block text-red-600 font-semibold p-3 rounded-lg hover:bg-red-100 transition-colors">
            Logout
          </a>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow p-8">
        <div className="max-w-4xl mx-auto space-y-8 bg-white/70 backdrop-blur-md rounded-2xl shadow-xl p-8">
          
          {/* Header */}
          <header className="flex justify-between items-center pb-8 border-b border-gray-300">
            <h1 className="text-4xl font-extrabold text-gray-900">My Profile</h1>
            <div className="text-lg text-gray-700">
              Welcome, <span className="font-semibold text-indigo-600">{shopData?.username || 'Shop'}</span>!
            </div>
          </header>

          {loading && (
            <div className="flex justify-center items-center h-48">
              <p className="text-lg text-gray-600">Loading profile...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative" role="alert">
              <strong className="font-bold">Error!</strong>
              <span className="block sm:inline ml-2">{error}</span>
            </div>
          )}

          {shopData && (
            <>
              {/* Shop Information Section */}
              <div className="bg-white rounded-lg p-6 shadow-md">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Shop Information</h2>
                <div className="space-y-3">
                  {renderDetail("Shop Name", shopData.shop_name)}
                  {renderDetail("Contact Person", shopData.contact_person)}
                  {renderDetail("Address", shopData.address)}
                  {renderDetail("Phone Number", shopData.phone_number)}
                </div>
              </div>

              {/* Login Details Section */}
              <div className="bg-white rounded-lg p-6 shadow-md">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Login Details</h2>
                <div className="space-y-3">
                  {renderDetail("Username", shopData.username)}
                  {renderDetail("Email", shopData.email)}
                </div>
                <div className="mt-6 text-center">
                  <a 
                    href="/shop/edit_profile" 
                    className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors duration-200"
                  >
                    Edit Profile Details
                  </a>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}