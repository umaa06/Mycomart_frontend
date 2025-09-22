'use client';

import React, { useState, useEffect } from 'react';
import './Settings.css'; // Import the dedicated CSS file

// This is a mock data object to simulate what would be fetched from a database.
const mockSettings = {
  default_delivery_charge: 5.50,
  business_name: 'The Mushroom Emporium',
  business_address: '101 Fungi Lane, Mycotopia, 12345',
  business_phone: '+1 (555) 123-4567',
  business_email: 'info@mushroomemporium.com'
};

const Settings = () => {
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('Saving settings...');

    // Simulate an API call to save settings
    setTimeout(() => {
      console.log("Simulating save with data:", formData);
      setSuccessMessage('Settings updated successfully!');
      setErrorMessage('');
      clearMessages();
    }, 1500); // Simulate network delay
  };

  if (!isLoggedIn) {
    return (
      <div className="access-denied-container">
        <div className="access-denied-box">
          <h2>Access Denied</h2>
          <p>You must be logged in as an admin to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="admin-panel-title">Admin Panel</div>
        <nav>
          <ul>
            <li className="nav-item">
              <a href="#" className="nav-link">
                Dashboard
              </a>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link">
                Manage Shops
              </a>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link">
                Manage Delivery People
              </a>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link">
                View All Orders
              </a>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link">
                Reports
              </a>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link">
                Customer Ratings
              </a>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link active">
                Settings
              </a>
            </li>
            <li className="nav-item">
              <button className="logout-btn">
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </aside>
      
      <main className="main-content">
        <div className="content-wrapper">
          <header className="dashboard-header">
            <h1 className="header-title">Settings</h1>
            <p className="welcome-message">
              Welcome, <span>Admin</span>
            </p>
          </header>

          {errorMessage && (
            <div className="alert-error">
              <strong>Error!</strong>
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="alert-success">
              <strong>Success!</strong>
              <span>{successMessage}</span>
            </div>
          )}

          {loading ? (
            <div className="loading-message">Loading settings...</div>
          ) : (
            <div className="form-card">
              <form onSubmit={handleSubmit} className="settings-form">
                <h2 className="form-section-title">General Settings</h2>
                <div className="form-group">
                  <label htmlFor="default_delivery_charge">Default Delivery Charge</label>
                  <input
                    type="number"
                    id="default_delivery_charge"
                    name="default_delivery_charge"
                    step="0.01"
                    min="0"
                    required
                    className="form-input"
                    value={formData.default_delivery_charge}
                    onChange={handleInputChange}
                  />
                </div>
                
                <h2 className="form-section-title">Business Details (for Invoices/Emails)</h2>
                <div className="form-group">
                  <label htmlFor="business_name">Business Name</label>
                  <input
                    type="text"
                    id="business_name"
                    name="business_name"
                    required
                    className="form-input"
                    value={formData.business_name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="business_address">Business Address</label>
                  <textarea
                    id="business_address"
                    name="business_address"
                    rows={3}
                    required
                    className="form-input"
                    value={formData.business_address}
                    onChange={handleInputChange}
                  ></textarea>
                </div>
                <div className="form-group">
                  <label htmlFor="business_phone">Business Phone</label>
                  <input
                    type="tel"
                    id="business_phone"
                    name="business_phone"
                    required
                    className="form-input"
                    value={formData.business_phone}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="business_email">Business Email</label>
                  <input
                    type="email"
                    id="business_email"
                    name="business_email"
                    required
                    className="form-input"
                    value={formData.business_email}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="form-actions">
                  <button type="submit" className="submit-button">
                    Save Settings
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Settings;