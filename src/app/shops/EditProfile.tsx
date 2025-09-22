'use client';
import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, signInAnonymously, signInWithCustomToken } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { collection, query, where, getDocs, getFirestore } from 'firebase/firestore';
import { setLogLevel } from 'firebase/firestore';


// IMPORTANT: Do not remove or change these variables. The Canvas environment will inject the
// correct values at runtime.
const firebaseConfig = JSON.parse(typeof __firebase_config !== 'undefined' ? __firebase_config : '{}');
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : '';
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

// Inline SVG for the icons to remove the external dependency on react-icons
const UserCircleIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className={className} fill="currentColor">
    <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 49.7C73.8 322.7 85.3 352 96 352c9.1 0 65.5 0 128 0s118.9 0 128 0c10.7 0 22.2-29.3-52.3-46.3C287.9 281.8 259.9 288 224 288s-63.9-6.2-101.7-17.6z"/>
  </svg>
);
const EditIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" className={className} fill="currentColor">
    <path d="M402.3 344.9l32-32c5.9-5.9 15.4-5.9 21.2 0l113.8 113.8c5.9 5.9 5.9 15.4 0 21.2l-32 32c-5.9 5.9-15.4 5.9-21.2 0l-113.8-113.8c-5.9-5.9-5.9-15.4 0-21.2zM192 108.3c0-26 12.7-50.5 34.3-65.7c39.9-28.5 106.3-24.8 141.7 41.6c4.6 8.9 2.5 19.4-4.5 25.5l-69.6 62.7c-9.6 8.6-23.3 8.1-32.3-.9c-5.5-5.5-8.8-12.7-8.8-20.7zM361 24.2c-54.8-54.8-144-54.3-198.8 1.5c-48.4 49-60.6 112.9-46.7 172.9-3.9 6.2-7.5 12.6-11 19.3l-37.5 72c-15.2 29.1-1.2 64.6 28.9 79.8l102.6 53.4c55.2 28.7 115.9 2.1 129.9-56.3l37.2-158.2c44.3-16.7 75.9-74.9 61.3-119.5c-3.2-9.2-9.9-18.7-19.3-29.2c-39.7-44.5-83-50.5-120.3-15z"/>
  </svg>
);
const ChevronLeftIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" className={className} fill="currentColor">
    <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z"/>
  </svg>
);
const SaveIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" className={className} fill="currentColor">
    <path d="M361 223.4l-95.7-95.7c-2.4-2.4-5.4-3.7-8.5-4.1l-136-19.4c-9.1-1.3-17.7 2.9-22.9 10.7s-5.8 18.5-1.5 27.5l29.4 61.5-66.2 66.2c-2.8 2.8-4.6 6.4-5.2 10.1l-9.1 50.1-57 57c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l57-57 50.1-9.1c3.7-.7 7.3-2.5 10.1-5.2l66.2-66.2 61.5 29.4c9 4.3 19.9 4.1 27.5-1.5s12.1-13.8 10.7-22.9l-19.4-136c-.4-3.1-1.7-6.1-4.1-8.5z"/>
  </svg>
);


