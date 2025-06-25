import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/navbar';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CartPage = () => {
  const [items, setItems] = useState([]);
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
        const res = await fetch('http://localhost:5000/api/cart', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setItems(data);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load cart');
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
        productID: product.productID,  // 👈 match backend
        quantity: newQty               // 👈 match backend
      }),
    });

    // Optional: re-fetch latest cart from DB
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
    // const token = localStorage.getItem('token');
    // if (!token) {
    //   toast.error('⚠️ Please login before continuing.');
    //   setTimeout(() => {
    //     navigate('/login'); // redirect to login
    //   }, 2000);
    //   return;
    // }

    // User is logged in → Navigate to order summary
    navigate('/order-summary');
  };

  return (
    <div className="min-h-screen bg-black text-white pt-20 px-6">
      <Navbar />
      {/* <h2 className="text-4xl font-bold mb-8 drop-shadow">Your Cart</h2> */}

      {items.length === 0 && (
        <div className="flex items-center justify-center h-[60vh]">
          <p className="text-gray-400 text-center text-lg">Your cart is empty.</p>
        </div>
      )}

      {items.length > 0 && (
        <div className="space-y-6">
          <div className="w-full mx-auto rounded-2xl p-10 bg-white/5 backdrop-blur-md shadow-lg border border-white/10 space-y-6">
            {items.map((prod, idx) => (
              <div
                key={prod.productID}
                className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-br from-white/10 to-white/5 shadow-inner border border-white/10"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={prod.image_url}
                    alt={prod.name}
                    className="w-16 h-16 object-contain rounded-lg bg-white/10"
                  />
                  <div>
                    <h3 className="text-lg font-semibold">{prod.name}</h3>
                    <p className="text-gray-400 text-sm line-clamp-1">
                      {prod.description}
                    </p>
                    <div className="mt-2 flex items-center gap-3">
                      <button
                        onClick={() => updateQty(idx, -1)}
                        className="bg-red-600 text-white px-2 rounded hover:bg-red-700"
                      >
                        -
                      </button>
                      <span className="text-lg">{prod.qty}</span>
                      <button
                        onClick={() => updateQty(idx, 1)}
                        className="bg-green-600 text-white px-2 rounded hover:bg-green-700"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
                <div className="text-right font-bold text-xl text-white">
                  ${(prod.price * prod.qty).toFixed(2)}
                </div>
              </div>
            ))}

            <div className="flex justify-between items-center pt-4 border-t border-white/10">
              <span className="text-xl font-semibold text-gray-200">Total</span>
              <span className="text-2xl font-bold text-[#c20001]">${total}</span>
            </div>
          </div>
        </div>
      )}

      {items.length > 0 && (
        <div className="flex justify-end pt-4 pb-4">
          <button
            onClick={handleCheckout}
            className="bg-[#c20001] text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition"
          >
            Proceed to Checkout
          </button>
        </div>
      )}

      <ToastContainer position="top-center" autoClose={2000} />
    </div>
  );
};

export default CartPage;
