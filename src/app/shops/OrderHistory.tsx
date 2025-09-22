"use client";

import { useEffect, useState } from "react";

interface Order {
  order_id: number;
  order_date: string | null;
  order_items_summary: string | null;
  total_amount: number | string;
  delivery_person_name: string | null;
  expected_delivery_date: string | null;
  order_status: string;
}

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/orders")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch order history");
        return res.json();
      })
      .then((data) => {
        // Support both {orders: [...]} and [...] API formats
        setOrders(data.orders || data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const getStatusClass = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Delivered":
        return "bg-green-100 text-green-700";
      case "Cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? dateString : date.toLocaleDateString();
  };

  return (
    <div className="p-6">
      {/* Header */}
      <header className="flex justify-between items-center pb-6 border-b border-gray-200 mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">
          Order History
        </h1>
        <div className="text-lg text-gray-700">
          Welcome,{" "}
          <span className="font-semibold text-indigo-600">Customer</span>
        </div>
      </header>

      {/* Messages */}
      {loading && <p className="text-center text-gray-600">Loading...</p>}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Table */}
      {!loading && !error && (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {orders.length === 0 ? (
            <p className="p-6 text-center text-gray-600">
              You have not placed any orders yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Order ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Order Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Items
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Total Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Delivery Person
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Expected Delivery
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr key={order.order_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {order.order_id}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {formatDate(order.order_date)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {order.order_items_summary || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        ${Number(order.total_amount).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {order.delivery_person_name || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {formatDate(order.expected_delivery_date)}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusClass(
                            order.order_status
                          )}`}
                        >
                          {order.order_status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">
                        <a
                          href={/shop/order-details/${order.order_id}}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          View Details
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}