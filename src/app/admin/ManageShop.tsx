'use client';

import React, { useState, useEffect } from 'react';

// Mock data to simulate fetching shops from a database
// This is structured to match the data fetched by the PHP script
const mockShops = [
  {
    shop_id: 'SHOP001',
    shop_name: 'Green Farms',
    address: '123 Forest Lane, Mushroom City',
    phone_number: '555-1234',
    contact_person: 'Alice Green',
    previous_day_stock: 150,
    previous_day_sales: 45.50,
    username: 'green_farms',
    email: 'green.farms@example.com',
  },
  {
    shop_id: 'SHOP002',
    shop_name: 'Fungi Funhouse',
    address: '456 Mossy Path, Fungus Town',
    phone_number: '555-5678',
    contact_person: 'Bob Fungi',
    previous_day_stock: 200,
    previous_day_sales: 75.00,
    username: 'fungi_funhouse',
    email: 'bob.fungi@example.com',
  },
  {
    shop_id: 'SHOP003',
    shop_name: 'Mushroom Market',
    address: '789 Spore Street, Myco Village',
    phone_number: '555-9012',
    contact_person: 'Charlie Market',
    previous_day_stock: 80,
    previous_day_sales: 20.00,
    username: 'mushroom_market',
    email: 'charlie.market@example.com',
  },
];

const ManageShops = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Simulate fetching data from an API
  useEffect(() => {
    setTimeout(() => {
      setShops(mockShops);
      setLoading(false);
      // Simulate success/error messages from URL parameters
      const params = new URLSearchParams(window.location.search);
      const message = params.get('message');
      if (message) {
        switch (message) {
          case 'shop_added':
            setSuccessMessage('Shop registered successfully!');
            break;
          case 'shop_updated':
            setSuccessMessage('Shop details updated successfully!');
            break;
          case 'shop_deleted':
            setSuccessMessage('Shop deleted successfully!');
            break;
          case 'error':
            setErrorMessage('An error occurred during the operation.');
            break;
          case 'delete_error':
            setErrorMessage('Failed to delete shop. Please try again.');
            break;
          default:
            break;
        }
        // Clear the message after a few seconds
        setTimeout(() => {
          setSuccessMessage('');
          setErrorMessage('');
        }, 3000);
      }
    }, 1000);
  }, []);

  const handleDeleteShop = (shopId) => {
    if (window.confirm('Are you sure you want to delete this shop and its associated user account? This action cannot be undone.')) {
      // In a real app, you would make an API call to delete the shop
      // For this mock, we'll filter out the deleted shop
      setShops(prevShops => prevShops.filter(shop => shop.shop_id !== shopId));
      setSuccessMessage('Shop deleted successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };
  
  // Navigation Links
  const navLinks = [
    { name: 'Dashboard', href: '/admin/dashboard' },
    { name: 'Manage Shops', href: '/admin/manage-shops', active: true },
    { name: 'Manage Delivery People', href: '/admin/add-delivery-person' },
    { name: 'View All Orders', href: '/admin/view-all-orders' },
    { name: 'Reports', href: '#' },
    { name: 'Settings', href: '#' },
    { name: 'Logout', href: '#', isLogout: true },
  ];

  return (
    <div className="flex min-h-screen bg-[#D5CDB5] text-gray-800 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-[#C2B79A] p-6 shadow-xl flex-shrink-0">
        <div className="text-2xl font-bold mb-8">Admin Panel</div>
        <nav>
          <ul className="space-y-4">
            {navLinks.map((link) => (
              <li key={link.name}>
                <a
                  href={link.href}
                  className={`block px-4 py-3 rounded-lg transition-colors duration-200 ${
                    link.active
                      ? 'bg-[#EAE2CE] text-gray-800 font-bold'
                      : 'hover:bg-[#EAE2CE]'
                  } ${link.isLogout ? 'text-red-600 hover:text-red-700' : ''}`}
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 p-10 relative overflow-auto">
        {/* Background Image Container */}
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: "url('https://placehold.co/1200x800/8B7E66/FFFFFF?text=MUSHROOMS')" }}></div>
          <div className="absolute inset-0 bg-white opacity-60"></div>
        </div>
        
        <div className="relative z-10 flex flex-col min-h-full">
          {/* Header */}
          <header className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-extrabold text-gray-900">Manage Shops</h1>
            <a href="/admin/add-shop" className="inline-block px-6 py-3 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
              Register New Shop
            </a>
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

          {/* Table Container */}
          <div className="bg-white bg-opacity-80 shadow-xl rounded-lg overflow-hidden">
            {loading ? (
              <p className="p-6 text-center text-gray-600">Loading shops...</p>
            ) : shops.length === 0 ? (
              <p className="p-6 text-center text-gray-600">No shops registered yet. Click "Register New Shop" to add one.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shop Name</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Person</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prev. Stock</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prev. Sales</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {shops.map((shop) => (
                      <tr key={shop.shop_id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{shop.shop_name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{shop.username}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{shop.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{shop.contact_person}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{shop.phone_number}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{shop.address}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{shop.previous_day_stock}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">${shop.previous_day_sales.toFixed(2)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <a href={`/edit_shop?id=${shop.shop_id}`} className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-2">
                            Edit
                          </a>
                          <button
                            onClick={() => handleDeleteShop(shop.shop_id)}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageShops;
