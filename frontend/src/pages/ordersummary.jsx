import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../components/navbar';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';
import axios from 'axios';

const OrderSummary = () => {
  const [items, setItems] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [gpayReady, setGpayReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false); // ✅ New loader state

  const navigate = useNavigate();
  const location = useLocation();
  const isBuyNow = new URLSearchParams(location.search).get('mode') === 'buynow';

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get(
          isBuyNow
            ? 'http://localhost:5000/api/orders/temp'
            : 'http://localhost:5000/api/cart',
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = res.data.map(item => ({
          ...item,
          source: isBuyNow ? 'temp' : 'cart',
        }));
        setItems(data);
      } catch (err) {
        console.error(err);
        toast.error('Failed to fetch order data');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isBuyNow]);

  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0).toFixed(2);

  const handleDeleteItem = async (productID, source) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(
        `http://localhost:5000/api/orders/delete/${source}/${productID}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setItems(prev => prev.filter(item => item.productID !== productID));
      toast.success('Item removed from order');
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete item');
    }
  };

  const handlePlaceOrder = async (gpayData = null) => {
    const token = localStorage.getItem('token');
    setPlacingOrder(true); // ✅ Start loader
    try {
      const res = await fetch('http://localhost:5000/api/orders/place', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          paymentMethod,
          gpayData,
          source: isBuyNow ? 'buy_now' : 'cart'
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success('Order placed successfully!');
        setItems([]);
        setTimeout(() => navigate('/order-success'), 100);
      } else {
        toast.error(data.msg || 'Failed to place order');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error placing order');
    } finally {
      setPlacingOrder(false); // ✅ End loader
    }
  };

  useEffect(() => {
    if (paymentMethod === 'GPay' && window.google) {
      const paymentsClient = new window.google.payments.api.PaymentsClient({
        environment: 'TEST',
      });

      const request = {
        apiVersion: 2,
        apiVersionMinor: 0,
        allowedPaymentMethods: [
          {
            type: 'CARD',
            parameters: {
              allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
              allowedCardNetworks: ['VISA', 'MASTERCARD'],
            },
            tokenizationSpecification: {
              type: 'PAYMENT_GATEWAY',
              parameters: {
                gateway: 'example',
                gatewayMerchantId: 'exampleMerchantId',
              },
            },
          },
        ],
        transactionInfo: {
          totalPriceStatus: 'FINAL',
          totalPrice: total,
          currencyCode: 'USD',
        },
        merchantInfo: {
          merchantName: 'Your IoT Store',
        },
      };

      paymentsClient
        .isReadyToPay({ allowedPaymentMethods: request.allowedPaymentMethods })
        .then(response => {
          if (response.result) {
            setGpayReady(true);
            const button = paymentsClient.createButton({
              onClick: () => {
                paymentsClient
                  .loadPaymentData(request)
                  .then(paymentData => {
                    handlePlaceOrder(paymentData.paymentMethodData);
                  })
                  .catch(() => {
                    toast.error('Payment failed or cancelled');
                  });
              },
              buttonColor: 'black',
              buttonType: 'pay',
            });

            const btnContainer = document.getElementById('gpay-btn');
            if (btnContainer && btnContainer.children.length === 0) {
              btnContainer.appendChild(button);
            }
          }
        })
        .catch(err => {
          console.error('isReadyToPay error:', err);
        });
    }
  }, [paymentMethod, total]);

  return (
    <div className="min-h-screen bg-black text-white lg:pt-20 pt-4 px-4 lg:px-6 pb-16">
      <Navbar />

      {loading ? (
        <div className="flex justify-center items-center h-[70vh]">
          <div className="w-16 h-16 border-4 border-t-[#c20001] border-white/20 rounded-full animate-spin"></div>
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[70vh] text-center">
          <h2 className="text-3xl font-bold mb-4 text-white">🛒 No more orders</h2>
          <p className="text-gray-400 mb-6">Looks like your cart or order list is empty.</p>
          <button
            onClick={() => navigate('/allproducts')}
            className="bg-[#c20001] text-white px-6 py-3 rounded font-semibold hover:opacity-90"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 max-w-7xl mx-auto mt-6 lg:mt-8">
          <div className="space-y-3 lg:space-y-4">
            <h2 className="text-xl lg:text-2xl font-bold text-white">Your Order</h2>
            {items.map(prod => (
              <div
                key={prod.productID}
                className="flex justify-between items-center p-3 lg:p-4 border border-white/10 bg-white/5 rounded-lg"
              >
                <div>
                  <h3 className="font-semibold text-sm lg:text-base">{prod.name}</h3>
                  <p className="text-xs lg:text-sm text-gray-300">{prod.description}</p>
                  <p className="text-xs lg:text-sm text-gray-400">Qty: {prod.qty}</p>
                  <p className="font-bold text-base lg:text-lg mt-1">
                    ${(prod.qty * prod.price).toFixed(2)}
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteItem(prod.productID, prod.source)}
                  className="text-red-500 hover:text-red-300 text-base lg:text-lg p-2 rounded-full border border-red-500"
                  title="Delete"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>

          <div className="bg-white/5 border border-white/10 p-4 lg:p-6 rounded-lg shadow-lg">
            <div className="flex flex-row justify-between items-center mb-4">
              <h2 className="text-xl lg:text-2xl font-bold text-[#c20001]">Payment Options</h2>
              <div className="text-right font-bold text-lg lg:text-xl text-white">
                Total: ${total}
              </div>
            </div>

            <div className="space-y-3 lg:space-y-4 text-sm lg:text-base">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="payment"
                  value="COD"
                  checked={paymentMethod === 'COD'}
                  onChange={() => setPaymentMethod('COD')}
                />
                <span>Cash on Delivery</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="payment"
                  value="GPay"
                  checked={paymentMethod === 'GPay'}
                  onChange={() => setPaymentMethod('GPay')}
                />
                <span>Google Pay</span>
              </label>
            </div>

            {paymentMethod === 'COD' && (
              <button
                onClick={() => handlePlaceOrder()}
                disabled={placingOrder}
                className={`mt-5 lg:mt-6 w-full py-2 lg:py-3 rounded-lg font-semibold text-sm lg:text-base transition ${
                  placingOrder ? 'bg-gray-600 cursor-not-allowed' : 'bg-[#c20001] hover:opacity-90'
                }`}
              >
                {placingOrder ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-t-white border-white/30 rounded-full animate-spin"></div>
                    Placing...
                  </div>
                ) : (
                  'Place Order'
                )}
              </button>
            )}

            {paymentMethod === 'GPay' && (
              <div id="gpay-btn" className="mt-5 lg:mt-6"></div>
            )}
          </div>
        </div>
      )}

      <ToastContainer position="top-center" autoClose={2000} />
    </div>
  );
};

export default OrderSummary;
