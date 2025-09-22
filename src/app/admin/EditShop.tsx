"use client";
import React, { useState, useEffect } from 'react';

// This would be a 'use client' component in a real Next.js app, as it uses state and effects.
// The following mock functions simulate API calls to a backend.
// In a real application, you would replace these with actual fetch requests to your API routes.

// Mock database to simulate fetching and updating data.
type ShopData = {
  shop_id: string;
  user_id: string;
  shop_name: string;
  address: string;
  phone_number: string;
  contact_person: string;
  previous_day_stock: number;
  previous_day_sales: number;
  username: string;
  email: string;
};

const MOCK_DB: { [key: string]: ShopData } = {
  '1': {
    shop_id: '',
    user_id: '',
    shop_name: '',
    address: '',
    phone_number: '',
    contact_person: '',
    previous_day_stock: 1500,
    previous_day_sales: 800,
    username: '',
    email: '',
  },
};

// Simulates fetching shop data from a backend API.
const fetchShopData = (id: string) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const data = MOCK_DB[id];
      if (data) {
        resolve(data);
      } else {
        reject(new Error('Shop not found.'));
      }
    }, 500); // Simulate network delay
  });
};

// Simulates updating shop data on a backend.
const updateShopData = (id: string, formData: { shopName?: string; contactPerson?: string; address?: string; phoneNumber?: string; username: any; email: any; password?: string; confirmPassword?: string; shop_id?: string; user_id?: string; shop_name?: string; phone_number?: string; contact_person?: string; previous_day_stock?: number; previous_day_sales?: number; }) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate validation for username/email existence.
      if (formData.username === 'existinguser' || formData.email === 'existing@example.com') {
        return reject({ message: 'username_or_email_exists' });
      }
      
      // Simulate a successful update.
      MOCK_DB[id] = { ...MOCK_DB[id], ...formData };
      resolve({ success: true });
    }, 500); // Simulate network delay
  });
};

