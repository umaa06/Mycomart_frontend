'use client';
import React, { useState, useEffect } from 'react';

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

export default function App() {
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

  // Simulating the delivery_person_id from the URL query parameter
  const deliveryPersonId = '123'; 

  useEffect(() => {
    const loadData = async () => {
      if (!deliveryPersonId) {
        setErrorMessage('No delivery person ID specified for editing.');
        setIsLoading(false);
        return;
      }

      try {
        const data = await fetchDeliveryPersonData(deliveryPersonId) as DeliveryPerson;
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
    setFormData(prev => ({ ...prev, [name]: value }));
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
      const result = await updateDeliveryPersonData(deliveryPersonId, formData) as { success: boolean };
      
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="text-xl font-medium text-gray-700">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <script src="https://cdn.tailwindcss.com"></script>
      <style>{`
        body { font-family: 'Inter', sans-serif; background-color: #f3f4f6; }
        .nav-link { display: block; padding: 0.75rem 1rem; color: #374151; border-radius: 0.5rem; transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out; }
        .nav-link:hover { background-color: #e0e7ff; color: #4f46e5; }
        .nav-link.active { background-color: #4f46e5; color: #ffffff; font-weight: 600; }
        .form-container { background-color: #ffffff; border-radius: 0.75rem; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); padding: 2.5rem; max-width: 48rem; width: 90%; margin: 0 auto; }
        .input-field { border: 1px solid #d1d5db; border-radius: 0.5rem; padding: 0.75rem 1rem; width: 100%; transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out; }
        .input-field:focus { outline: none; border-color: #4f46e5; box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2); }
        .submit-button { background-color: #6b7280; /* Gray-500 */
            color: white;
            font-weight: 600;
            padding: 0.75rem 1.5rem;
            border-radius: 0.5rem;
            width: 100%;
            transition: background-color 0.2s ease-in-out;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); }
        .submit-button:hover { background-color: #1d4ed8; }
        .back-button { background-color: #6b7280; /* Gray-500 */
            color: white;
            font-weight: 600;
            padding: 0.75rem 1.5rem;
            border-radius: 0.5rem;
            width: 100%;
            transition: background-color 0.2s ease-in-out;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); }
        .back-button:hover { background-color: #4b5563; }
      `}</style>

      <aside className="w-64 bg-white shadow-md h-screen p-6">
        <div className="text-2xl font-bold text-gray-800 mb-8">Admin Panel</div>
        <nav>
          <ul className="space-y-2">
            <li><a href="dashboard.php" className="nav-link">Dashboard</a></li>
            <li><a href="manage_shops.php" className="nav-link">Manage Shops</a></li>
            <li><a href="manage_delivery_people.php" className="nav-link active">Manage Delivery People</a></li>
            <li><a href="view_all_orders.php" className="nav-link">View All Orders</a></li>
            <li><a href="reports.php" className="nav-link">Reports</a></li>
            <li><a href="settings.php" className="nav-link">Settings</a></li>
            <li><a href="../auth/process_logout.php" className="nav-link text-red-600 hover:bg-red-100 hover:text-red-700">Logout</a></li>
          </ul>
        </nav>
      </aside>

      <div className="flex-1 p-10">
        <header className="flex justify-between items-center pb-8 border-b border-gray-200 mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900">Edit Delivery Person: {deliveryPersonData?.dp_full_name ?? 'N/A'}</h1>
          <a href="#" className="back-button w-auto px-6 py-3">
            Back to Manage Delivery People
          </a>
        </header>

        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-6" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline">{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg relative mb-6" role="alert">
            <strong className="font-bold">Success!</strong>
            <span className="block sm:inline">{successMessage}</span>
          </div>
        )}

        <div className="form-container">
          <form onSubmit={handleSubmit} className="space-y-6">
            <input type="hidden" name="delivery_person_id" value={deliveryPersonData?.delivery_person_id ?? ''} />
            <input type="hidden" name="user_id" value={deliveryPersonData?.user_id ?? ''} />

            <h2 className="text-2xl font-bold text-gray-800 mb-4">Delivery Person Details</h2>
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Full Name:</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                required
                className="input-field"
                value={formData.fullName}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">Phone Number:</label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                required
                className="input-field"
                value={formData.phoneNumber}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700 mb-1">License Number (Optional):</label>
              <input
                type="text"
                id="licenseNumber"
                name="licenseNumber"
                className="input-field"
                value={formData.licenseNumber}
                onChange={handleInputChange}
              />
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4 pt-6 border-t border-gray-200">Login Credentials</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username:</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  required
                  className="input-field"
                  value={formData.username}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="input-field"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4 pt-6 border-t border-gray-200">Change Password (Optional)</h2>
            <p className="text-gray-600 text-sm mb-4">Leave password fields blank if you don't want to change the password.</p>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">New Password:</label>
              <input
                type="password"
                id="password"
                name="password"
                className="input-field"
                placeholder="Enter new password (optional)"
                value={formData.password}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password:</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                className="input-field"
                placeholder="Confirm new password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
              />
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
