import React from 'react';
import Lottie from 'lottie-react';
import successAnim from '../assets/success.json'; // Make sure path is correct

const OrderSuccess = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#c20001] to-black flex flex-col items-center justify-center text-white px-4">
      <div className="w-64 sm:w-80 md:w-96">
        <Lottie animationData={successAnim} loop={false} />
      </div>
      <h1 className="text-3xl sm:text-4xl font-bold mt-4 text-center">
        Order Placed Successfully!
      </h1>
      <p className="text-gray-300 mt-2 text-center max-w-xl">
        Thank you for shopping with us. Your order has been placed and is now being processed.
      </p>
      <button
        onClick={() => window.location.href = '/home'}
        className="mt-6 px-6 py-3 bg-white text-black font-semibold rounded-lg shadow hover:bg-gray-100 transition"
      >
        Back to Home
      </button>
    </div>
  );
};

export default OrderSuccess;
