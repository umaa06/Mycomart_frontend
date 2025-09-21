"use client"; 
import React, { useState, useEffect } from 'react';

const AddDeliveryPersonForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    licenseNumber: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  type ValidationErrors = {
    fullName?: string;
    phoneNumber?: string;
    licenseNumber?: string;
    username?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  };
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  // Check if user is authenticated and is admin
  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      //window.location.href = '/admin/login';
      return;
    }

    // Check for URL parameters (messages from redirect)
    const urlParams = new URLSearchParams(window.location.search);
    const message = urlParams.get('message');
    
    if (message) {
      switch (message) {
        case 'success':
          setSuccessMessage('New delivery person registered successfully!');
          break;
        case 'error':
          setErrorMessage('An error occurred while registering the delivery person. Please try again.');
          break;
        case 'username_exists':
          setErrorMessage('The chosen username already exists. Please choose a different one.');
          break;
        case 'email_exists':
          setErrorMessage('The email address is already registered. Please use a different one.');
          break;
        case 'invalid_input':
          setErrorMessage('Invalid input provided. Please check the form and try again.');
          break;
      }
      
      // Clean URL after showing message
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear validation error when user starts typing
    if (validationErrors[name as keyof ValidationErrors]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors: ValidationErrors = {};

    // Required field validation
    if (!formData.fullName.trim()) errors.fullName = 'Full name is required';
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

    // Phone validation (Sri Lankan format)
    const phoneRegex = /^(\+94|0)[0-9]{9}$/;
    if (formData.phoneNumber && !phoneRegex.test(formData.phoneNumber.replace(/\s/g, ''))) {
      errors.phoneNumber = 'Please enter a valid phone number (e.g., 0719202241 or +94719202241)';
    }

    // Username validation (no spaces, minimum length)
    if (formData.username && (formData.username.includes(' ') || formData.username.length < 3)) {
      errors.username = 'Username must be at least 3 characters and contain no spaces';
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
      const deliveryPersonData = {
        fullName: formData.fullName.trim(),
        phoneNumber: formData.phoneNumber.trim(),
        licenseNumber: formData.licenseNumber.trim() || null,
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password,
        vehicleDetails: '' // You might want to add this field later
      };

      // Call your Spring Boot API endpoint
      const response = await fetch('http://localhost:8080/api/admin/delivery-people', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add authorization if needed
          // 'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify(deliveryPersonData)
      });

      if (!response.ok) {
        const errorData = await response.text();
        
        // Handle specific error cases
        if (response.status === 409) {
          if (errorData.includes('username')) {
            throw new Error('The chosen username already exists. Please choose a different one.');
          } else if (errorData.includes('email')) {
            throw new Error('The email address is already registered. Please use a different one.');
          }
        }
        
        throw new Error(errorData || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      // Success
      setSuccessMessage('New delivery person registered successfully!');
      
      // Clear form
      setFormData({
        fullName: '',
        phoneNumber: '',
        licenseNumber: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
      });

      // Scroll to top to show success message
      window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (error) {
      console.error('Error adding delivery person:', error);
      if (typeof error === 'object' && error !== null && 'message' in error) {
        setErrorMessage((error as { message?: string }).message || 'Failed to register delivery person. Please try again.');
      } else {
        setErrorMessage('Failed to register delivery person. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackToManage = () => {
    window.location.href = '/admin/manage-delivery-people';
  };

  return (
    <div className="min-h-screen bg-gray-100 flex" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md h-screen p-6">
        <div className="text-2xl font-bold text-gray-800 mb-8">Admin Panel</div>
        <nav>
          <ul className="space-y-2">
            <li>
              <a href="/admin/dashboard" className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-indigo-100 hover:text-indigo-600 transition-colors">
                Dashboard
              </a>
            </li>
            <li>
              <a href="/admin/manage-shops" className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-indigo-100 hover:text-indigo-600 transition-colors">
                Manage Shops
              </a>
            </li>
            <li>
              <a href="/admin/manage-delivery-people" className="block px-3 py-2 rounded-lg bg-indigo-600 text-white font-semibold">
                Manage Delivery People
              </a>
            </li>
            <li>
              <a href="/admin/view-all-orders" className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-indigo-100 hover:text-indigo-600 transition-colors">
                View All Orders
              </a>
            </li>
            <li>
              <a href="/admin/reports" className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-indigo-100 hover:text-indigo-600 transition-colors">
                Reports
              </a>
            </li>
            <li>
              <a href="/admin/settings" className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-indigo-100 hover:text-indigo-600 transition-colors">
                Settings
              </a>
            </li>
            <li>
              <button 
                onClick={() => window.location.href = '/admin/login'}
                className="block w-full text-left px-3 py-2 rounded-lg text-red-600 hover:bg-red-100 hover:text-red-700 transition-colors"
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
          <h1 className="text-4xl font-extrabold text-gray-900">Add New Delivery Person</h1>
          <button
            onClick={handleBackToManage}
            className="px-6 py-3 bg-gray-500 text-white font-semibold rounded-lg shadow hover:bg-gray-600 transition-colors"
          >
            Back to Manage Delivery People
          </button>
        </header>

        {/* Error Message */}
        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline ml-2">{errorMessage}</span>
          </div>
        )}

        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6" role="alert">
            <strong className="font-bold">Success!</strong>
            <span className="block sm:inline ml-2">{successMessage}</span>
          </div>
        )}

        {/* Form Container */}
        <div className="bg-white rounded-xl shadow-lg p-10 max-w-4xl mx-auto">
          <div className="space-y-6">
            {/* delivery Person Details Section */}
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Delivery Person Details</h2>
            
            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className={`w-full border rounded-lg shadow-sm py-3 px-4 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                  validationErrors.fullName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., Shen Fernando"
                disabled={isSubmitting}
              />
              {validationErrors.fullName && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.fullName}</p>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className={`w-full border rounded-lg shadow-sm py-3 px-4 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                  validationErrors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., 0719202241"
                disabled={isSubmitting}
              />
              {validationErrors.phoneNumber && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.phoneNumber}</p>
              )}
            </div>

            {/* License Number */}
            <div>
              <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700 mb-2">
                License Number <span className="text-gray-500">(Optional)</span>
              </label>
              <input
                type="text"
                id="licenseNumber"
                name="licenseNumber"
                value={formData.licenseNumber}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="e.g., DL1234567"
                disabled={isSubmitting}
              />
            </div>

            {/* PasswordReset Credentials Section */}
            <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4 pt-6 border-t border-gray-200">Login Credentials</h2>
            
            {/* Username and Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                  Username <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className={`w-full border rounded-lg shadow-sm py-3 px-4 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                    validationErrors.username ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Unique login username"
                  disabled={isSubmitting}
                />
                {validationErrors.username && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.username}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full border rounded-lg shadow-sm py-3 px-4 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                    validationErrors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., delivery@example.com"
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
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Temporary Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full border rounded-lg shadow-sm py-3 px-4 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                    validationErrors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Set initial password for the delivery person"
                  disabled={isSubmitting}
                />
                {validationErrors.password && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.password}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`w-full border rounded-lg shadow-sm py-3 px-4 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                    validationErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Confirm the initial password"
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
                className={`w-full py-3 px-6 rounded-lg font-semibold shadow-lg transition-colors ${
                  isSubmitting 
                    ? 'bg-gray-400 cursor-not-allowed text-gray-700' 
                    : 'bg-emerald-500 hover:bg-emerald-600 text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500'
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Registering Delivery Person...
                  </div>
                ) : (
                  'Register delivery Person'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddDeliveryPersonForm;
