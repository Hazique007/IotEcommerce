import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { motion } from 'framer-motion';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaStar, FaShoppingCart } from 'react-icons/fa';
import { IoArrowBack } from 'react-icons/io5';
import { useNavigate, useParams } from 'react-router-dom';
import { useCart } from '../context/cartcontext';

const ProductDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [cartShake, setCartShake] = useState(false);
  const [loading, setLoading] = useState(true);

  const { addItem, getTotalCount, fetchCart } = useCart();

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:5000/api/products/${id}`)
      .then((res) => {
        setProduct(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        toast.error('Failed to load product');
        setLoading(false);
      });
  }, [id]);

  const addToCart = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      toast.error('⚠️ You must login before adding to cart.');
      setTimeout(() => navigate('/login'), 2000);
      return;
    }

    try {
      await axios.post(
        'http://localhost:5000/api/cart/add',
        {
          productID: product.id,
          quantity: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      addItem(product); // local context
      await fetchCart(); // sync with DB
      setCartShake(true);
      toast.success('🛒 Added to cart!');
      setTimeout(() => setCartShake(false), 800);
    } catch (err) {
      console.error(err);
      toast.error('Failed to add to cart');
    }
  };

  const buyNow = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('⚠️ Please login to continue.');
      return setTimeout(() => navigate('/login'), 1500);
    }

    try {
      await axios.post(
        'http://localhost:5000/api/orders/buynow',
        { productID: product.id },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      navigate('/order-summary?mode=buynow');
    } catch (err) {
      console.error(err);
      toast.error('❌ Failed to process Buy Now');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="animate-pulse text-xl font-bold">Loading product details...</div>
      </div>
    );
  }

  const isOutOfStock = product.quantity === 0;
  const isLowStock = product.quantity > 0 && product.quantity < 5;

  return (
    <section className="h-screen relative text-white overflow-y-auto p-4 md:p-0">
      {/* Back + Cart Buttons */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-20">
        <button
          onClick={() => navigate('/allprodcuts')}
          className="text-black bg-white/80 rounded-full p-2 hover:bg-gray-200 transition"
        >
          <IoArrowBack size={20} />
        </button>

        <motion.button
          onClick={() => navigate('/cart')}
          className="relative text-black bg-white/80 rounded-full p-2 hover:bg-gray-200 transition"
          animate={cartShake ? { rotate: [0, -10, 10, -10, 10, 0] } : {}}
        >
          <FaShoppingCart size={20} />
          {getTotalCount() > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 w-5 h-5 text-xs rounded-full flex items-center justify-center">
              {getTotalCount()}
            </span>
          )}
        </motion.button>
      </div>

      {/* Main Content */}
      <div className="mt-12 md:mt-0">
        {/* Mobile layout */}
        <div className="md:hidden flex flex-col bg-black">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full object-contain bg-[#f0f0f0]"
          />
          <div className="p-6">
            <h1 className="text-2xl font-bold text-[#c20001] mb-2">{product.name}</h1>
            <p className="text-gray-300 mb-4">{product.description}</p>
            <div className="flex items-center mb-4 text-yellow-400">
              <FaStar />
              <span className="ml-2">4.5 / 5</span>
            </div>
            {isOutOfStock ? (
              <div className="text-red-500 font-bold mb-1">❌ Out of Stock</div>
            ) : isLowStock ? (
              <div className="text-yellow-500 font-medium mb-1">Only {product.quantity} left in stock</div>
            ) : null}
            <div className="text-2xl font-semibold mb-6">${product.price}</div>
            <ul className="list-disc list-inside text-gray-300 space-y-1 mb-6">
              {['f1', 'f2', 'f3'].map((f) => product[f] && <li key={f}>{product[f]}</li>)}
            </ul>
            <button
              onClick={addToCart}
              disabled={isOutOfStock}
              className={`w-full py-3 mb-3 rounded font-semibold ${
                isOutOfStock ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#c20001] text-white'
              }`}
            >
              Add to Cart
            </button>
            <button
              onClick={buyNow}
              disabled={isOutOfStock}
              className={`px-6 py-3 rounded font-semibold w-full ${
                isOutOfStock ? 'bg-gray-300 text-gray-700 cursor-not-allowed' : 'bg-white text-black hover:bg-gray-100'
              }`}
            >
              Buy Now
            </button>
          </div>
        </div>

        {/* Desktop layout */}
        <div className="hidden md:flex h-screen">
          <div className="w-1/2 bg-[#f0f0f0] flex items-center justify-center">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-[80%] max-w-md object-contain"
            />
          </div>
          <div className="w-1/2 bg-black p-20 flex flex-col justify-center">
            <h1 className="text-4xl font-bold text-[#c20001] mb-4">{product.name}</h1>
            <p className="text-gray-300 text-lg mb-6">{product.description}</p>
            <div className="flex items-center mb-4 text-yellow-400">
              <FaStar />
              <span className="ml-2">4.5 / 5</span>
            </div>
            {isOutOfStock ? (
              <div className="text-red-500 font-bold mb-2">❌ Out of Stock</div>
            ) : isLowStock ? (
              <div className="text-yellow-500 font-medium mb-2">Only {product.quantity} left in stock</div>
            ) : null}
            <div className="text-3xl font-semibold mb-6">${product.price}</div>
            <ul className="list-disc list-inside text-gray-300 space-y-1 mb-6">
              {['f1', 'f2', 'f3'].map((f) => product[f] && <li key={f}>{product[f]}</li>)}
            </ul>
            <div className="flex gap-4">
              <button
                onClick={addToCart}
                disabled={isOutOfStock}
                className={`px-6 py-3 rounded font-semibold ${
                  isOutOfStock ? 'bg-gray-400 text-gray-700 cursor-not-allowed' : 'bg-[#c20001] text-white hover:opacity-90'
                }`}
              >
                Add to Cart
              </button>
              <button
                onClick={buyNow}
                disabled={isOutOfStock}
                className={`px-6 py-3 rounded font-semibold ${
                  isOutOfStock ? 'bg-gray-300 text-gray-700 cursor-not-allowed' : 'bg-white text-black hover:bg-gray-100'
                }`}
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer position="top-center" autoClose={2000} />
    </section>
  );
};

export default ProductDetails;
