// EditDeliveryPerson.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import './EditDeliveryPerson.css';

// Mock database and API calls to simulate a real backend.
type DeliveryPerson = {
  delivery_person_id: string;
  user_id: string;
  dp_full_name: string;
  dp_phone_number: string;
  license_number: string;
  username: string;
  email: string;
};

const MOCK_DB: { [key: string]: DeliveryPerson } = {
  '123': {
    delivery_person_id: '123',
    user_id: 'user_001',
    dp_full_name: 'Anduni',
    dp_phone_number: '0759821545',
    license_number: 'DL1234',
    username: 'anduni',
    email: 'anduni@gmail.com',
  },
};

const fetchDeliveryPersonData = (id: string) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const data = MOCK_DB[id];
      if (data) {
        resolve(data);
      } else {
        reject(new Error('Delivery person not found.'));
      }
    }, 500); // Simulate network delay
  });
};

const updateDeliveryPersonData = (id: string, formData: any) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate validation for username/email
      if (formData.username === 'existinguser' || formData.email === 'existing@example.com') {
        return reject({ message: 'username_or_email_exists' });
      }

      // Simulate successful update
      MOCK_DB[id] = { ...MOCK_DB[id], ...formData };
      resolve({ success: true });
    }, 500); // Simulate network delay
  });
};

const navItems = [
  { href: '/admin/AdminDashboard', label: 'Dashboard', active: false },
  { href: '/admin/Addshop', label: 'Manage Shops', active: false },
  { href: '/admin/ManageDeliveryPerson', label: 'Manage Delivery People', active: true },
  { href: '/admin/ViewAllORders', label: 'View All Orders', active: false },
  { href: '/admin/Reports', label: 'Reports', active: false },
  { href: '/admin/Settings', label: 'Settings', active: false },
];

export default function EditDeliveryPerson() {
  const router = useRouter();
  const [deliveryPersonData, setDeliveryPersonData] = useState<DeliveryPerson | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    licenseNumber: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Simulating the delivery_person_id from a URL query parameter
  const deliveryPersonId = '123';

  useEffect(() => {
    const loadData = async () => {
      if (!deliveryPersonId) {
        setErrorMessage('No delivery person ID specified for editing.');
        setIsLoading(false);
        return;
      }

      try {
        const data = (await fetchDeliveryPersonData(deliveryPersonId)) as DeliveryPerson;
        setDeliveryPersonData(data);
        setFormData({
          fullName: data.dp_full_name,
          phoneNumber: data.dp_phone_number,
          licenseNumber: data.license_number,
          username: data.username,
          email: data.email,
          password: '',
          confirmPassword: '',
        });
      } catch (error) {
        if (error instanceof Error) {
          setErrorMessage(error.message);
        } else {
          setErrorMessage('An unexpected error occurred.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [deliveryPersonId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (formData.password && formData.password !== formData.confirmPassword) {
      setErrorMessage('New passwords do not match.');
      return;
    }

    try {
      const result = (await updateDeliveryPersonData(deliveryPersonId, formData)) as { success: boolean };

      if (result.success) {
        setSuccessMessage('Delivery person details updated successfully!');
      } else {
        setErrorMessage('An error occurred while updating the delivery person. Please try again.');
      }
    } catch (error) {
      if (typeof error === 'object' && error !== null && 'message' in error && typeof (error as any).message === 'string' && (error as any).message === 'username_or_email_exists') {
        setErrorMessage('The username or email address is already registered to another user. Please use a different one.');
      } else {
        setErrorMessage('An unexpected error occurred. Please try again later.');
      }
    }
  };

  const handleLogout = () => {
    // Implement your logout logic here
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="edit-dashboard-container">
        <div className="main-content">
          <div className="flex justify-center items-center h-full">
            <div className="text-xl font-medium text-gray-700">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="admin-panel-title">Admin Panel</div>
        <nav>
          <ul className="nav-list">
            {navItems.map((item) => (
              <li key={item.href} className="nav-item">
                <Link href={item.href} className={`nav-link ${item.active ? 'active' : ''}`}>
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="main-content">
        <header className="content-header">
          <h1 className="header-title">Edit Delivery Person: {deliveryPersonData?.dp_full_name ?? 'N/A'}</h1>
          <Link href="/admin/ManageDeliveryPerson" className="back-button">
            Back to Manage Delivery People
          </Link>
        </header>

        {errorMessage && (
          <div className="error-message message" role="alert">
            <strong>Error!</strong>{' '}
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="success-message message" role="alert">
            <strong>Success!</strong>{' '}
            <span>{successMessage}</span>
          </div>
        )}

        <div className="form-container">
          <form onSubmit={handleSubmit} className="space-y-6">
            <input type="hidden" name="delivery_person_id" value={deliveryPersonData?.delivery_person_id ?? ''} />
            <input type="hidden" name="user_id" value={deliveryPersonData?.user_id ?? ''} />

            <h2 className="form-section-title">Delivery Person Details</h2>
            <div className="form-group">
              <label htmlFor="fullName">Full Name:</label>
              <input type="text" id="fullName" name="fullName" required className="input-field" value={formData.fullName} onChange={handleInputChange} />
            </div>
            <div className="form-group">
              <label htmlFor="phoneNumber">Phone Number:</label>
              <input type="tel" id="phoneNumber" name="phoneNumber" required className="input-field" value={formData.phoneNumber} onChange={handleInputChange} />
            </div>
            <div className="form-group">
              <label htmlFor="licenseNumber">License Number (Optional):</label>
              <input type="text" id="licenseNumber" name="licenseNumber" className="input-field" value={formData.licenseNumber} onChange={handleInputChange} />
            </div>

            <h2 className="form-section-title">Login Credentials</h2>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="username">Username:</label>
                <input type="text" id="username" name="username" required className="input-field" value={formData.username} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email Address:</label>
                <input type="email" id="email" name="email" required className="input-field" value={formData.email} onChange={handleInputChange} />
              </div>
            </div>

            <h2 className="form-section-title">Change Password (Optional)</h2>
            <p className="password-note">Leave password fields blank if you don't want to change the password.</p>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="password">New Password:</label>
                <input type="password" id="password" name="password" className="input-field" placeholder="Enter new password (optional)" value={formData.password} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm New Password:</label>
                <input type="password" id="confirmPassword" name="confirmPassword" className="input-field" placeholder="Confirm new password" value={formData.confirmPassword} onChange={handleInputChange} />
              </div>
            </div>

            <div>
              <button type="submit" className="submit-button">
                Update Delivery Person
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}