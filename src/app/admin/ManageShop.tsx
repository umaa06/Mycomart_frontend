'use client';

import React, { useState, useEffect } from 'react';
import './ManageShops.css';

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
    { name: 'Dashboard', href: '/admin/admin-dashboard' },
    { name: 'Manage Shops', href: '/admin/manage-shops', active: true },
    { name: 'Manage Delivery People', href: '/admin/add-delivery-person' },
    { name: 'View All Orders', href: '/admin/view-all-orders' },
    { name: 'Reports', href: '/admin/report' },
    { name: 'Settings', href: '/admin/setting' },
    { name: 'Logout', href: '/Login', isLogout: true },
  ];

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="admin-panel-title">Admin Panel</div>
        <nav>
          <ul>
            {navLinks.map((link) => (
              <li key={link.name} className="nav-item">
                <a
                  href={link.href}
                  className={`${link.active ? 'active' : ''} ${link.isLogout ? 'logout-btn' : ''}`}
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="main-content">
        <div className="content-wrapper">
          {/* Header */}
          <header className="dashboard-header">
            <h1 className="header-title">Manage Shops</h1>
            <a href="/admin/add-shop" className="register-button">
              Register New Shop
            </a>
          </header>

          {/* Alert Messages */}
          {errorMessage && (
            <div className="alert-message error" role="alert">
              <strong className="alert-title">Error!</strong>
              <span className="alert-text">{errorMessage}</span>
            </div>
          )}
          {successMessage && (
            <div className="alert-message success" role="alert">
              <strong className="alert-title">Success!</strong>
              <span className="alert-text">{successMessage}</span>
            </div>
          )}

          {/* Table Container */}
          <div className="table-container">
            {loading ? (
              <p className="loading-message">Loading shops...</p>
            ) : shops.length === 0 ? (
              <p className="no-data-message">
                No shops registered yet. Click "Register New Shop" to add one.
              </p>
            ) : (
              <div className="table-wrapper">
                <table className="data-table">
                  <thead className="table-header">
                    <tr>
                      <th scope="col" className="table-th">
                        Shop Name
                      </th>
                      <th scope="col" className="table-th">
                        Username
                      </th>
                      <th scope="col" className="table-th">
                        Email
                      </th>
                      <th scope="col" className="table-th">
                        Contact Person
                      </th>
                      <th scope="col" className="table-th">
                        Phone
                      </th>
                      <th scope="col" className="table-th">
                        Address
                      </th>
                      <th scope="col" className="table-th">
                        Prev. Stock
                      </th>
                      <th scope="col" className="table-th">
                        Prev. Sales
                      </th>
                      <th scope="col" className="table-th">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="table-body">
                    {shops.map((shop: any) => (
                      <tr key={shop.shop_id}>
                        <td className="table-td-text-bold">{shop.shop_name}</td>
                        <td className="table-td-text">{shop.username}</td>
                        <td className="table-td-text">{shop.email}</td>
                        <td className="table-td-text">
                          {shop.contact_person}
                        </td>
                        <td className="table-td-text">
                          {shop.phone_number}
                        </td>
                        <td className="table-td-text">{shop.address}</td>
                        <td className="table-td-text">
                          {shop.previous_day_stock}
                        </td>
                        <td className="table-td-text">
                          ${shop.previous_day_sales.toFixed(2)}
                        </td>
                        <td className="table-td-actions">
                          <a
                            href={`/edit_shop?id=${shop.shop_id}`}
                            className="action-button edit-button"
                          >
                            Edit
                          </a>
                          <button
                            onClick={() => handleDeleteShop(shop.shop_id)}
                            className="action-button delete-button"
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