const App = () => {
  const [shopData, setShopData] = useState({});
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // This useEffect hook simulates fetching the shop's profile data on component mount.
  // In a real application, you would replace this with an API call.
  useEffect(() => {
    // Simulate a network delay
    const fetchData = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        setShopData(MOCK_SHOP_DATA);
        setFormData(MOCK_SHOP_DATA);
      } catch (error) {
        setErrorMessage('Failed to load profile data.');
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const validatePassword = (password) => {
    if (!password) return true; // Password is optional
    if (password.length < 8) return 'Password must be at least 8 characters long.';
    if (!/[A-Z]/.test(password)) return 'Password must include at least one uppercase letter.';
    if (!/[a-z]/.test(password)) return 'Password must include at least one lowercase letter.';
    if (!/[0-9]/.test(password)) return 'Password must include at least one number.';
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return 'Password must include at least one special character.';
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const { password, confirm_password, username, email } = formData;

    // Validate new passwords if they are provided
    if (password || confirm_password) {
      if (password !== confirm_password) {
        setErrorMessage('New passwords do not match.');
        return;
      }
      const passwordPolicyError = validatePassword(password);
      if (passwordPolicyError !== true) {
        setErrorMessage(passwordPolicyError);
        return;
      }
    }

    // Simulate API call for profile update
    try {
      // Simulate network delay for API response
      await new Promise(resolve => setTimeout(resolve, 1000));
      // In a real app, this would be a POST request to your API
      console.log('Submitting form data:', formData);

      // Simulate potential errors from a real backend
      if (username === 'testuser') {
        setErrorMessage('The chosen username already exists. Please choose a different one.');
        return;
      }
      if (email === 'test@example.com') {
        setErrorMessage('The email address is already registered. Please use a different one.');
        return;
      }

      setSuccessMessage('Your profile details were updated successfully!');
      // Update the local state to reflect the new data
      setShopData(formData);
    } catch (error) {
      setErrorMessage('An error occurred while updating your profile. Please try again.');
      console.error('Update failed:', error);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-8 flex justify-center items-start font-sans">
      <div className="w-full max-w-4xl bg-white shadow-xl rounded-2xl p-8">
        <header className="flex flex-col sm:flex-row justify-between items-center pb-8 border-b border-gray-200 mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4 sm:mb-0">Edit My Profile</h1>
          <a
            href="/shops/shop-dashboard"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            <ChevronLeftIcon className="mr-2 h-4 w-4" />
            Back to Profile
          </a>
        </header>

        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-6 transition-opacity duration-300">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline ml-2">{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg relative mb-6 transition-opacity duration-300">
            <strong className="font-bold">Success!</strong>
            <span className="block sm:inline ml-2">{successMessage}</span>
          </div>
        )}

        <div className="form-container bg-gray-50 rounded-lg p-6 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-8">
            <input type="hidden" name="shop_id" value={formData.shop_id || ''} />
            <input type="hidden" name="user_id" value={formData.user_id || ''} />

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <EditIcon className="mr-3 text-indigo-500 h-6 w-6" />
                Shop Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="shop_name" className="block text-sm font-medium text-gray-700 mb-1">Shop Name:</label>
                  <input
                    type="text"
                    id="shop_name"
                    name="shop_name"
                    required
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    value={formData.shop_name || ''}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="contact_person" className="block text-sm font-medium text-gray-700 mb-1">Contact Person:</label>
                  <input
                    type="text"
                    id="contact_person"
                    name="contact_person"
                    required
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    value={formData.contact_person || ''}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="mt-6">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address:</label>
                <textarea
                  id="address"
                  name="address"
                  rows="3"
                  required
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={formData.address || ''}
                  onChange={handleChange}
                ></textarea>
              </div>
              <div className="mt-6">
                <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 mb-1">Phone Number:</label>
                <input
                  type="tel"
                  id="phone_number"
                  name="phone_number"
                  required
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={formData.phone_number || ''}
                  onChange={handleChange}
                />
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center pt-6 border-t border-gray-200">
                <UserCircleIcon className="mr-3 text-green-500 h-6 w-6" />
                Login Credentials
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username:</label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    required
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    value={formData.username || ''}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address:</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    value={formData.email || ''}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center pt-6 border-t border-gray-200">
                <SaveIcon className="mr-3 text-orange-500 h-6 w-6" />
                Change Password (Optional)
              </h2>
              <p className="text-gray-600 text-sm mb-4">Leave password fields blank if you don't want to change your password.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">New Password:</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Enter new password (optional)"
                    value={formData.password || ''}
                    onChange={handlePasswordChange}
                  />
                </div>
                <div>
                  <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password:</label>
                  <input
                    type="password"
                    id="confirm_password"
                    name="confirm_password"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Confirm new password"
                    value={formData.confirm_password || ''}
                    onChange={handlePasswordChange}
                  />
                </div>
              </div>
            </section>

            <div>
              <button
                type="submit"
                className="inline-flex justify-center py-3 px-6 border border-transparent shadow-md text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform transform hover:scale-105"
              >
                Update Profile
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default App;