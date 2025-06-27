import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver';

const InventoryReports = () => {
  const [products, setProducts] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [history, setHistory] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  // Fetch all products (non-paginated)
  useEffect(() => {
    axios.get('http://localhost:5000/api/products/getall')
      .then(res => setProducts(res.data.products))
      .catch(err => console.error(err));
  }, []);

  // Fetch paginated movement history for selected product
  useEffect(() => {
    if (selectedId) {
      axios.get(`http://localhost:5000/api/inventory/product-history/${selectedId}?page=${page}&limit=${limit}`)
        .then(res => {
          setHistory(res.data.movements);
          setTotal(res.data.total);
        })
        .catch(err => console.error(err));
    }
  }, [selectedId, page]);

  const totalPages = Math.ceil(total / limit);

  // Fetch full movement history and export all to CSV
  const downloadCSV = async () => {
    if (!selectedId) return;

    try {
      const res = await axios.get(
        `http://localhost:5000/api/inventory/product-history/${selectedId}?page=1&limit=${total}`,
      );
      const allHistory = res.data.movements;

      if (!allHistory.length) return;

      const headers = ['Date', 'Type', 'Quantity', 'Received By', 'Received Date', 'Invoice No', 'Note'];
      const rows = allHistory.map((entry) => [
        new Date(entry.created_at).toLocaleString(),
        entry.change_type,
        entry.quantity,
        entry.received_by || '',
        entry.received_date || '',
        entry.invoice_number || '',
        `"${entry.note || ''}"`,
      ]);

      const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      saveAs(blob, `ProductHistory-${selectedId}.csv`);
    } catch (err) {
      console.error('CSV Download Error:', err);
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow mt-10">
      {/* Top header with title + download button */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">📦 Product History Report</h2>
        <button
          onClick={downloadCSV}
          className="bg-[#c20001] text-white px-6 py-2 rounded hover:bg-black transition"
        >
          Download CSV
        </button>
      </div>

      {/* Product dropdown */}
      <div className="mb-4">
        <label className="block font-medium text-gray-700 mb-2">Select Product</label>
        <select
          value={selectedId}
          onChange={(e) => {
            setSelectedId(e.target.value);
            setPage(1); // reset to first page
          }}
          className="w-full px-4 py-2 border rounded-md"
        >
          <option value="">-- Choose a Product --</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>

      {/* Table section */}
      {history.length > 0 ? (
        <>
          <div className="overflow-x-auto mb-4">
            <table className="min-w-full border text-sm text-gray-700">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2">Type</th>
                  <th className="px-4 py-2">Quantity</th>
                  <th className="px-4 py-2">Received By</th>
                  <th className="px-4 py-2">Received Date</th>
                  <th className="px-4 py-2">Invoice #</th>
                  <th className="px-4 py-2">Note</th>
                </tr>
              </thead>
              <tbody>
                {history.map((h, idx) => (
                  <tr key={idx} className="border-b">
                    <td className="px-4 py-2">{new Date(h.created_at).toLocaleString()}</td>
                    <td className="px-4 py-2 capitalize">{h.change_type}</td>
                    <td className="px-4 py-2">{h.quantity}</td>
                    <td className="px-4 py-2">{h.received_by || '-'}</td>
                    <td className="px-4 py-2">
                      {h.received_date ? new Date(h.received_date).toLocaleDateString(
                        ) : '-'}
                    </td>
                    <td className="px-4 py-2">{h.invoice_number || '-'}</td>
                    <td className="px-4 py-2">{h.note || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination controls */}
          <div className="flex justify-between items-center mb-4">
            <button
              disabled={page <= 1}
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              ← Prev
            </button>
            <span className="text-sm">Page {page} of {totalPages}</span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Next →
            </button>
          </div>
        </>
      ) : selectedId ? (
        <p className="text-gray-500 mt-4">No movement history found for this product.</p>
      ) : null}
    </div>
  );
};

export default InventoryReports;
