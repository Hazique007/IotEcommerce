import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FiEdit, FiTrash2 } from 'react-icons/fi';

const AddUseCase = () => {
  const [form, setForm] = useState({
    company: '',
    logo_url: '',
    quote: '',
    name: '',
    position: ''
  });
  const [useCases, setUseCases] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchUseCases = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/usecases/paginated?page=${page}`);
      setUseCases(res.data.data);
      setTotalPages(Math.ceil(res.data.total / 4));
    } catch (err) {
      toast.error('❌ Failed to load use cases');
    }
  };

  useEffect(() => {
    fetchUseCases();
  }, [page]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/usecases/${editingId}`, form);
        toast.success('Use Case Updated!');
        setEditingId(null);
      } else {
        await axios.post('http://localhost:5000/api/usecases', form);
        toast.success(' Use Case Added!');
      }
      setForm({ company: '', logo_url: '', quote: '', name: '', position: '' });
      fetchUseCases();
    } catch (err) {
      toast.error(' Operation failed');
    }
  };

  const handleEdit = (uc) => {
    setForm(uc);
    setEditingId(uc.id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/usecases/${id}`);
      toast.success('🗑️ Use Case Deleted');
      fetchUseCases();
    } catch (err) {
      toast.error('❌ Delete failed');
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-gradient-to-b from-[#c20001] to-black py-10 px-4 text-white"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Add Form */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white/10 backdrop-blur-xl p-8 rounded-xl border border-white/20 shadow-lg"
        >
          <h2 className="text-2xl font-bold text-white mb-6">{editingId ? 'Edit' : 'Add'} Use Case</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            {[{ label: 'Company Name', name: 'company' }, { label: 'Logo URL', name: 'logo_url' }, { label: 'Quote', name: 'quote', textarea: true }, { label: 'Person Name', name: 'name' }, { label: 'Position', name: 'position' }].map(({ label, name, textarea }) => (
              <div key={name}>
                <label className="block text-sm mb-1 text-white font-medium">{label}</label>
                {textarea ? (
                  <textarea
                    name={name}
                    value={form[name]}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-4 py-2 rounded-md border border-white/30 bg-white/10 text-white focus:ring-2 focus:ring-[#c20001] focus:outline-none"
                  />
                ) : (
                  <input
                    type="text"
                    name={name}
                    value={form[name]}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-md border border-white/30 bg-white/10 text-white focus:ring-2 focus:ring-[#c20001] focus:outline-none"
                  />
                )}
              </div>
            ))}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#c20001] to-black text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:opacity-90"
            >
              {editingId ? 'Update' : 'Add'} Use Case
            </button>
          </form>
        </motion.div>

        {/* Display Use Cases */}
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-black/10 backdrop-blur-xl p-8 rounded-xl border border-white/20 shadow-lg"
        >
          <h2 className="text-2xl font-bold text-white mb-6">All Use Cases</h2>
          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
            {useCases.map((uc) => (
              <div key={uc.id} className="bg-white/10 p-4 rounded-lg border border-white/20 flex justify-between items-start gap-4">
                <div className="flex-1">
                  <p className="text-white font-semibold text-lg">{uc.company}</p>
                  <p className="text-gray-300 italic text-sm">"{uc.quote}"</p>
                  <p className="text-sm mt-1">— {uc.name}, <span className="italic text-gray-400">{uc.position}</span></p>
                </div>
                <div className="flex gap-2 items-center">
                  <FiEdit className="cursor-pointer text-yellow-400" onClick={() => handleEdit(uc)} />
                  <FiTrash2 className="cursor-pointer text-red-500" onClick={() => handleDelete(uc.id)} />
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Buttons */}
          <div className="flex justify-center mt-6 gap-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`px-4 py-1 rounded-md text-sm font-medium ${
                  page === i + 1 ? 'bg-[#c20001] text-white' : 'bg-white text-black'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </motion.div>
      </div>

      <ToastContainer position="top-right" autoClose={2000} theme="dark" />
    </motion.section>
  );
};

export default AddUseCase;
