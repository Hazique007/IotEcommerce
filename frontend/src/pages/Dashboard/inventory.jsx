import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 5;

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 700);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    fetchProducts();
  }, [page, debouncedSearch]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/products/getallproducts', {
        params: { page, search: debouncedSearch },
      });
      setProducts(res.data.products);
      setTotalItems(res.data.total);
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditId(product.id);
    setEditedData({ ...product });
  };

  const handleCancel = () => {
    setEditId(null);
    setEditedData({});
  };

  const handleChange = (field, value) => {
    setEditedData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      await axios.put(`http://localhost:5000/api/products/${editId}`, editedData);
      toast.success(`Product ID ${editId} updated successfully`);
      setEditId(null);
      setEditedData({});
      fetchProducts();
    } catch (err) {
      console.error('Error updating product:', err);
      toast.error('Failed to update product');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`);
      toast.success(`Deleted product ID ${id}`);
      fetchProducts();
    } catch (err) {
      console.error('Error deleting product:', err);
      toast.error('Failed to delete product');
    }
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <div className="p-6 w-full">
      <div className="flex flex-col lg:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-3xl font-bold text-gray-800">Product Inventory</h2>
        <input
          type="text"
          placeholder="Search by product name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full lg:w-[350px] px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="overflow-x-auto rounded-xl shadow-md bg-white">
        <table className="w-full min-w-[1000px] text-sm text-left">
          <thead className="bg-[#f9fafb] text-gray-600 font-semibold border-b border-gray-200">
            <tr>
              <th className="px-5 py-4">ID</th>
              <th className="px-5 py-4">Name</th>
              <th className="px-5 py-4">Description</th>
              <th className="px-5 py-4">Price</th>
              <th className="px-5 py-4">Image</th>
              <th className="px-5 py-4">F1</th>
              <th className="px-5 py-4">F2</th>
              <th className="px-5 py-4">F3</th>
              <th className="px-5 py-4">Quantity</th>
              <th className="px-5 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {loading
              ? [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse border-b border-gray-100">
                    {[...Array(10)].map((__, j) => (
                      <td key={j} className="px-5 py-4">
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                      </td>
                    ))}
                  </tr>
                ))
              : products.map((product) => {
                  const isEditing = editId === product.id;
                  return (
                    <tr key={product.id} className="hover:bg-gray-50 border-b border-gray-100 transition-all duration-200">
                      <td className="px-5 py-4">{product.id}</td>
                      <td className="px-5 py-4">
                        {isEditing ? (
                          <input
                            className="w-full bg-gray-100 px-2 py-1 rounded outline-none border border-gray-300"
                            value={editedData.name || ''}
                            onChange={(e) => handleChange('name', e.target.value)}
                          />
                        ) : (
                          product.name
                        )}
                      </td>
                      <td className="px-5 py-4 max-w-[250px]">
                        {isEditing ? (
                          <textarea
                            className="w-full bg-gray-100 px-2 py-1 rounded outline-none border border-gray-300"
                            value={editedData.description || ''}
                            onChange={(e) => handleChange('description', e.target.value)}
                            rows={2}
                          />
                        ) : (
                          <span className="line-clamp-2" title={product.description}>
                            {product.description}
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        {isEditing ? (
                          <input
                            type="number"
                            className="w-full bg-gray-100 px-2 py-1 rounded outline-none border border-gray-300"
                            value={editedData.price || ''}
                            onChange={(e) => handleChange('price', e.target.value)}
                          />
                        ) : (
                          `$${product.price}`
                        )}
                      </td>
                      <td className="px-5 py-4">
                        {isEditing ? (
                          <input
                            className="w-full bg-gray-100 px-2 py-1 rounded outline-none border border-gray-300"
                            value={editedData.image_url || ''}
                            onChange={(e) => handleChange('image_url', e.target.value)}
                          />
                        ) : (
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded-md shadow-sm"
                          />
                        )}
                      </td>
                      {['f1', 'f2', 'f3'].map((field) => (
                        <td key={field} className="px-5 py-4">
                          {isEditing ? (
                            <textarea
                              className="w-full bg-gray-100 px-2 py-1 rounded outline-none border border-gray-300"
                              value={editedData[field] || ''}
                              onChange={(e) => handleChange(field, e.target.value)}
                              rows={1}
                            />
                          ) : (
                            product[field]
                          )}
                        </td>
                      ))}
                      <td className="px-5 py-4">
                        {isEditing ? (
                          <input
                            type="number"
                            min={0}
                            className="w-full bg-gray-100 px-2 py-1 rounded outline-none border border-gray-300"
                            value={editedData.quantity || ''}
                            onChange={(e) => handleChange('quantity', e.target.value)}
                          />
                        ) : (
                          <span className={`${product.quantity < 5 ? 'text-red-600 font-semibold' : ''}`}>
                            {product.quantity}
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-center">
                        <div className="flex justify-center gap-3">
                          {isEditing ? (
                            <>
                              <button onClick={handleSave} className="text-green-600 hover:text-green-700">
                                <FaCheck />
                              </button>
                              <button onClick={handleCancel} className="text-gray-600 hover:text-gray-800">
                                <FaTimes />
                              </button>
                            </>
                          ) : (
                            <>
                              <button onClick={() => handleEdit(product)} className="text-blue-600 hover:text-blue-700">
                                <FaEdit />
                              </button>
                              <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-red-700">
                                <FaTrash />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center gap-4 mt-6">
        <button
          disabled={page <= 1}
          onClick={() => setPage((prev) => prev - 1)}
          className="bg-gray-200 text-gray-800 px-4 py-2 rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span className="text-gray-700 font-semibold">
          Page {page} of {totalPages}
        </span>
        <button
          disabled={page >= totalPages}
          onClick={() => setPage((prev) => prev + 1)}
          className="bg-gray-200 text-gray-800 px-4 py-2 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
};

export default Inventory;
