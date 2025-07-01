import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver';

const InventoryReports = () => {
  const [products, setProducts] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [history, setHistory] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  useEffect(() => {
    axios.get('http://localhost:5000/api/products/getall')
      .then(res => setProducts(res.data.products))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!selectedId) return;
    axios.get(`http://localhost:5000/api/inventory/product-history/${selectedId}?page=${page}&limit=${limit}&type=${typeFilter}`)
      .then(res => {
        setHistory(res.data.movements);
        setTotal(res.data.total);
      })
      .catch(console.error);
  }, [selectedId, page, typeFilter]);

  const totalPages = Math.ceil(total / limit);

  const downloadCSV = async () => {
  if (!selectedId) return;

  try {
    const typeParam = typeFilter === 'all' ? '' : `&type=${typeFilter}`;
    const res = await axios.get(
      `http://localhost:5000/api/inventory/product-history/${selectedId}?page=1&limit=${total}${typeParam}`
    );
    const allHistory = res.data.movements;

    if (!allHistory.length) return;

    const headers = ['Date', 'Type', 'Quantity', 'Received By', 'Received Date', 'Invoice #', 'Note'];
    const rows = allHistory.map((entry) => [
      new Date(entry.created_at).toLocaleString(),
      entry.change_type,
      entry.quantity,
      entry.received_by || '',
      entry.received_date ? new Date(entry.received_date).toLocaleDateString() : '',
      entry.invoice_number || '',
      (entry.note || '').replace(/"/g, '""') // escape quotes
    ]);

    const csvArray = [headers, ...rows];
    const csvContent = csvArray
      .map(row =>
        row.map(field => `"${field}"`).join(',') // wrap each field in quotes
      )
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `ProductHistory-${selectedId}.csv`);
  } catch (err) {
    console.error('CSV Download Error:', err);
  }
};


  return (
    <div className="p-6 bg-white rounded-xl shadow mt-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">📦 Product History Report</h2>
        <button onClick={downloadCSV} className="bg-[#c20001] text-white px-6 py-2 rounded hover:bg-black">
          Download CSV
        </button>
      </div>

      {/* Product and Filter Select */}
      <div className="flex flex-wrap gap-4 mb-4">
        <select value={selectedId} onChange={e => { setSelectedId(e.target.value); setPage(1); }} className="border p-2 rounded">
          <option value="">-- Select Product --</option>
          {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>

        <select value={typeFilter} onChange={e => { setTypeFilter(e.target.value); setPage(1); }} className="border p-2 rounded">
          <option value="">All</option>
          <option value="add">Add</option>
          <option value="deduct">Deduct</option>
        </select>
      </div>

      {/* Table */}
      {history.length ? (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full border text-sm text-gray-700">
              <thead className="bg-gray-100">
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
                      {h.received_date ? new Date(h.received_date).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-4 py-2">{h.invoice_number || '-'}</td>
                    <td className="px-4 py-2">{h.note || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 border rounded disabled:opacity-50">
              ← Prev
            </button>
            <span className="text-sm">Page {page} of {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-4 py-2 border rounded disabled:opacity-50">
              Next →
            </button>
          </div>
        </>
      ) : selectedId ? (
        <p className="text-gray-500 mt-4">No movement history found.</p>
      ) : null}
    </div>
  );
};

export default InventoryReports;
