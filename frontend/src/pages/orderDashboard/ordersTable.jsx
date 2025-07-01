import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const [paymentFilter, setPaymentFilter] = useState('');
  const [emailFilter, setEmailFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const fetchOrders = async () => {
  try {
    setLoading(true);

    const params = new URLSearchParams({
      page,
      ...(paymentFilter && { paymentMethod: paymentFilter }),
      ...(emailFilter && { email: emailFilter }),
      ...(dateFilter && { date: dateFilter }),
    });

    const res = await axios.get(`http://localhost:5000/api/orders/admin-orders?${params}`);

    setOrders(res.data.orders);
    setTotalPages(res.data.totalPages);
    setLoading(false);
  } catch (err) {
    console.error('Failed to fetch orders:', err);
    setLoading(false);
  }
};


  useEffect(() => {
    fetchOrders();
  }, [page]);

  const handleFilter = () => {
    setPage(1);
    fetchOrders();
  };

  const resetFilters = () => {
    setEmailFilter('');
    setPaymentFilter('');
    setDateFilter('');
    setPage(1);
    fetchOrders();
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4">All Orders</h2>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by Email"
          value={emailFilter}
          onChange={(e) => setEmailFilter(e.target.value)}
          className="border p-2 rounded w-60"
        />
        <select
          value={paymentFilter}
          onChange={(e) => setPaymentFilter(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All Payment Modes</option>
          <option value="UPI">GPay</option>
          <option value="Credit Card">Credit Card</option>
          <option value="COD">Cash on Delivery</option>
        </select>
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="border p-2 rounded"
        />
        <button onClick={handleFilter} className="bg-blue-500 text-white px-4 py-2 rounded">
          Apply Filters
        </button>
        <button onClick={resetFilters} className="bg-gray-300 px-4 py-2 rounded">
          Reset
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <p>Loading...</p>
      ) : orders.length === 0 ? (
        <p className="text-center text-gray-500">No orders found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3 border-b">Order ID</th>
                <th className="p-3 border-b">Product ID</th>
                <th className="p-3 border-b">Product Name</th>
                <th className="p-3 border-b">User ID</th>
                <th className="p-3 border-b">Email</th>
                <th className="p-3 border-b">Payment</th>
                <th className="p-3 border-b">Amount</th>
                <th className="p-3 border-b">Status</th>
                <th className="p-3 border-b">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50 text-sm">
                  <td className="p-3 border-b">{row.orderID}</td>
                  <td className="p-3 border-b">{row.productID}</td>
                  <td className="p-3 border-b">
                    {row.productName.length > 25
                      ? `${row.productName.slice(0, 25)}...`
                      : row.productName}
                  </td>
                  <td className="p-3 border-b">{row.userID}</td>
                  <td className="p-3 border-b">{row.userEmail}</td>
                  <td className="p-3 border-b">{row.paymentMethod}</td>
                  <td className="p-3 border-b">₹{row.totalAmount}</td>
                  <td className="p-3 border-b">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        row.status === 'pending'
                          ? 'bg-yellow-200 text-yellow-800'
                          : row.status === 'shipped'
                          ? 'bg-orange-200 text-orange-800'
                          : row.status === 'delivered'
                          ? 'bg-green-200 text-green-800'
                          : 'bg-gray-200 text-gray-800'
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="p-3 border-b">
                    {new Date(row.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Previous
        </button>
        <span className="text-sm text-gray-600">
          Page {page} of {totalPages}
        </span>
        <button
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AdminOrders;
