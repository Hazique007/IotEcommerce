import React from 'react';
import { motion } from 'framer-motion';
import { FaStar } from 'react-icons/fa';
import { IoArrowBack } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

const ProductDetails = () => {
  const navigate = useNavigate();

  const product = {
    name: 'Arduino',
    image: './prod1.png',
    desc: 'Arduino is an open-source microcontroller board that lets you easily build smart devices, automate tasks, and prototype electronics—perfect for beginners and pros alike.',
    price: '₹18,499',
    highlights: [
      'Plug-and-play coding',
      'Wide sensor support',
      'USB-powered setup',
      'Open-source community',
    ],
    rating: 4.7
  };

  return (
    <section className="h-screen text-white overflow-y-auto">
      {/* Back Button (Mobile Only) */}
      <button
        onClick={() => navigate('/home')}
        className=" absolute top-4 left-4 z-10 text-black rounded-full p-2  hover:bg-gray-200 transition"
      >
        <IoArrowBack size={20} />
      </button>

      {/* MOBILE layout: image on top, details below */}
      <div className="flex flex-col md:hidden">
        <div className="w-full bg-[#f0f0f0] flex justify-center items-center p-6">
          <motion.img
            src={product.image}
            alt={product.name}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="w-[80%] max-w-sm object-contain"
          />
        </div>

        <div className="w-full px-6 py-8 bg-black flex flex-col">
          <h1 className="text-2xl font-bold text-[#c20001] mb-2">{product.name}</h1>
          <p className="text-gray-300 text-base mb-4">{product.desc}</p>

          <div className="flex items-center mb-4">
            <div className="flex text-yellow-400">
              {product.rating % 1 !== 0 && <FaStar className="opacity-50" />}
            </div>
            <span className="ml-2 text-sm text-gray-400">{product.rating} / 5</span>
          </div>

          <div className="text-2xl font-semibold mb-6">{product.price}</div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Key Features:</h3>
            <ul className="list-disc list-inside text-gray-300 space-y-1 text-sm">
              {product.highlights.map((point, index) => (
                <li key={index}>{point}</li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-4 mt-auto">
            <button className="bg-[#c20001] text-white px-6 py-3 rounded-md font-semibold hover:opacity-90 transition duration-300 w-full">
              Add to Cart
            </button>
            <button className="bg-white text-black px-6 py-3 rounded-md font-semibold hover:bg-gray-100 transition duration-300 w-full">
              Buy Now
            </button>
          </div>
        </div>
      </div>

      {/* DESKTOP layout: original unchanged */}
      <div className="hidden md:flex flex-row h-screen">
        
        {/* Image Side */}
        <div className="w-1/2 bg-[#f0f0f0] flex justify-center items-center p-10">
          <motion.img
            src={product.image}
            alt={product.name}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="w-[80%] max-w-md object-contain"
          />
        </div>

        {/* Details Side */}
        <div className="w-1/2 bg-black p-20 flex flex-col justify-center">
          <h1 className="text-4xl font-bold text-[#c20001] mb-4">{product.name}</h1>
          <p className="text-gray-300 text-lg mb-6">{product.desc}</p>

          <div className="flex items-center mb-4">
            <div className="flex text-yellow-400">
              {product.rating % 1 !== 0 && <FaStar className="opacity-50" />}
            </div>
            <span className="ml-2 text-sm text-gray-400">{product.rating} / 5</span>
          </div>

          <div className="text-3xl font-semibold mb-6">{product.price}</div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Key Features:</h3>
            <ul className="list-disc list-inside text-gray-300 space-y-1">
              {product.highlights.map((point, index) => (
                <li key={index}>{point}</li>
              ))}
            </ul>
          </div>

          <div className="flex gap-4">
            <button className="bg-[#c20001] text-white px-6 py-3 rounded-md font-semibold hover:opacity-90 transition duration-300">
              Add to Cart
            </button>
            <button className="bg-white text-black px-6 py-3 rounded-md font-semibold hover:bg-gray-100 transition duration-300">
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetails;