export default function App() {
  const [shopData, setShopData] = useState<ShopData | null>(null);
  const [formData, setFormData] = useState({
    shopName: '',
    contactPerson: '',
    address: '',
    phoneNumber: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Simulating the shop_id from the URL query parameter.
  const shopId = '1';

  useEffect(() => {
    const loadData = async () => {
      if (!shopId) {
        setErrorMessage('No shop ID specified for editing.');
        setIsLoading(false);
        return;
      }

      try {
        const data = await fetchShopData(shopId);
        setShopData(data as ShopData);
        setFormData({
          shopName: (data as ShopData).shop_name,
          contactPerson: (data as ShopData).contact_person,
          address: (data as ShopData).address,
          phoneNumber: (data as ShopData).phone_number,
          username: (data as ShopData).username,
          email: (data as ShopData).email,
          password: '',
          confirmPassword: '',
        });
      } catch (error) {
        setErrorMessage(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [shopId]);

  const handleInputChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('New passwords do not match.');
      return;
    }

    // This block simulates the PHP backend `process_edit_shop.php`.
    try {
      const result = await updateShopData(shopId, formData);
      
      if (result) {
        setSuccessMessage('Shop details updated successfully!');
      } else {
        setErrorMessage('An error occurred while updating the shop. Please try again.');
      }
    } catch (error) {
      // Handle different error messages based on the mock backend response.
      if (errorMessage === 'username_or_email_exists') {
        setErrorMessage('The username or email address is already registered to another user. Please use a different one.');
      } else {
        setErrorMessage('An unexpected error occurred. Please try again later.');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="text-xl font-medium text-gray-700">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <script src="https://cdn.tailwindcss.com"></script>
      <style>{`
        body { font-family: 'Inter', sans-serif; background-color: #f3f4f6; }
        .nav-link { display: block; padding: 0.75rem 1rem; color: #374151; border-radius: 0.5rem; transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out; }
        .nav-link:hover { background-color: #e0e7ff; color: #4f46e5; }
        .nav-link.active { background-color: #4f46e5; color: #ffffff; font-weight: 600; }
        .form-container { background-color: #ffffff; border-radius: 0.75rem; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); padding: 2.5rem; max-width: 48rem; width: 90%; margin: 0 auto; }
        .input-field { border: 1px solid #d1d5db; border-radius: 0.5rem; padding: 0.75rem 1rem; width: 100%; transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out; }
        .input-field:focus { outline: none; border-color: #4f46e5; box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2); }
        .submit-button { background-color: #2563eb; color: white; font-weight: 600; padding: 0.75rem 1.5rem; border-radius: 0.5rem; width: 100%; transition: background-color 0.2s ease-in-out; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); }
        .submit-button:hover { background-color: #1d4ed8; }
        .back-button { background-color: #6b7280; color: white; font-weight: 600; padding: 1rem 2rem; border-radius: 0.5rem; width: 100%; transition: background-color 0.2s ease-in-out; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); }
        .back-button:hover { background-color: #4b5563; }
      `}</style>

      <aside className="w-64 bg-white shadow-md h-screen p-6">
        <div className="text-2xl font-bold text-gray-800 mb-8">Admin Panel</div>
        <nav>
          <ul className="space-y-2">
            <li><a href="/admin/admin-dashboard" className="nav-link">Dashboard</a></li>
            <li><a href="admin/manage-shops" className="nav-link active">Manage Shops</a></li>
            <li><a href="admin/manage-delivery-people" className="nav-link">Manage Delivery People</a></li>
            <li><a href="admin/view-all-orders" className="nav-link">View All Orders</a></li>
            <li><a href="admin/report" className="nav-link">Reports</a></li>
            <li><a href="admin/setting" className="nav-link">Settings</a></li>
            <li><a href="#" className="nav-link text-red-600 hover:bg-red-100 hover:text-red-700">Logout</a></li>
          </ul>
        </nav>
      </aside>

      <div className="flex-1 p-10">
        <header className="flex justify-between items-center pb-8 border-b border-gray-200 mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900">Edit Shop: {shopData?.shop_name ?? 'N/A'}</h1>
          <a href="manage_shops.php" className="back-button w-auto px-8 py-4 text-lg">
            Back to Manage Shops
          </a>
        </header>

        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-6" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline">{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg relative mb-6" role="alert">
            <strong className="font-bold">Success!</strong>
            <span className="block sm:inline">{successMessage}</span>
          </div>
        )}

        <div className="form-container">
          <form onSubmit={handleSubmit} className="space-y-6">
            <input type="hidden" name="shop_id" value={shopData?.shop_id ?? ''} />
            <input type="hidden" name="user_id" value={shopData?.user_id ?? ''} />

            <h2 className="text-2xl font-bold text-gray-800 mb-4">Shop Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="shopName" className="block text-sm font-medium text-gray-700 mb-1">Shop Name:</label>
                <input
                  type="text"
                  id="shopName"
                  name="shopName"
                  required
                  className="input-field"
                  value={formData.shopName}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label htmlFor="contactPerson" className="block text-sm font-medium text-gray-700 mb-1">Contact Person:</label>
                <input
                  type="text"
                  id="contactPerson"
                  name="contactPerson"
                  required
                  className="input-field"
                  value={formData.contactPerson}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address:</label>
              <textarea
                id="address"
                name="address"
                rows={3}
                required
                className="input-field"
                value={formData.address}
                onChange={handleInputChange}
              ></textarea>
            </div>

            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">Phone Number:</label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                required
                className="input-field"
                value={formData.phoneNumber}
                onChange={handleInputChange}
              />
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4 pt-6 border-t border-gray-200">Login Credentials</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username:</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  required
                  className="input-field"
                  value={formData.username}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="input-field"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4 pt-6 border-t border-gray-200">Change Password (Optional)</h2>
            <p className="text-gray-600 text-sm mb-4">Leave password fields blank if you don't want to change the password.</p>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">New Password:</label>
              <input
                type="password"
                id="password"
                name="password"
                className="input-field"
                placeholder="Enter new password (optional)"
                value={formData.password}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password:</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                className="input-field"
                placeholder="Confirm new password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <button type="submit" className="submit-button">
                Update Shop
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}