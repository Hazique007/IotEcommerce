import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const AllProducts = () => {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

    useEffect(() => {
  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/products/getallproducts');
      setProducts(res.data.products); // 👈 FIX HERE
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };
  fetchProducts();
}, []);


    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 300);
        return () => clearTimeout(handler);
    }, [searchTerm]);

    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
            },
        },
    };

    const cardVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: 'easeOut' } },
    };

    return (
        <motion.div
            className="min-h-screen bg-gradient-to-br from-[#111111] via-[#0d0d0d] to-[#000000] text-white"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <Navbar />
            <div className="pt-24 px-4 sm:px-8 lg:px-16">
                <div className="flex justify-end mb-8">
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full sm:w-80 px-4 py-2 rounded-md bg-white/10 backdrop-blur-md text-white placeholder-gray-300 border border-white/20 focus:outline-none focus:ring-2 focus:ring-[#c20001]"
                    />
                </div>

                <motion.div
                    className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-10"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <AnimatePresence>
                        {filteredProducts.map((product) => (
                            <Link to={`/product-details/${product.id}`} key={product.id}>
                                <motion.div
                                    className="rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg transition-all hover:scale-[1.03] hover:shadow-[0_0_30px_#c20001aa] duration-300 overflow-hidden"
                                    variants={cardVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="hidden"
                                >
                                    <div className="aspect-[4/3] w-full bg-gradient-to-t from-[#00000020] to-[#ffffff08] flex items-center justify-center">
                                        <img
                                            src={product.image_url}
                                            alt={product.name}
                                            className="object-contain max-h-full max-w-full"
                                        />
                                    </div>
                                    <div className="p-5">
                                        <h3 className="text-xl font-semibold text-[#ff4d4d] mb-1 font-poppins">
                                            {product.name}
                                        </h3>
                                        <p className="text-gray-200 text-sm line-clamp-2 mb-3">
                                            {product.description}
                                        </p>
                                        <div className="flex justify-between items-center">
                                            <span className="text-white font-bold text-lg">${product.price}</span>
                                            <span className="text-yellow-400 text-sm">⭐ 4.5</span>
                                        </div>
                                    </div>
                                </motion.div>
                            </Link>
                        ))}
                    </AnimatePresence>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default AllProducts;
