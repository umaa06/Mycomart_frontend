'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import './AdminSettings.css';

// This is a mock data object to simulate what would be fetched from a database.
const mockSettings = {
    default_delivery_charge: 5.50,
    business_name: 'The Mushroom Emporium',
    business_address: '101 Fungi Lane, Mycotopia, 12345',
    business_phone: '+1 (555) 123-4567',
    business_email: 'info@mushroomemporium.com'
};

const AdminSettings = () => {
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
        // and check for authentication. We simulate both with a delay.
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
        setSuccessMessage('Saving settings...');

        // Simulate an API call to save settings
        setTimeout(() => {
            // In a real app, you'd send formData to a backend endpoint here.
            // E.g., fetch('/api/settings', { method: 'POST', body: JSON.stringify(formData) })
            console.log("Simulating save with data:", formData);
            setSuccessMessage('Settings updated successfully!');
            setErrorMessage('');
            clearMessages();
        }, 1500); // Simulate network delay
    };

    if (!isLoggedIn) {
        return (
            <div className="access-denied-container">
                <div className="access-denied-card">
                    <h2 className="access-denied-title">Access Denied</h2>
                    <p className="access-denied-message">You must be logged in as an admin to view this page.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="admin-panel-title">Admin Panel</div>
                <nav>
                    <ul className="nav-list">
                        <li className="nav-item"><Link href="/admin/admin-dashboard" className="nav-link">Dashboard</Link></li>
                        <li className="nav-item"><Link href="/admin/manage-shops" className="nav-link">Manage Shops</Link></li>
                        <li className="nav-item"><Link href="/admin/manage-delivery-people" className="nav-link">Manage Delivery People</Link></li>
                        <li className="nav-item"><Link href="/admin/view-all-orders" className="nav-link">View All Orders</Link></li>
                        <li className="nav-item"><Link href="/admin/report" className="nav-link">Reports</Link></li>
                        <li className="nav-item"><Link href="/admin/setting" className="nav-link active">Settings</Link></li>
                        <li className="nav-item"><Link href="/login" className="logout-btn">Logout</Link></li>
                    </ul>
                </nav>
            </aside>
            
            {/* Main Content Area */}
            <main className="main-content">
                <div className="content-wrapper">
                    {/* Header */}
                    <header className="page-header">
                        <h1 className="header-title">Settings</h1>
                        <div className="welcome-text">Welcome Admin!</div>
                    </header>

                    {/* Alert Messages */}
                    {errorMessage && (
                        <div className="error-message" role="alert">
                            <strong className="error-title">Error!</strong>
                            <span className="error-text">{errorMessage}</span>
                        </div>
                    )}

                    {successMessage && (
                        <div className="success-message" role="alert">
                            <strong className="success-title">Success!</strong>
                            <span className="success-text">{successMessage}</span>
                        </div>
                    )}

                    {/* Form Container */}
                    {loading ? (
                        <div className="loading-text">Loading settings...</div>
                    ) : (
                        <div className="settings-form-container">
                            <form onSubmit={handleSubmit} className="settings-form">
                                <h2 className="form-section-title">General Settings</h2>
                                <div className="form-field">
                                    <label htmlFor="default_delivery_charge" className="form-label">Default Delivery Charge</label>
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
                                
                                <h2 className="form-section-title section-divider">Business Details (for Invoices/Emails)</h2>
                                <div className="form-field">
                                    <label htmlFor="business_name" className="form-label">Business Name</label>
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
                                <div className="form-field">
                                    <label htmlFor="business_address" className="form-label">Business Address</label>
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
                                <div className="form-field">
                                    <label htmlFor="business_phone" className="form-label">Business Phone</label>
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
                                <div className="form-field">
                                    <label htmlFor="business_email" className="form-label">Business Email</label>
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

export default AdminSettings;