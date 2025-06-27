import  { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Import jwtDecode to decode JWT tokens


const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [loading, setLoading] = useState(true); // Loading state
  const [username, setUsername] = useState(''); // Username state


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get('http://localhost:5000/api/products/getall');
        setProducts(res.data.products);
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    // Decode username from JWT
    const token = localStorage.getItem('token');
    console.log(token);

    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUsername(decoded.name || decoded.username); // 👈 Adjust based on your token structure
      } catch (e) {
        console.error('Failed to decode token', e);
      }
    }

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



  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#111111] via-[#0d0d0d] to-[#000000] text-white">
        <div className="relative w-16 h-16">
          <div className="absolute w-full h-full border-4 border-t-[#c20001] border-white/20 rounded-full animate-spin"></div>
          <div className="absolute w-8 h-8 top-2 left-2 bg-[#c20001] rounded-full shadow-lg animate-ping"></div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-[#111111] via-[#0d0d0d] to-[#000000] text-white"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <Navbar />
      <div className="pt-24 px-4 sm:px-8 lg:px-16 pb-16">
        <div className="flex justify-between mb-8">

          <div className="mb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-[#ff4d4d] via-[#c20001] to-[#ff4d4d] text-transparent bg-clip-text drop-shadow-sm">
              {username ? (
                <>
                  Let’s shop, <span className="text-white">{username.charAt(0).toUpperCase() + username.slice(1)}</span>
                </>
              ) : (
                "Let's shop!"
              )}
            </h2>
          </div>
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
                  className="rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-md transition-all hover:scale-[1.03] hover:shadow-[0_0_20px_#c20001aa] duration-300 overflow-hidden mb-6"
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                >
                  <div className="aspect-[4/3] w-full bg-gradient-to-t from-[#00000020] to-[#ffffff08] flex items-center justify-center">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      loading="lazy"
                      className="object-contain max-h-full max-w-full"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-[#ff4d4d] mb-1 font-poppins">
                      {product.name}
                    </h3>
                    <p className="text-gray-200 text-sm line-clamp-2 mb-2">
                      {product.description}
                    </p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-white font-semibold text-base">${product.price}</span>
                      <span className="text-yellow-400 text-xs">⭐ 4.5</span>
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
