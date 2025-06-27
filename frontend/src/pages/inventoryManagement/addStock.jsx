import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion } from 'framer-motion';

const AddStock = () => {
  const [form, setForm] = useState({
    product_id: '',
    quantity: '',
    invoice_number: '',
    received_by: '',
    received_date: '',
    note: ''
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      change_type: 'add',
      quantity_received: form.quantity
    };

    try {
      await axios.post('http://localhost:5000/api/inventory/inventory-movement', payload);
      toast.success('✅ Stock entry added');
      setForm({
        product_id: '',
        quantity: '',
        invoice_number: '',
        received_by: '',
        received_date: '',
        note: ''
      });
    } catch (err) {
      console.error(err);
      toast.error('❌ Failed to add stock');
    }
  };

  return (
    <motion.div
      className="w-full p-6 bg-white text-gray-900 min-h-screen"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h1 className="text-3xl font-bold mb-6">Add Inventory Entry</h1>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white border border-gray-200 p-6 rounded-xl shadow"
      >
        {[
          ['Product ID', 'product_id', 'text'],
          ['Quantity Received', 'quantity', 'number'],
          ['Invoice Number', 'invoice_number', 'text'],
          ['Received By', 'received_by', 'text']
        ].map(([label, name, type]) => (
          <div key={name}>
            <label className="block text-sm font-medium mb-1">{label}</label>
            <input
              type={type}
              name={name}
              value={form[name]}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        ))}

        {/* Date Picker */}
        <div>
          <label className="block text-sm font-medium mb-1">Received Date</label>
          <input
            type="date"
            name="received_date"
            value={form.received_date}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Optional Note */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Notes (optional)</label>
          <textarea
            name="note"
            rows="3"
            value={form.note}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Any remarks or additional info"
          />
        </div>

        {/* Submit */}
        <div className="md:col-span-2">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Submit
          </button>
        </div>
      </form>

      <ToastContainer position="top-center" autoClose={2000} />
    </motion.div>
  );
};

export default AddStock;
