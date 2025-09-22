'use client';

import React, { useState, useEffect } from 'react';
import './UpdateDailyAvailability.css'; // Import the new CSS file

// Mock data to simulate fetching products from a backend
const mockProducts = [
  { product_id: 'shiitake', product_name: 'Shiitake' },
  { product_id: 'portobello', product_name: 'Portobello' },
  { product_id: 'cremini', product_name: 'Cremini' },
  { product_id: 'oyster', product_name: 'Oyster' },
  { product_id: 'lionmane', product_name: "Lion's Mane" },
];

const UpdateDailyAvailability = () => {
  const [formData, setFormData] = useState({
    product_id: '',
    quantity_available: '',
    available_date: new Date().toISOString().slice(0, 10),
  });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
    setSuccessMessage('Updating availability...');

    setTimeout(() => {
      console.log("Simulating save with data:", formData);
      setSuccessMessage('Availability updated successfully!');
      clearMessages();
    }, 1500);
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
          <ul className="nav-list">
              <li className="nav-item"><a href="/admin/dashboard" className="nav-link">Dashboard</a></li>
              <li className="nav-item"><a href="#" className="nav-link">Manage Shops</a></li>
              <li className="nav-item"><a href="#" className="nav-link">Manage Delivery People</a></li>
              <li className="nav-item"><a href="#" className="nav-link">View All Orders</a></li>
              <li className="nav-item"><a href="#" className="nav-link">Reports</a></li>
              <li className="nav-item"><a href="#" className="nav-link">Customer Ratings</a></li>
              <li className="nav-item"><a href="#" className="nav-link active">Settings</a></li>
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
            <h1 className="header-title">Update Daily Availability</h1>
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
            <div className="loading-message">Loading products...</div>
          ) : (
            <div className="form-card">
              <p className="form-description">
                Enter the quantity of each mushroom type available for today. If an entry for today already exists for a product, it will be updated.
              </p>
              {products.length === 0 ? (
                <div className="no-products-message">
                  <p>No active mushroom products are available to update. Please add products first.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="availability-form">
                  <div className="form-group">
                    <label htmlFor="product_id">Mushroom Type:</label>
                    <select
                      id="product_id"
                      name="product_id"
                      required
                      className="form-input"
                      value={formData.product_id}
                      onChange={handleInputChange}
                    >
                      <option value="">Select a Mushroom Product</option>
                      {products.map((product: any) => (
                        <option key={product.product_id} value={product.product_id}>{product.product_name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="quantity_available">Quantity Available for Today:</label>
                    <input
                      type="number"
                      id="quantity_available"
                      name="quantity_available"
                      min="0"
                      required
                      className="form-input"
                      placeholder="e.g., 500"
                      value={formData.quantity_available}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="available_date">Date:</label>
                    <input
                      type="date"
                      id="available_date"
                      name="available_date"
                      required
                      className="form-input"
                      value={formData.available_date}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="form-actions">
                    <button type="submit" className="submit-button">
                      Update Availability
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default UpdateDailyAvailability;