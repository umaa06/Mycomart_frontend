'use client';
import React, { useState, useEffect } from 'react';
import './ManageDeliveryPeople.css'; 
type DeliveryPerson = {
  delivery_person_id: string;
  user_id: string;
  dp_full_name: string;
  dp_phone_number: string;
  license_number: string;
  username: string;
  email: string;
};

// Mock database to simulate fetching data from a backend.
const MOCK_DB: DeliveryPerson[] = [
  {
    delivery_person_id: '123',
    user_id: '456',
    dp_full_name: 'John Doe',
    dp_phone_number: '123-456-7890',
    license_number: 'ABCD-1234',
    username: 'johndoe',
    email: 'john.doe@example.com',
  },
  {
    delivery_person_id: '124',
    user_id: '457',
    dp_full_name: 'Jane Smith',
    dp_phone_number: '987-654-3210',
    license_number: 'EFGH-5678',
    username: 'janesmith',
    email: 'jane.smith@example.com',
  },
  {
    delivery_person_id: '125',
    user_id: '458',
    dp_full_name: 'Peter Jones',
    dp_phone_number: '555-111-2222',
    license_number: 'IJKL-9012',
    username: 'peterjones',
    email: 'peter.jones@example.com',
  },
];

// Simulates fetching delivery person data from a backend API.
const fetchDeliveryPeople = (): Promise<DeliveryPerson[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_DB);
    }, 500); // Simulate network delay
  });
};

// Simulates a backend delete operation.
const deleteDeliveryPerson = (id: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = MOCK_DB.findIndex(p => p.delivery_person_id === id);
    });
  });
}
export default function ManageDeliveryPeople() {
  const [deliveryPeople, setDeliveryPeople] = useState<DeliveryPerson[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [personToDelete, setPersonToDelete] = useState<DeliveryPerson | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchDeliveryPeople();
        setDeliveryPeople(data);
      } catch (error) {
        setErrorMessage('Failed to load delivery people data.');
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const handleDeleteClick = (person: React.SetStateAction<DeliveryPerson | null>) => {
    setPersonToDelete(person);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!personToDelete) return;

    setShowDeleteModal(false);
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const result:any = await deleteDeliveryPerson(personToDelete.delivery_person_id);
      if (result.success) {
        setSuccessMessage('delivery person deleted successfully!');
        setDeliveryPeople(prevPeople =>
          prevPeople.filter(p => p.delivery_person_id !== personToDelete.delivery_person_id)
        );
      } else {
        setErrorMessage(result.message);
      }
    } catch (error) {
      setErrorMessage('An unexpected error occurred during deletion.');
    } finally {
      setPersonToDelete(null);
      setIsLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setPersonToDelete(null);
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-text">Loading...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="admin-panel-title">Admin Panel</div>
        <nav>
          <ul className="nav-list">
            <li>
              <a href="/admin/admin-dashboard" className="nav-link">
                Dashboard
              </a>
            </li>
            <li>
              <a href="/admin/manage-shops" className="nav-link">
                Manage Shops
              </a>
            </li>
            <li>
              <a
                href="/admin/manage-delivery-people"
                className="nav-link active"
              >
                Manage Delivery People
              </a>
            </li>
            <li>
              <a href="/admin/view-all-orders" className="nav-link">
                View All Orders
              </a>
            </li>
            <li>
              <a href="/admin/report" className="nav-link">
                Reports
              </a>
            </li>
            <li>
              <a href="/admin/setting" className="nav-link">
                Settings
              </a>
            </li>
            <li>
              <a href="/login" className="logout-btn">
                Logout
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      <main className="main-content">
        <div className="content-wrapper">
          <header className="page-header">
            <h1 className="header-title">Manage Delivery People</h1>
            <a href="/admin/add-delivery-person" className="add-button">
              Add New Delivery Person
            </a>
          </header>

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

          <div className="table-container">
            {deliveryPeople.length === 0 ? (
              <p className="no-data-message">
                No delivery people registered yet. Click "Add New Delivery
                Person" to add one.
              </p>
            ) : (
              <table className="data-table">
                <thead className="table-header">
                  <tr>
                    <th scope="col" className="table-th">
                      Full Name
                    </th>
                    <th scope="col" className="table-th">
                      Username
                    </th>
                    <th scope="col" className="table-th">
                      Email
                    </th>
                    <th scope="col" className="table-th">
                      Phone Number
                    </th>
                    <th scope="col" className="table-th">
                      License Number
                    </th>
                    <th scope="col" className="table-th">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="table-body">
                  {deliveryPeople.map((person) => (
                    <tr key={person.delivery_person_id} className="table-row">
                      <td className="table-td-text-bold">
                        {person.dp_full_name}
                      </td>
                      <td className="table-td-text">{person.username}</td>
                      <td className="table-td-text">{person.email}</td>
                      <td className="table-td-text">
                        {person.dp_phone_number}
                      </td>
                      <td className="table-td-text">
                        {person.license_number}
                      </td>
                      <td className="table-td-actions">
                        <a
                          href={`?id=${person.delivery_person_id}`}
                          className="action-button edit-button"
                        >
                          Edit
                        </a>
                        <button
                          onClick={() => handleDeleteClick(person)}
                          className="action-button delete-button"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>

      {showDeleteModal && personToDelete && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-title">Confirm Deletion</h2>
            <p className="modal-message">
              Are you sure you want to delete{' '}
              <strong className="modal-highlight">
                {personToDelete.dp_full_name}
              </strong>{' '}
              and their associated user account? This action cannot be undone.
            </p>
            <div className="modal-actions">
              <button
                onClick={handleDeleteCancel}
                className="modal-button modal-cancel"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="modal-button modal-confirm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
