import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const MovementHistory = () => {
  const [movements, setMovements] = useState([]);
  const [search, setSearch] = useState('');
  const [type, setType] = useState('all'); // NEW state for filter
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 10;

  // Debounce the search input
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(timeout);
  }, [search]);

  // Fetch movements from backend with query params
  useEffect(() => {
    const fetchMovements = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/inventory/inventory-movement', {
          params: {
            search: debouncedSearch,
            page: currentPage,
            limit: itemsPerPage,
            type: type !== 'all' ? type : undefined, // send type only if not 'all'
          },
        });

        setMovements(res.data.movements || []);
        setTotalCount(res.data.total || 0);
      } catch (err) {
        console.error('Failed to fetch inventory movements:', err);
      }
    };

    fetchMovements();
  }, [debouncedSearch, currentPage, type]);

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  return (
    <motion.div
      className="w-full p-6 bg-white text-gray-900 min-h-screen"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4">
        <h1 className="text-3xl font-bold">Inventory Movement History</h1>

        {/* Filter Dropdown */}
        <select
          value={type}
          onChange={(e) => {
            setType(e.target.value);
            setCurrentPage(1);
          }}
          className="border border-gray-300 px-3 py-2 rounded text-sm w-fit"
        >
          <option value="all">All</option>
          <option value="add">Add</option>
          <option value="deduct">Deduct</option>
        </select>
      </div>

      <input
        type="text"
        placeholder="Search by product name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 px-4 py-2 border border-gray-300 rounded w-full md:w-1/2"
      />

      <div className="overflow-x-auto border border-gray-200 p-4 rounded-xl shadow bg-white">
        <table className="min-w-full text-sm table-auto">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              {['ID', 'Product', 'Type', 'Qty', 'By', 'Date', 'Invoice', 'Note'].map((h) => (
                <th key={h} className="px-4 py-2 text-left font-semibold">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-gray-800">
            {movements.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-6 text-gray-500">
                  No inventory movements found.
                </td>
              </tr>
            ) : (
              movements.map((move) => (
                <tr
                  key={move.id}
                  className="border-t border-gray-100 hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-2">{move.id}</td>
                  <td className="px-4 py-2">{move.product_name}</td>
                  <td
                    className={`px-4 py-2 font-medium ${move.change_type === 'add' ? 'text-green-600' : 'text-red-600'
                      }`}
                  >
                    {move.change_type === 'add' ? 'Add' : 'Deduct'}
                  </td>
                  <td className="px-4 py-2">{move.quantity}</td>
                  <td className="px-4 py-2">{move.received_by || '-'}</td>
                  <td className="px-4 py-2">
                    {move.received_date ? move.received_date.slice(0, 10) : '-'}
                  </td>
                  <td className="px-4 py-2">{move.invoice_number || '-'}</td>
                  <td className="px-4 py-2">{move.note || '-'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>

       
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-6">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              ← Prev
            </button>

            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || totalCount === 0}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Next →
            </button>
          </div>
        )}

      </div>
    </motion.div>
  );
};

export default MovementHistory;
