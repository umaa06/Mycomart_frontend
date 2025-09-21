"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import './AddDeliveryPerson.css';

const AddDeliveryPersonForm = () => {
  const router = useRouter();
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
    router.push('/admin/manage-delivery-people');
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="admin-panel-title">Admin Panel</div>
        <nav>
          <ul className="nav-list">
            <li className="nav-item">
              <Link href="/admin/dashboard" className="nav-link">
                Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/admin/manage-shops" className="nav-link">
                Manage Shops
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/admin/manage-delivery-people" className="nav-link active">
                Manage Delivery People
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/admin/view-all-orders" className="nav-link">
                View All Orders
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/admin/reports" className="nav-link">
                Reports
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/admin/settings" className="nav-link">
                Settings
              </Link>
            </li>
            <li>
              <button
                onClick={() => router.push('/admin/login')}
                className="logout-btn"
              >
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="main-content">
        <div className="content-wrapper">
          {/* Header */}
          <header className="dashboard-header">
            <h1 className="header-title">Add New Delivery Person</h1>
            <button
              onClick={handleBackToManage}
              className="back-btn"
            >
              Back to Manage Delivery People
            </button>
          </header>

<<<<<<< HEAD
          {/* Error Message */}
          {errorMessage && (
            <div className="error-message" role="alert">
              <strong>Error!</strong>
              <span>{errorMessage}</span>
=======
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
>>>>>>> 17913f82d21836026f3a6d4b0d017f170bdf2903
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="success-message" role="alert">
              <strong>Success!</strong>
              <span>{successMessage}</span>
            </div>
          )}

          {/* Form Container */}
          <div className="form-container">
            <form className="form-layout" onSubmit={handleSubmit}>
              {/* Delivery Person Details Section */}
              <h2 className="form-section-title">Delivery Person Details</h2>
              
              {/* Full Name */}
              <div>
                <label htmlFor="fullName" className="form-label">
                  Full Name <span className="required-star">*</span>
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className={`form-input ${validationErrors.fullName ? 'input-error' : ''}`}
                  placeholder="e.g., Shen Fernando"
                  disabled={isSubmitting}
                />
                {validationErrors.fullName && (
                  <p className="validation-error">{validationErrors.fullName}</p>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <label htmlFor="phoneNumber" className="form-label">
                  Phone Number <span className="required-star">*</span>
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className={`form-input ${validationErrors.phoneNumber ? 'input-error' : ''}`}
                  placeholder="e.g., 0719202241"
                  disabled={isSubmitting}
                />
                {validationErrors.phoneNumber && (
                  <p className="validation-error">{validationErrors.phoneNumber}</p>
                )}
              </div>

<<<<<<< HEAD
              {/* License Number */}
              <div>
                <label htmlFor="licenseNumber" className="form-label">
                  License Number <span className="optional-text">(Optional)</span>
                </label>
                <input
                  type="text"
                  id="licenseNumber"
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="e.g., DL1234567"
                  disabled={isSubmitting}
                />
              </div>

              {/* Login Credentials Section */}
              <h2 className="form-section-title separated-section">Login Credentials</h2>
              
              {/* Username and Email */}
              <div className="grid-2-cols">
                <div>
                  <label htmlFor="username" className="form-label">
                    Username <span className="required-star">*</span>
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className={`form-input ${validationErrors.username ? 'input-error' : ''}`}
                    placeholder="Unique login username"
                    disabled={isSubmitting}
                  />
                  {validationErrors.username && (
                    <p className="validation-error">{validationErrors.username}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="email" className="form-label">
                    Email Address <span className="required-star">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`form-input ${validationErrors.email ? 'input-error' : ''}`}
                    placeholder="e.g., delivery@example.com"
                    disabled={isSubmitting}
                  />
                  {validationErrors.email && (
                    <p className="validation-error">{validationErrors.email}</p>
                  )}
                </div>
              </div>

              {/* Password Fields */}
              <div className="grid-2-cols">
                <div>
                  <label htmlFor="password" className="form-label">
                    Temporary Password <span className="required-star">*</span>
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`form-input ${validationErrors.password ? 'input-error' : ''}`}
                    placeholder="Set initial password for the delivery person"
                    disabled={isSubmitting}
                  />
                  {validationErrors.password && (
                    <p className="validation-error">{validationErrors.password}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="confirmPassword" className="form-label">
                    Confirm Password <span className="required-star">*</span>
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`form-input ${validationErrors.confirmPassword ? 'input-error' : ''}`}
                    placeholder="Confirm the initial password"
                    disabled={isSubmitting}
                  />
                  {validationErrors.confirmPassword && (
                    <p className="validation-error">{validationErrors.confirmPassword}</p>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="submit-button-container">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`submit-btn ${isSubmitting ? 'submit-btn-disabled' : ''}`}
                >
                  {isSubmitting ? (
                    <div className="loading-spinner">
                      <div className="spinner"></div>
                      <span>Registering Delivery Person...</span>
                    </div>
                  ) : (
                    'Register Delivery Person'
                  )}
                </button>
              </div>
            </form>
=======
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
>>>>>>> 17913f82d21836026f3a6d4b0d017f170bdf2903
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddDeliveryPersonForm;