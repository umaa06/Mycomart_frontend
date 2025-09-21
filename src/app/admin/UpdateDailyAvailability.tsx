'use client';

import React, { useState, useEffect } from 'react';

// Mock data to simulate fetching products from a backend
const mockProducts = [
  { product_id: 'shiitake', product_name: 'Shiitake' },
  { product_id: 'portobello', product_name: 'Portobello' },
  { product_id: 'cremini', product_name: 'Cremini' },
  { product_id: 'oyster', product_name: 'Oyster' },
  { product_id: 'lionmane', product_name: "Lion's Mane" },
];

const DailyAvailability = () => {
  const [formData, setFormData] = useState({
    product_id: '',
    quantity_available: '',
    available_date: new Date().toISOString().slice(0, 10), // Set to today's date
  });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Simulate a logged-in admin user
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Simulate fetching products from the database
  useEffect(() => {
    setTimeout(() => {
      if (isLoggedIn) {
        if (mockProducts.length === 0) {
          setErrorMessage("No active mushroom products found. Please add products first.");
        } else {
          setProducts(mockProducts);
        }
        setLoading(false);
      } else {
        setLoading(false);
        setErrorMessage('You must be logged in as an administrator to view this page.');
      }
    }, 1000);
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
    setSuccessMessage('Updating availability...');

    // Simulate an API call to save the daily availability
    setTimeout(() => {
      // In a real application, you'd send formData to a backend endpoint here.
      console.log("Simulating save with data:", formData);
      setSuccessMessage('Availability updated successfully!');
      clearMessages();
    }, 1500);
  };

  if (!isLoggedIn) {
    return (
      <div className="flex min-h-screen bg-[#D5CDB5] items-center justify-center">
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
            <li><a href="#" className="block px-4 py-3 rounded-lg hover:bg-[#EAE2CE] transition-colors duration-200">Dashboard</a></li>
            <li><a href="#" className="block px-4 py-3 rounded-lg hover:bg-[#EAE2CE] transition-colors duration-200">Manage Shops</a></li>
            <li><a href="#" className="block px-4 py-3 rounded-lg hover:bg-[#EAE2CE] transition-colors duration-200">Manage Delivery People</a></li>
            <li><a href="#" className="block px-4 py-3 rounded-lg hover:bg-[#EAE2CE] transition-colors duration-200">View All Orders</a></li>
            <li><a href="#" className="block px-4 py-3 rounded-lg hover:bg-[#EAE2CE] transition-colors duration-200">Reports</a></li>
            <li><a href="#" className="block px-4 py-3 rounded-lg hover:bg-[#EAE2CE] transition-colors duration-200">Customer Ratings</a></li>
            <li><a href="#" className="block px-4 py-3 rounded-lg hover:bg-[#EAE2CE] transition-colors duration-200">Settings</a></li>
            <li><a href="#" className="block px-4 py-3 rounded-lg text-red-600 hover:text-red-700 transition-colors duration-200">Logout</a></li>
          </ul>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 p-10 relative overflow-auto">
        {/* Background Image Container */}
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: "url('/background')" }}></div>
          <div className="absolute inset-0 bg-white opacity-60"></div>
        </div>

        <div className="relative z-10 flex flex-col min-h-full">
          {/* Header */}
          <header className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-extrabold text-gray-900">Update Daily Availabilty</h1>
            <div className="text-xl font-semibold">Welcome Admin</div>
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
            <div className="text-center p-10 text-gray-600 font-medium">Loading products...</div>
          ) : (
            <div className="bg-white bg-opacity-80 p-8 rounded-lg shadow-xl max-w-2xl mx-auto my-auto">
              <p className="text-md text-gray-700 mb-6">
                Enter the quantity of each mushroom type available for today. If an entry for today already exists for a product, it will be updated.
              </p>
              {products.length === 0 ? (
                <div className="text-center text-gray-600 py-8">
                  <p>No active mushroom products are available to update. Please add products first.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="product_id" className="block text-sm font-medium text-gray-700 mb-1">Mushroom Type:</label>
                    <select
                      id="product_id"
                      name="product_id"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      value={formData.product_id}
                      onChange={handleInputChange}
                    >
                      <option value="">Select a Mushroom Product</option>
                      {products.map((product) => (
                        <option key={product.product_id} value={product.product_id}>{product.product_name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="quantity_available" className="block text-sm font-medium text-gray-700 mb-1">Quantity Available for Today:</label>
                    <input
                      type="number"
                      id="quantity_available"
                      name="quantity_available"
                      min="0"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      placeholder="e.g., 500"
                      value={formData.quantity_available}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div>
                    <label htmlFor="available_date" className="block text-sm font-medium text-gray-700 mb-1">Date:</label>
                    <input
                      type="date"
                      id="available_date"
                      name="available_date"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      value={formData.available_date}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="flex justify-center pt-4">
                    <button type="submit" className="w-48 px-6 py-3 bg-[#8B7E66] text-white font-semibold rounded-lg shadow-md hover:bg-[#6F6451] transition-colors duration-200">
                      Update Availability
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DailyAvailability;
