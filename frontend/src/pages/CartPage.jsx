import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/navbar';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { IoArrowBack } from 'react-icons/io5';

const CartPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Login required');
        navigate('/login');
        return;
      }

      try {
        setLoading(true);
        const res = await fetch('http://localhost:5000/api/cart', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setItems(data);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load cart');
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const updateQty = async (idx, delta) => {
    const updated = [...items];
    const product = updated[idx];
    const newQty = product.qty + delta;

    if (newQty <= 0) {
      updated.splice(idx, 1);
      setItems(updated);
    } else {
      updated[idx].qty = newQty;
      setItems(updated);
    }

    try {
      const token = localStorage.getItem('token');
      await fetch('http://localhost:5000/api/cart/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productID: product.productID,
          quantity: newQty,
        }),
      });

      const res = await fetch('http://localhost:5000/api/cart', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const fresh = await res.json();
      setItems(fresh);
    } catch (err) {
      console.error('Cart update failed:', err);
      toast.error('Failed to sync with server');
    }
  };

  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0).toFixed(2);

  const handleCheckout = () => {
    navigate('/order-summary');
  };

  return (
    <div className="min-h-screen bg-black text-white pt-20 px-6 lg:pt-20 pt-4">

      <Navbar />
      <div className="mt-4 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="text-white flex items-center gap-2  px-4 py-2 rounded hover:bg-white/20 transition"
        >
          <IoArrowBack size={20} />
          
        </button>
      </div>


      {loading ? (
        <div className="flex flex-col gap-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="animate-pulse bg-white/5 border border-white/10 p-4 lg:p-6 rounded-2xl shadow-md"
            >
              <div className="flex gap-4">
                <div className="w-12 h-12 lg:w-16 lg:h-16 bg-white/10 rounded-lg" />
                <div className="flex flex-col gap-2 flex-grow">
                  <div className="h-4 bg-white/20 rounded w-1/2"></div>
                  <div className="h-3 bg-white/10 rounded w-3/4"></div>
                  <div className="h-3 bg-white/10 rounded w-1/3"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="flex items-center justify-center h-[60vh]">
          <p className="text-gray-400 text-center text-lg">Your cart is empty.</p>
        </div>
      ) : (
        <>
          <div className="space-y-6">
            <div className="w-full mx-auto rounded-2xl p-4 lg:p-10 bg-white/5 backdrop-blur-md shadow-lg border border-white/10 space-y-4 lg:space-y-6">
              {items.map((prod, idx) => (
                <div
                  key={prod.productID}
                  className="flex items-center justify-between p-3 lg:p-4 rounded-xl bg-gradient-to-br from-white/10 to-white/5 shadow-inner border border-white/10"
                >
                  <div className="flex items-center gap-2 lg:gap-4">
                    <img
                      src={prod.image_url}
                      alt={prod.name}
                      className="w-12 h-12 lg:w-16 lg:h-16 object-contain rounded-lg bg-white/10"
                    />
                    <div>
                      <h3 className="text-sm lg:text-lg font-semibold">{prod.name}</h3>
                      <p className="text-gray-400 text-xs lg:text-sm line-clamp-1">
                        {prod.description}
                      </p>
                      <div className="mt-1 lg:mt-2 flex items-center gap-2 lg:gap-3">
                        <button
                          onClick={() => updateQty(idx, -1)}
                          className="bg-red-600 text-white px-2 rounded hover:bg-red-700 text-xs lg:text-base"
                        >
                          -
                        </button>
                        <span className="text-sm lg:text-lg">{prod.qty}</span>
                        <button
                          onClick={() => updateQty(idx, 1)}
                          className="bg-green-600 text-white px-2 rounded hover:bg-green-700 text-xs lg:text-base"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="text-right font-bold text-sm lg:text-xl text-white">
                    ${(prod.price * prod.qty).toFixed(2)}
                  </div>
                </div>
              ))}

              <div className="flex justify-between items-center pt-4 border-t border-white/10">
                <span className="text-sm lg:text-xl font-semibold text-gray-200">Total</span>
                <span className="text-lg lg:text-2xl font-bold text-[#c20001]">${total}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 pb-6 lg:pb-8">
            <button
              onClick={handleCheckout}
              className="bg-[#c20001] text-white px-5 lg:px-6 py-2 lg:py-3 rounded-lg font-semibold hover:opacity-90 transition text-sm lg:text-base"
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}

      <ToastContainer position="top-center" autoClose={2000} />
    </div>
  );
};

export default CartPage;
