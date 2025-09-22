import React, { useState, useEffect } from 'react';


const DeliveryDashboard = () => {
  const [assignedDeliveries, setAssignedDeliveries] = useState<DeliveryRecord[]>([]);
  const [availableOrders, setAvailableOrders] = useState<DeliveryRecord[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  

  useEffect(() => {

    const mockOrders:DeliveryRecord[] = [
      {
        order_id: 101,
        order_date: '2023-10-26T10:00:00',
        status: 'Admin Confirmed',
        total_amount: 45.50,
        expected_delivery_date: '2023-10-27',
        shop_name: 'Green Grocers',
        shop_address: '123 Forest Path, Woodland',
        order_items_summary: '2x Shiitake, 1x Oyster',
        delivery_person_id: null,
        delivery_date: null,
      },
      {
        order_id: 102,
        order_date: '2023-10-25T14:30:00',
        status: 'Assigned for delivery',
        total_amount: 75.00,
        expected_delivery_date: '2023-10-26',
        shop_name: 'Mushroom Market',
        shop_address: '456 Hill Street, Meadowville',
        order_items_summary: '5x Cremini, 3x Portobello',
        delivery_person_id: 123,
        delivery_date: null,
      },
      {
        order_id: 103,
        order_date: '2023-10-26T09:00:00',
        status: 'Out for delivery',
        total_amount: 25.25,
        expected_delivery_date: '2023-10-26',
        shop_name: 'Fungi Friends',
        shop_address: '789 Grove Avenue, Green Acres',
        order_items_summary: '1x Truffle',
        delivery_person_id: 547,
        delivery_date: null,
      },
      {
        order_id: 104,
        order_date: '2023-10-25T11:45:00',
        status: 'Admin Confirmed',
        total_amount: 32.00,
        expected_delivery_date: '2023-10-27',
        shop_name: 'Shop C',
        shop_address: '101 Pine Road, Woodville',
        order_items_summary: '4x Lion\'s Mane',
        delivery_person_id: null,
        delivery_date: null,
      },
    ];

    const assigned:DeliveryRecord[] = mockOrders.filter(order => order.delivery_person_id === 104);
    const available:DeliveryRecord[] = mockOrders.filter(order => order.status === 'Admin Confirmed' && !order.delivery_person_id);
    
    setAssignedDeliveries(assigned);
    setAvailableOrders(available);

  }, [userId]);

  const handleLogout = () => {
    setSuccessMessage('Logging out...');
    setTimeout(() => {
      setSuccessMessage('');
      // In a real app, you would sign out here:
      // auth.signOut();
    }, 2000);
  };

  const handleAcceptOrder = (orderId: number) => {
    setAvailableOrders(availableOrders.filter(order => order.order_id !== orderId));
    
    const acceptedOrder = mockOrders.find(order => order.order_id === orderId);
    if (acceptedOrder) {
      const updatedOrder = { ...acceptedOrder, status: 'Assigned for delivery', delivery_person_id: userId };
      setAssignedDeliveries([...assignedDeliveries, updatedOrder]);
      setSuccessMessage(`Order ${orderId} has been successfully accepted!`);
    } else {
      setErrorMessage(`Failed to accept order ${orderId}.`);
    }

    setTimeout(() => setSuccessMessage(''), 3000);
    setTimeout(() => setErrorMessage(''), 3000);
  };

  const handleUpdateStatus = (orderId, newStatus) => {
    const updatedDeliveries = assignedDeliveries.map(order => 
      order.order_id === orderId ? { ...order, status: newStatus } : order
    );
    setAssignedDeliveries(updatedDeliveries);
    setSuccessMessage(`Order ${orderId} status updated to '${newStatus}'!`);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Assigned for delivery': return 'bg-indigo-100 text-indigo-600';
      case 'Out for delivery': return 'bg-red-100 text-red-600';
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
            <li>
              <a href="#" className="block px-4 py-3 rounded-lg bg-white font-semibold border-2 border-blue-500 transition-all duration-200">
                Assigned Deliveries
              </a>
            </li>
            <li>
              <a href="#" className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-white hover:text-gray-800 transition-all duration-200">
                Delivery History
              </a>
            </li>
            <li>
              <a href="#" className="block w-full text-left px-4 py-3 rounded-lg text-red-600 hover:bg-red-100 hover:text-red-700 transition-all duration-200" onClick={handleLogout}>
                Logout
              </a>
            </li>
          </ul>
        </nav>
      </aside>
      <div className="flex-1 p-10 relative">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/backgroung.jpg')" }}
        >
          <div className="absolute inset-0 bg-white opacity-70"></div>
        </div>
        <div className="relative z-10">
          <header className="flex justify-between items-center pb-8 mb-8">
            <h1 className="text-4xl font-extrabold text-gray-900">Delivery Dashboard</h1>
          </header>

          <div className="bg-gray-100 p-4 rounded-lg mb-6 shadow-sm">
            <p className="text-sm font-medium text-gray-700">Your User ID: <span className="font-mono text-gray-900">{userId || 'Loading...'}</span></p>
          </div>

          {errorMessage && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-6" role="alert">
              <strong className="font-bold">Error!</strong>
              <span className="block sm:inline ml-2">{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg relative mb-6" role="alert">
              <strong className="font-bold">Success!</strong>
              <span className="block sm:inline ml-2">{successMessage}</span>
            </div>
          )}

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Available Orders to Accept</h2>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              {availableOrders.length === 0 ? (
                <p className="p-6 text-center text-gray-600">No new orders are currently available for assignment.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-[#D2C8B5]">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Order ID</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Order Date</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Shop Name</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Address</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Items Summary</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Total Amount</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {availableOrders.map((order) => (
                        <tr key={order.order_id} className="bg-white even:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.order_id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{new Date(order.order_date).toLocaleString()}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{order.shop_name}</td>
                          <td className="px-6 py-4 text-sm text-gray-600 max-w-xs overflow-hidden text-ellipsis">{order.shop_address}</td>
                          <td className="px-6 py-4 text-sm text-gray-600 max-w-xs overflow-hidden text-ellipsis">{order.order_items_summary}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">Rs{order.total_amount.toFixed(2)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button onClick={() => handleAcceptOrder(order.order_id)} className="bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-green-700 transition-colors duration-200">
                              Accept Order
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Assigned Deliveries</h2>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              {assignedDeliveries.length === 0 ? (
                <p className="p-6 text-center text-gray-600">No active deliveries assigned to you at this time.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-[#D2C8B5]">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Order ID</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Order Date</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Shop Name</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Address</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Items Summary</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Total Amount</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Status</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {assignedDeliveries.map((delivery) => (
                        <tr key={delivery.order_id} className="bg-white even:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{delivery.order_id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{new Date(delivery.order_date).toLocaleString()}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{delivery.shop_name}</td>
                          <td className="px-6 py-4 text-sm text-gray-600 max-w-xs overflow-hidden text-ellipsis">{delivery.shop_address}</td>
                          <td className="px-6 py-4 text-sm text-gray-600 max-w-xs overflow-hidden text-ellipsis">{delivery.order_items_summary}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">${delivery.total_amount.toFixed(2)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={`px-3 py-1.5 rounded-full font-semibold text-xs ${getStatusBadgeClass(delivery.status)}`}>
                              {delivery.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            {delivery.status === 'Assigned for delivery' && (
                              <button onClick={() => handleUpdateStatus(delivery.order_id, 'Out for delivery')} className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-200">
                                Mark Out for Delivery
                              </button>
                            )}
                            {delivery.status === 'Out for delivery' && (
                              <button onClick={() => handleUpdateStatus(delivery.order_id, 'Delivered')} className="bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-green-700 transition-colors duration-200">
                                Mark Delivered
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default DeliveryDashboard;
