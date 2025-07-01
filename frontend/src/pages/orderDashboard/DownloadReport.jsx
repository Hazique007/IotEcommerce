import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver';

const OrdersReport = () => {
  const [orders, setOrders] = useState([]);
  const [filters, setFilters] = useState({
    paymentMethod: '',
    status: '',
    productName: ''
  });

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const fetchOrders = async () => {
    try {
      const query = new URLSearchParams({
        ...filters,
        page
      }).toString();

      const res = await axios.get(`http://localhost:5000/api/orders/admin-orders?${query}`);
      setOrders(res.data.orders);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, filters]);

const downloadCSV = async () => {
  console.log("clicked");
  
  const params = new URLSearchParams({
  paymentMethod: filters.paymentMethod,
  status: filters.status,
  productName: filters.productName,
  noPagination: 'true'
});

  try {
    const res = await axios.get(`http://localhost:5000/api/orders/admin-orders?${params.toString()}`);
    const data = res.data.orders;

    if (!data.length) return alert('No data found to export.');

    const headers = ['Order ID', 'User Email', 'Total Amount', 'Payment Method', 'Status', 'Date', 'Product Name'];
    const rows = data.map(order => [
      order.orderID,
      order.userEmail,
      order.totalAmount,
      order.paymentMethod,
      order.status,
      new Date(order.created_at).toLocaleString(),
      order.productName
    ]);

    const csvArray = [headers, ...rows];
    const csvContent = csvArray.map(row => row.map(field => `"${field}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'OrdersReport.csv');
  } catch (err) {
    console.error('CSV download error:', err);
    alert('Error exporting CSV.');
  }
};


  return (
    <div className="p-6 bg-white rounded-xl shadow mt-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">📄 Orders Report</h2>
        <button onClick={downloadCSV} className="bg-[#c20001] text-white px-6 py-2 rounded hover:bg-black">
          Download CSV
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-4">
        <select
          value={filters.paymentMethod}
          onChange={e => { setFilters(f => ({ ...f, paymentMethod: e.target.value })); setPage(1); }}
          className="border p-2 rounded"
        >
          <option value="">All Payment Methods</option>
          <option value="COD">COD</option>
          <option value="Online">Online</option>
        </select>

        <select
          value={filters.status}
          onChange={e => { setFilters(f => ({ ...f, status: e.target.value })); setPage(1); }}
          className="border p-2 rounded"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
        </select>

        <input
          type="text"
          placeholder="Search by product name"
          value={filters.productName}
          onChange={e => { setFilters(f => ({ ...f, productName: e.target.value })); setPage(1); }}
          className="border p-2 rounded"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm text-gray-700">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2">Order ID</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Product</th>
              <th className="px-4 py-2">Payment</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Amount</th>
              <th className="px-4 py-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, idx) => (
              <tr key={idx} className="border-b">
                <td className="px-4 py-2">{order.orderID}</td>
                <td className="px-4 py-2">{order.userEmail}</td>
                <td className="px-4 py-2">{order.productName}</td>
                <td className="px-4 py-2">{order.paymentMethod}</td>
                <td className="px-4 py-2 capitalize">{order.status}</td>
                <td className="px-4 py-2">₹{order.totalAmount}</td>
                <td className="px-4 py-2">{new Date(order.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 border rounded disabled:opacity-50">
            ← Prev
          </button>
          <span className="text-sm">Page {page} of {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-4 py-2 border rounded disabled:opacity-50">
            Next →
          </button>
        </div>
      )}
    </div>
  );
};

export default OrdersReport;
