"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import './AddShop.css'; // Corrected: CSS file is now imported
import {dashboardService} from '@/app/api/dashboardService';
import {authService} from '@/app/api/authService';

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
  const router = useRouter();
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
  const handleLogout = () => {
    authService.logout().then(r => {
      router.push('/');
    }).catch(ra=>{router.push('/')});
  };

  // Check if user is authenticated and is admin
  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      // You might want to redirect here if not authenticated
      // router.push('/admin/login');
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

    if (!formData.shopName.trim()) errors.shopName = 'Shop name is required';
    if (!formData.contactPerson.trim()) errors.contactPerson = 'Contact person is required';
    if (!formData.address.trim()) errors.address = 'Address is required';
    if (!formData.phoneNumber.trim()) errors.phoneNumber = 'Phone number is required';
    if (!formData.username.trim()) errors.username = 'Username is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    if (!formData.password) errors.password = 'Password is required';
    if (!formData.confirmPassword) errors.confirmPassword = 'Please confirm password';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    const phoneRegex = /^[\d\-\+\(\)\s]+$/;
    if (formData.phoneNumber && !phoneRegex.test(formData.phoneNumber)) {
      errors.phoneNumber = 'Please enter a valid phone number';
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

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
      const shopData = {
        shopName: formData.shopName.trim(),
        contactPerson: formData.contactPerson.trim(),
        address: formData.address.trim(),
        phoneNumber: formData.phoneNumber.trim(),
        userName: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password
      };

      
      await dashboardService.registerShop(shopData);
      // Call your Spring Boot API endpoint
      const response = await fetch('http://localhost:8080/api/admin/shops', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify(shopData)
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || `HTTP error! status: ${response.status}`);
      }

      await response.json();

      setSuccessMessage('Shop registered successfully!');
      
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
    router.push('/admin/manage-shops');
  };

  const navItems = [
        { href: '/admin/AdminDashboard', label: 'Dashboard', active: false },
        { href: '/admin/Addshop', label: 'Manage Shops', active: true },
        { href: '/admin/ManageDeliveryPerson', label: 'Manage Delivery People', active: false },
        { href: '/admin/ViewAllORders', label: 'View All Orders', active: false },
        { href: '/admin/Reports', label: 'Reports', active: false },
        { href: '/admin/Settings', label: 'Settings', active: false },
    ];
    
  return (
        <div className="dashboard-container">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="admin-panel-title">Admin Panel</div>
                <nav>
                    <ul className="nav-list">
                        {navItems.map((item) => (
                            <li key={item.href} className="nav-item">
                                <Link
                                    href={item.href}
                                    className={`nav-link ${item.active ? 'active' : ''}`}
                                >
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                        <li>
                            <button
                                onClick={handleLogout} // Assumes logout function is available
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
          <header className="dashboard-header">
            <h1 className="header-title">Register New Shop</h1>
            <button
              onClick={handleBackToManageShops}
              className="action-button"
            >
              Back to Manage Shops
            </button>
          </header>

          {successMessage && (
            <div className="alert success-alert">
              <strong>Success!</strong>
              <span>{successMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div className="alert error-alert">
              <strong>Error!</strong>
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="form-container">
            <div className="form-section">
              <h2 className="section-title">Shop Details</h2>
              <div className="form-grid">
                <div>
                  <label htmlFor="shopName" className="label">
                    Shop Name <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="shopName"
                    name="shopName"
                    value={formData.shopName}
                    onChange={handleInputChange}
                    className={`input-field ${validationErrors.shopName ? 'input-error' : ''}`}
                    disabled={isSubmitting}
                  />
                  {validationErrors.shopName && (
                    <p className="error-message">{validationErrors.shopName}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="contactPerson" className="label">
                    Contact Person <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="contactPerson"
                    name="contactPerson"
                    value={formData.contactPerson}
                    onChange={handleInputChange}
                    className={`input-field ${validationErrors.contactPerson ? 'input-error' : ''}`}
                    disabled={isSubmitting}
                  />
                  {validationErrors.contactPerson && (
                    <p className="error-message">{validationErrors.contactPerson}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="address" className="label">
                  Address <span className="required">*</span>
                </label>
                <textarea
                  id="address"
                  name="address"
                  rows={3}
                  value={formData.address}
                  onChange={handleInputChange}
                  className={`textarea-field ${validationErrors.address ? 'input-error' : ''}`}
                  disabled={isSubmitting}
                />
                {validationErrors.address && (
                  <p className="error-message">{validationErrors.address}</p>
                )}
              </div>

              <div>
                <label htmlFor="phoneNumber" className="label">
                  Phone Number <span className="required">*</span>
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className={`input-field ${validationErrors.phoneNumber ? 'input-error' : ''}`}
                  disabled={isSubmitting}
                />
                {validationErrors.phoneNumber && (
                  <p className="error-message">{validationErrors.phoneNumber}</p>
                )}
              </div>
            </div>

            <div className="form-section login-credentials">
              <h2 className="section-title">Login Credentials</h2>
              <div className="form-grid">
                <div>
                  <label htmlFor="username" className="label">
                    Username <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className={`input-field ${validationErrors.username ? 'input-error' : ''}`}
                    disabled={isSubmitting}
                  />
                  {validationErrors.username && (
                    <p className="error-message">{validationErrors.username}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="email" className="label">
                    Email Address <span className="required">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`input-field ${validationErrors.email ? 'input-error' : ''}`}
                    disabled={isSubmitting}
                  />
                  {validationErrors.email && (
                    <p className="error-message">{validationErrors.email}</p>
                  )}
                </div>
              </div>

              <div className="form-grid">
                <div>
                  <label htmlFor="password" className="label">
                    Password <span className="required">*</span>
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`input-field ${validationErrors.password ? 'input-error' : ''}`}
                    disabled={isSubmitting}
                  />
                  {validationErrors.password && (
                    <p className="error-message">{validationErrors.password}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="label">
                    Confirm Password <span className="required">*</span>
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`input-field ${validationErrors.confirmPassword ? 'input-error' : ''}`}
                    disabled={isSubmitting}
                  />
                  {validationErrors.confirmPassword && (
                    <p className="error-message">{validationErrors.confirmPassword}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`submit-button ${isSubmitting ? 'submitting' : ''}`}
              >
                {isSubmitting ? (
                  <>
                    <div className="spinner"></div>
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
  );
};

export default AddShopForm;
