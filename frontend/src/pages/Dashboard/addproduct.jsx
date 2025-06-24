import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddProduct = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [f1, setf1] = useState('');
  const [f2, setf2] = useState('');
  const [f3, setf3] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/products/add', {
        name,
        description,
        price,
        image_url: imageUrl,
        f1,
        f2,
        f3,
        
      });
      toast.success(' Product added successfully!');
      setName('');
      setDescription('');
      setPrice('');
      setImageUrl('');
      setf1('');
      setf2('');
      setf3('');
      
    } catch (err) {
      toast.error('❌ Failed to add product');
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Add New Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
        <input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          placeholder="Product Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded"
          required
        ></textarea>
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
         <input
          type="text"
          placeholder="Image URL"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />






        <textarea
          placeholder="Feature 1"
          value={f1}
          onChange={(e) => setf1(e.target.value)}
          className="w-full p-2 border rounded"
          required
        ></textarea>
        <textarea
          placeholder="Feature 2"
          value={f2}
          onChange={(e) => setf2(e.target.value)}
          className="w-full p-2 border rounded"
          required
        ></textarea>
        <textarea
          placeholder="Feature 3"
          value={f3}
          onChange={(e) =>setf3(e.target.value)}
          className="w-full p-2 border rounded"
          required
        ></textarea>
       
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Add Product
        </button>
      </form>

      {/* Toast container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        pauseOnHover
        theme="dark"
      />
    </div>
  );
};

export default AddProduct;
