'use client';
import React, { useState, useEffect } from 'react';
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
        .table-header { background-color: #f9fafb; }
        .table-row:nth-child(even) { background-color: #f3f4f6; }
        .action-button { padding: 0.5rem 1rem; border-radius: 0.5rem; font-weight: 500; transition: background-color 0.2s ease-in-out, transform 0.1s ease-in-out; }
        .edit-button { background-color: #2563eb; color: white; }
        .edit-button:hover { background-color: #1d4ed8; transform: translateY(-1px); }
        .delete-button { background-color: #dc2626; color: white; }
        .delete-button:hover { background-color: #b91c1c; transform: translateY(-1px); }
        .add-button { background-color: #10b981; color: white; padding: 0.75rem 1.5rem; border-radius: 0.5rem; font-weight: 600; transition: background-color 0.2s ease-in-out; }
        .add-button:hover { background-color: #059669; }
        .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); display: flex; justify-content: center; align-items: center; z-index: 50; }
        .modal-content { background-color: white; padding: 2rem; border-radius: 0.75rem; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); max-width: 28rem; width: 90%; }
        .modal-button { padding: 0.5rem 1rem; border-radius: 0.5rem; font-weight: 600; transition: background-color 0.2s ease-in-out; }
        .modal-confirm { background-color: #dc2626; color: white; }
        .modal-confirm:hover { background-color: #b91c1c; }
        .modal-cancel { background-color: #e5e7eb; color: #374151; }
        .modal-cancel:hover { background-color: #d1d5db; }
      `}</style>

      <aside className="w-64 bg-white shadow-md h-screen p-6">
        <div className="text-2xl font-bold text-gray-800 mb-8">Admin Panel</div>
        <nav>
          <ul className="space-y-2">
            <li><a href="/admin/admin-dashboard" className="nav-link">Dashboard</a></li>
            <li><a href="/admin/manage-shops" className="nav-link">Manage Shops</a></li>
            <li><a href="/admin/manage-delivery-people" className="nav-link active">Manage Delivery People</a></li>
            <li><a href="/admin/view-all-orders" className="nav-link">View All Orders</a></li>
            <li><a href="/admin/report" className="nav-link">Reports</a></li>
            <li><a href="/admin/setting" className="nav-link">Settings</a></li>
            <li><a href="/login" className="nav-link text-red-600 hover:bg-red-100 hover:text-red-700">Logout</a></li>
          </ul>
        </nav>
      </aside>

      <div className="flex-1 p-10">
        <header className="flex justify-between items-center pb-8 border-b border-gray-200 mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900">Manage Delivery People</h1>
          <a href="add_delivery_person.php" className="add-button">
            Add New Delivery Person
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

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {deliveryPeople.length === 0 ? (
            <p className="p-6 text-center text-gray-600">No delivery people registered yet. Click "Add New Delivery Person" to add one.</p>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="table-header">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Full Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone Number</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">License Number</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {deliveryPeople.map(person => (
                  <tr key={person.delivery_person_id} className="table-row">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{person.dp_full_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{person.username}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{person.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{person.dp_phone_number}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{person.license_number}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <a href={`edit_delivery_person.php?id=${person.delivery_person_id}`} className="action-button edit-button mr-2">Edit</a>
                      <button onClick={() => handleDeleteClick(person)} className="action-button delete-button">
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

      {showDeleteModal && personToDelete && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Confirm Deletion</h2>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete <strong className="font-bold">{personToDelete.dp_full_name}</strong> and their associated user account? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button onClick={handleDeleteCancel} className="modal-button modal-cancel">Cancel</button>
              <button onClick={handleDeleteConfirm} className="modal-button modal-confirm">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
