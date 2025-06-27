import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedData, setEditedData] = useState({ username: '', role: '' });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const LIMIT = 10;

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    fetchUsers();
  }, [page, debouncedSearch]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/auth/users', {
        params: { page, limit: LIMIT, search: debouncedSearch },
      });
      setUsers(res.data.users);
      setTotalPages(Math.ceil(res.data.total / LIMIT));
    } catch (err) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setEditingId(user.userID);
    setEditedData({ username: user.username, role: user.role });
  };

  const handleSave = async (userID) => {
    try {
      await axios.put(`http://localhost:5000/api/auth/users/${userID}`, editedData);
      toast.success('User updated');
      setEditingId(null);
      fetchUsers();
    } catch (err) {
      toast.error('Update failed');
    }
  };

  const handleDelete = async (userID) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`http://localhost:5000/api/users/${userID}`);
        toast.success('User deleted');
        fetchUsers();
      } catch (err) {
        toast.error('Delete failed');
      }
    }
  };

  return (
    <div className="p-4 bg-[#f9fafb] text-black max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">User Management</h2>
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Compact Hero UI Table */}
      <div className="overflow-hidden bg-white shadow ring-1 ring-gray-200 rounded-xl">
        <table className="w-full text-sm divide-y divide-gray-100">
          <thead className="bg-gray-50 text-left text-gray-500 uppercase tracking-wide">
            <tr>
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Username</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Role</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              [...Array(10)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="px-4 py-2"><div className="h-4 w-10 bg-gray-200 rounded" /></td>
                  <td className="px-4 py-2"><div className="h-4 w-24 bg-gray-200 rounded" /></td>
                  <td className="px-4 py-2"><div className="h-4 w-36 bg-gray-200 rounded" /></td>
                  <td className="px-4 py-2"><div className="h-4 w-20 bg-gray-200 rounded" /></td>
                  <td className="px-4 py-2"><div className="h-4 w-16 bg-gray-200 rounded" /></td>
                </tr>
              ))
            ) : users.length > 0 ? (
              users.map((u) => (
                <tr key={u.userID} className="hover:bg-gray-50 transition duration-200">
                  <td className="px-4 py-2 font-medium text-gray-700">{u.userID}</td>
                  <td className="px-4 py-2">
                    {editingId === u.userID ? (
                      <input
                        value={editedData.username}
                        onChange={(e) => setEditedData({ ...editedData, username: e.target.value })}
                        className="border px-2 py-1 rounded w-full"
                      />
                    ) : (
                      u.username
                    )}
                  </td>
                  <td className="px-4 py-2 text-gray-600">{u.email}</td>
                  <td className="px-4 py-2">
                    {editingId === u.userID ? (
                      <select
                        value={editedData.role}
                        onChange={(e) => setEditedData({ ...editedData, role: e.target.value })}
                        className="border px-2 py-1 rounded w-full"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    ) : (
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                          u.role === 'admin'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {u.role}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2 flex gap-4 items-center text-gray-500">
                    {editingId === u.userID ? (
                      <button
                        onClick={() => handleSave(u.userID)}
                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
                      >
                        Save
                      </button>
                    ) : (
                      <FiEdit
                        onClick={() => handleEdit(u)}
                        className="cursor-pointer hover:text-yellow-500"
                        size={18}
                      />
                    )}
                    <FiTrash2
                      onClick={() => handleDelete(u.userID)}
                      className="cursor-pointer hover:text-red-500"
                      size={18}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-400">No users found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex justify-center items-center space-x-4">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className={`px-4 py-2 rounded bg-[#c20001] text-white font-semibold ${
            page === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-600'
          }`}
        >
          Prev
        </button>
        <span className="text-sm text-gray-700">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
          className={`px-4 py-2 rounded bg-[#c20001] text-white font-semibold ${
            page === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-600'
          }`}
        >
          Next
        </button>
      </div>

      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
    </div>
  );
};

export default Users;
