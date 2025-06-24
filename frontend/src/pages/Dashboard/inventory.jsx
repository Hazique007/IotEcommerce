import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editedData, setEditedData] = useState({});

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/products/getallproducts');
      setProducts(res.data);
    } catch (err) {
      console.error('Error fetching products:', err);
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
      const deletedProduct = products.find((p) => p.id === id);
      await axios.delete(`http://localhost:5000/api/products/${id}`);
      toast.success(`Deleted: ${deletedProduct?.name || 'Product'} (ID ${id})`);
      setProducts(products.filter((p) => p.id !== id));
    } catch (err) {
      console.error('Error deleting product:', err);
      toast.error('Failed to delete product');
    }
  };

  return (
    <div className="p-6 w-full">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Product Inventory</h2>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse rounded-lg shadow-md bg-white overflow-hidden">
          <thead className="bg-gray-100 text-gray-600 uppercase text-sm">
            <tr>
              <th className="py-3 px-6 text-left">ID</th>
              <th className="py-3 px-6 text-left">Name</th>
              <th className="py-3 px-6 text-left">Description</th>
              <th className="py-3 px-6 text-left">Price</th>
              <th className="py-3 px-6 text-left">Image</th>
              <th className="py-3 px-6 text-left">f1</th>
              <th className="py-3 px-6 text-left">f2</th>
              <th className="py-3 px-6 text-left">f3</th>
              <th className="py-3 px-6 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {products.map((product, index) => {
              const isEditing = editId === product.id;

              return (
                <tr key={product.id} className={`border-b ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                  <td className="py-3 px-6">{product.id}</td>

                  <td className="py-3 px-6">
                    {isEditing ? (
                      <input
                        className="border px-2 py-1 rounded w-full"
                        value={editedData.name || ''}
                        onChange={(e) => handleChange('name', e.target.value)}
                      />
                    ) : (
                      product.name
                    )}
                  </td>

                  <td className="py-3 px-6 max-w-[250px]">
                    {isEditing ? (
                      <textarea
                        className="border px-2 py-1 rounded w-full resize-y overflow-auto"
                        value={editedData.description || ''}
                        onChange={(e) => handleChange('description', e.target.value)}
                        rows={3}
                      />
                    ) : (
                      <div
                        className="line-clamp-3 max-w-[220px] text-sm text-gray-800"
                        title={product.description}
                      >
                        {product.description}
                      </div>
                    )}
                  </td>



                  <td className="py-3 px-6">
                    {isEditing ? (
                      <input
                        type="number"
                        className="border px-2 py-1 rounded w-full"
                        value={editedData.price || ''}
                        onChange={(e) => handleChange('price', e.target.value)}
                      />
                    ) : (
                      `$${product.price}`
                    )}
                  </td>

                  <td className="py-3 px-6">
                    {isEditing ? (
                      <input
                        className="border px-2 py-1 rounded w-full"
                        value={editedData.image_url || ''}
                        onChange={(e) => handleChange('image_url', e.target.value)}
                      />
                    ) : (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-14 h-14 object-cover rounded-md border"
                      />
                    )}
                  </td>

                  <td className="py-3 px-6">
                    {isEditing ? (
                      <textarea
                        className="border px-2 py-1 rounded w-full"
                        value={editedData.f1 || ''}
                        onChange={(e) => handleChange('f1', e.target.value)}
                      />
                    ) : (
                      product.f1
                    )}
                  </td>
                  <td className="py-3 px-6">
                    {isEditing ? (
                      <textarea
                        className="border px-2 py-1 rounded w-full"
                        value={editedData.f2 || ''}
                        onChange={(e) => handleChange('f2', e.target.value)}
                      />
                    ) : (
                      product.f2
                    )}
                  </td>
                  <td className="py-3 px-6">
                    {isEditing ? (
                      <textarea
                        className="border px-2 py-1 rounded w-full"
                        value={editedData.f3 || ''}
                        onChange={(e) => handleChange('f3', e.target.value)}
                      />
                    ) : (
                      product.f3
                    )}
                  </td>


                  <td className="py-3 px-6">
                    <div className="flex gap-3">
                      {isEditing ? (
                        <>
                          <button
                            onClick={handleSave}
                            className="text-green-600 hover:text-green-800 transition"
                          >
                            <FaCheck />
                          </button>
                          <button
                            onClick={handleCancel}
                            className="text-gray-600 hover:text-gray-800 transition"
                          >
                            <FaTimes />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEdit(product)}
                            className="text-blue-600 hover:text-blue-800 transition"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="text-red-600 hover:text-red-800 transition"
                          >
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
