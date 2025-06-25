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

  const LIMIT = 10;

  useEffect(() => {
    fetchUsers();
  }, [page, search]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/auth/users`, {
        params: { page, limit: LIMIT, search }
      });
      setUsers(res.data.users);
      setTotalPages(Math.ceil(res.data.total / LIMIT));
    } catch (err) {
      console.error(err);
      toast.error('Failed to load users');
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
      console.error(err);
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
        console.error(err);
        toast.error('Delete failed');
      }
    }
  };

  return (
    <div className="p-6 text-white min-h-screen bg-[#f5f5f5] rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-black">User Management</h2>
        <input
          type="text"
          placeholder="Search by username..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="px-4 py-2 w-64 text-sm text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="overflow-x-auto bg-[#161b22] rounded-xl shadow-lg">
        <table className="min-w-full text-sm text-left table-auto border-collapse">
          <thead className="bg-[#1f2937] uppercase text-gray-400 text-xs">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Username</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr
                key={u.userID}
                className={`border-b border-gray-700 hover:bg-gray-800 transition ${
                  editingId === u.userID ? 'bg-gray-800/50' : ''
                }`}
              >
                <td className="px-4 py-3">{u.userID}</td>
                <td className="px-4 py-3">
                  {editingId === u.userID ? (
                    <input
                      value={editedData.username}
                      onChange={(e) => setEditedData({ ...editedData, username: e.target.value })}
                      className="bg-gray-700 px-2 py-1 rounded text-white outline-none"
                    />
                  ) : (
                    u.username
                  )}
                </td>
                <td className="px-4 py-3 text-gray-300">{u.email}</td>
                <td className="px-4 py-3">
                  {editingId === u.userID ? (
                    <select
                      value={editedData.role}
                      onChange={(e) => setEditedData({ ...editedData, role: e.target.value })}
                      className="bg-gray-700 px-2 py-1 rounded text-white outline-none"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  ) : (
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        u.role === 'admin' ? 'bg-green-600' : 'bg-blue-600'
                      }`}
                    >
                      {u.role}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 flex items-center gap-3">
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
                      className="cursor-pointer hover:text-yellow-400"
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
            ))}
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
        <span className="text-black font-medium">
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
