"use client";
import React, { useState, useEffect } from 'react';
// 1. Import Firebase directly from the SDK
import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getAuth, 
  signInWithCustomToken, 
  signInAnonymously, 
  onAuthStateChanged,
  User
} from "firebase/auth";
import { getFirestore, setLogLevel } from "firebase/firestore";

// 2. Firebase Configuration
// Replace these strings with your actual Firebase project keys
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// 3. Initialize Firebase safely (prevents re-initialization errors)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Enable Firestore debug logging
setLogLevel('debug');

type Order = {
  order_id: number;
  order_date: string;
  status: string;
  total_amount: number;
  expected_delivery_date: string;
  shop_name: string;
  shop_address: string;
  order_items_summary: string;
  delivery_person_id: string | null;
};

const DeliveryDashboard = () => {
  const [assignedDeliveries, setAssignedDeliveries] = useState<Order[]>([]);
  const [availableOrders, setAvailableOrders] = useState<Order[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  // Note: Replace this with your actual token logic or environment variable
  const initialAuthToken = typeof window !== 'undefined' ? (window as any).__initial_auth_token : null;

  useEffect(() => {
    // Handle Authentication
    if (initialAuthToken) {
      signInWithCustomToken(auth, initialAuthToken).catch((error) => {
        console.error("Firebase sign-in with custom token failed:", error);
        signInAnonymously(auth);
      });
    } else {
      signInAnonymously(auth);
    }

    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
      setIsAuthReady(true);
    });

    return () => unsubscribe();
  }, [initialAuthToken]);

  useEffect(() => {
    if (!isAuthReady || !userId) return;

    // Mock Data for testing
    const mockOrders: Order[] = [
      {
        order_id: 101,
        order_date: '2023-10-26T10:00:00',
        status: 'Admin Confirmed',
        total_amount: 45.50,
        expected_delivery_date: '2023-10-27',
        shop_name: 'Green Grocers',
        shop_address: '123 Forest Path, Woodland',
        order_items_summary: '2x Shiitake, 1x Oyster',
        delivery_person_id: null
      },
      {
        order_id: 102,
        order_date: '2023-10-25T14:30:00',
        status: 'Assigned for Delivery',
        total_amount: 75.00,
        expected_delivery_date: '2023-10-26',
        shop_name: 'Mushroom Market',
        shop_address: '456 Hill Street, Meadowville',
        order_items_summary: '5x Cremini, 3x Portobello',
        delivery_person_id: userId
      }
    ];

    setAssignedDeliveries(mockOrders.filter(o => o.delivery_person_id === userId));
    setAvailableOrders(mockOrders.filter(o => o.status === 'Admin Confirmed' && !o.delivery_person_id));
  }, [isAuthReady, userId]);

  const handleAcceptOrder = (orderId: number) => {
    // FIXED: Use the .find() method on the array directly
    const acceptedOrder = availableOrders.find((order) => order.order_id === orderId);
    
    if (acceptedOrder) {
      setAvailableOrders(availableOrders.filter(order => order.order_id !== orderId));
      const updatedOrder = { ...acceptedOrder, status: 'Assigned for Delivery', delivery_person_id: userId };
      setAssignedDeliveries([...assignedDeliveries, updatedOrder]);
      setSuccessMessage(`Order ${orderId} has been successfully accepted!`);
    } else {
      setErrorMessage(`Failed to accept order ${orderId}.`);
    }

    setTimeout(() => { setSuccessMessage(''); setErrorMessage(''); }, 3000);
  };

  const handleUpdateStatus = (orderId: number, newStatus: string) => {
    const updated = assignedDeliveries.map(o => o.order_id === orderId ? { ...o, status: newStatus } : o);
    setAssignedDeliveries(updated);
    setSuccessMessage(`Order ${orderId} updated to '${newStatus}'!`);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Assigned for Delivery': return 'bg-indigo-100 text-indigo-600';
      case 'Out for Delivery': return 'bg-red-100 text-red-600';
      case 'Delivered': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-200 text-gray-800';
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F0E6D9]" style={{ fontFamily: 'Inter, sans-serif' }}>
      <aside className="w-64 bg-[#D2C8B5] p-6 shadow-xl">
        <div className="text-2xl font-bold text-gray-800 mb-8">Delivery Panel</div>
        <nav>
          <ul className="space-y-4">
            <li><a href="#" className="block px-4 py-3 rounded-lg bg-white font-semibold border-2 border-blue-500">Assigned Deliveries</a></li>
            <li><a href="#" className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-white">Delivery History</a></li>
            <li><button className="block w-full text-left px-4 py-3 rounded-lg text-red-600 hover:bg-red-100" onClick={() => auth.signOut()}>Logout</button></li>
          </ul>
        </nav>
      </aside>

      <div className="flex-1 p-10 relative">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/Background.jpg')" }}>
          <div className="absolute inset-0 bg-white opacity-70"></div>
        </div>

        <div className="relative z-10">
          <header className="flex justify-between items-center pb-8 mb-8">
            <h1 className="text-4xl font-extrabold text-gray-900">Delivery Dashboard</h1>
          </header>

          <div className="bg-gray-100 p-4 rounded-lg mb-6 shadow-sm">
            <p className="text-sm font-medium text-gray-700">User ID: <span className="font-mono">{userId || 'Loading...'}</span></p>
          </div>

          {successMessage && <div className="bg-green-100 text-green-700 p-4 rounded mb-4">{successMessage}</div>}
          {errorMessage && <div className="bg-red-100 text-red-700 p-4 rounded mb-4">{errorMessage}</div>}

          {/* Available Orders Section */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">Available Orders</h2>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full">
                <thead className="bg-[#D2C8B5]">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase">Order ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase">Shop</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {availableOrders.map(order => (
                    <tr key={order.order_id}>
                      <td className="px-6 py-4">{order.order_id}</td>
                      <td className="px-6 py-4">{order.shop_name}</td>
                      <td className="px-6 py-4">
                        <button onClick={() => handleAcceptOrder(order.order_id)} className="bg-green-600 text-white px-4 py-2 rounded">Accept</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Assigned Deliveries Section */}
          <section>
            <h2 className="text-2xl font-bold mb-4">Your Deliveries</h2>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full">
                <thead className="bg-[#D2C8B5]">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase">Order ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase">Update</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {assignedDeliveries.map(delivery => (
                    <tr key={delivery.order_id}>
                      <td className="px-6 py-4">{delivery.order_id}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(delivery.status)}`}>{delivery.status}</span>
                      </td>
                      <td className="px-6 py-4">
                        {delivery.status === 'Assigned for Delivery' && (
                          <button onClick={() => handleUpdateStatus(delivery.order_id, 'Out for Delivery')} className="bg-blue-600 text-white px-4 py-2 rounded">Ship It</button>
                        )}
                        {delivery.status === 'Out for Delivery' && (
                          <button onClick={() => handleUpdateStatus(delivery.order_id, 'Delivered')} className="bg-green-600 text-white px-4 py-2 rounded">Delivered</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default DeliveryDashboard;