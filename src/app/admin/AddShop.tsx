"use client";
import React, { useState, useEffect } from 'react';

type FormData = {
  shopName: string;
  contactPerson: string;
  address: string;
  phoneNumber: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type ValidationErrors = Partial<Record<keyof FormData, string>>;

const AddShopForm = () => {
  const [formData, setFormData] = useState<FormData>({
    shopName: '',
    contactPerson: '',
    address: '',
    phoneNumber: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  // Check if user is authenticated and is admin
  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      // window.location.href = '/admin/login';
      return;
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear validation error when user starts typing
    if (validationErrors[name as keyof FormData]) {
      setValidationErrors(prev => ({
        ...prev,
        [name as keyof FormData]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors: ValidationErrors = {};

    // Required field validation
    if (!formData.shopName.trim()) errors.shopName = 'Shop name is required';
    if (!formData.contactPerson.trim()) errors.contactPerson = 'Contact person is required';
    if (!formData.address.trim()) errors.address = 'Address is required';
    if (!formData.phoneNumber.trim()) errors.phoneNumber = 'Phone number is required';
    if (!formData.username.trim()) errors.username = 'Username is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    if (!formData.password) errors.password = 'Password is required';
    if (!formData.confirmPassword) errors.confirmPassword = 'Please confirm password';

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Phone validation (basic)
    const phoneRegex = /^[\d\-\+\(\)\s]+$/;
    if (formData.phoneNumber && !phoneRegex.test(formData.phoneNumber)) {
      errors.phoneNumber = 'Please enter a valid phone number';
    }

    // Password confirmation
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    // Password strength (basic)
    if (formData.password && formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters long';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare data for Spring Boot API
      const shopData = {
        shopName: formData.shopName.trim(),
        contactPerson: formData.contactPerson.trim(),
        address: formData.address.trim(),
        phoneNumber: formData.phoneNumber.trim(),
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password
      };

      // Call your Spring Boot API endpoint
      const response = await fetch('http://localhost:8080/api/admin/shops', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add authorization if needed
          // 'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify(shopData)
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      // Success
      setSuccessMessage('Shop registered successfully!');
      
      // Clear form
      setFormData({
        shopName: '',
        contactPerson: '',
        address: '',
        phoneNumber: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
      });

      // Scroll to top to show success message
      window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (error) {
      console.error('Error adding shop:', error);
      if (error instanceof Error) {
        setErrorMessage(error.message || 'Failed to register shop. Please try again.');
      } else {
        setErrorMessage('Failed to register shop. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackToManageShops = () => {
    window.location.href = '/admin/manage-shops';
  };

  return (
    <div className="min-h-screen bg-gray-100" style={{ fontFamily: 'Inter, sans-serif' }}>
      <div className="flex">
        {/* Sidebar - Simple version */}
        <aside className="w-64 bg-white shadow-md h-screen p-6">
          <div className="text-2xl font-bold text-gray-800 mb-8">Admin Panel</div>
          <nav>
            <ul className="space-y-2">
              <li><a href="/admin/dashboard" className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-indigo-100 hover:text-indigo-600">Dashboard</a></li>
              <li><a href="/admin/manage-shops" className="block px-4 py-3 rounded-lg bg-indigo-600 text-white font-semibold">Manage Shops</a></li>
              <li><a href="/admin/manage-delivery-people" className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-indigo-100 hover:text-indigo-600">Manage Delivery People</a></li>
              <li><a href="/admin/view-all-orders" className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-indigo-100 hover:text-indigo-600">View All Orders</a></li>
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <div className="flex-1 p-10">
          {/* Header */}
          <header className="flex justify-between items-center pb-8 border-b border-gray-200 mb-8">
            <h1 className="text-4xl font-extrabold text-gray-900">Register New Shop</h1>
            <button
              onClick={handleBackToManageShops}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Back to Manage Shops
            </button>
          </header>

          {/* Success Message */}
          {successMessage && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6">
              <strong className="font-bold">Success!</strong>
              <span className="block sm:inline ml-2">{successMessage}</span>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
              <strong className="font-bold">Error!</strong>
              <span className="block sm:inline ml-2">{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Shop Details</h2>
              
              {/* Shop Name and Contact Person */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="shopName" className="block text-sm font-medium text-gray-700 mb-1">
                    Shop Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="shopName"
                    name="shopName"
                    value={formData.shopName}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                      validationErrors.shopName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    disabled={isSubmitting}
                  />
                  {validationErrors.shopName && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.shopName}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="contactPerson" className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Person <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="contactPerson"
                    name="contactPerson"
                    value={formData.contactPerson}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                      validationErrors.contactPerson ? 'border-red-500' : 'border-gray-300'
                    }`}
                    disabled={isSubmitting}
                  />
                  {validationErrors.contactPerson && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.contactPerson}</p>
                  )}
                </div>
              </div>

              {/* Address */}
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="address"
                  name="address"
                  rows={3}
                  value={formData.address}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                    validationErrors.address ? 'border-red-500' : 'border-gray-300'
                  }`}
                  disabled={isSubmitting}
                />
                {validationErrors.address && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.address}</p>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                    validationErrors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                  }`}
                  disabled={isSubmitting}
                />
                {validationErrors.phoneNumber && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.phoneNumber}</p>
                )}
              </div>

              {/* PasswordReset Credentials Section */}
              <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4 pt-6 border-t border-gray-200">Login Credentials</h2>
              
              {/* Username and Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                    Username <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                      validationErrors.username ? 'border-red-500' : 'border-gray-300'
                    }`}
                    disabled={isSubmitting}
                  />
                  {validationErrors.username && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.username}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                      validationErrors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    disabled={isSubmitting}
                  />
                  {validationErrors.email && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
                  )}
                </div>
              </div>

              {/* Password Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                      validationErrors.password ? 'border-red-500' : 'border-gray-300'
                    }`}
                    disabled={isSubmitting}
                  />
                  {validationErrors.password && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.password}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                      validationErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                    }`}
                    disabled={isSubmitting}
                  />
                  {validationErrors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.confirmPassword}</p>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className={`inline-flex justify-center items-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
                    isSubmitting 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Registering Shop...
                    </>
                  ) : (
                    'Register Shop'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddShopForm;
