import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);



  // Fetch cart items from backend using token
  const fetchCart = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await axios.get('https://iotecommerce-2.onrender.com/api/cart', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCartItems(res.data);
    } catch (err) {
      console.error('Failed to fetch cart:', err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const addItem = (product) => {
    // Just push for instant UI update (optional)
    setCartItems((prev) => {
      const exists = prev.find((item) => item.productID === product.id);
      if (exists) {
        return prev.map((item) =>
          item.productID === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prev, { ...product, quantity: 1 }];
      }
    });
  };

  const getTotalCount = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{ cartItems, addItem, getTotalCount, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
