import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoMdClose } from 'react-icons/io';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AuthModal = ({ type, setType, isOpen, onClose }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  const handleLogin = async () => {
    const res = await axios.post('https://iotecommerce-2.onrender.com/api/auth/login', {
      email,
      password,
    });

    localStorage.setItem('token', res.data.token);
    localStorage.setItem('role', res.data.user.role);
    toast.success('Login successful!');
    setMsg(res.data.msg);

    setTimeout(() => {
      onClose();
    }, 2000);
  };

  const handleSignup = async () => {
    const res = await axios.post('https://iotecommerce-2.onrender.com/api/auth/signup', {
      username,
      email,
      password,
    });

    toast.success('Signup successful!');
    setMsg('Account created! Please log in now.');

    setTimeout(() => {
      setType('login'); // 👈 Switch to login modal
    }, 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (type === 'login') {
        await handleLogin();
      } else {
        await handleSignup();
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.msg || 'Something went wrong');
      setMsg(err.response?.data?.msg || 'Something went wrong');
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
            />

            {/* Modal */}
            <motion.div
              className="fixed top-1/2 left-1/2 z-50 w-full max-w-md px-6 py-8 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl text-white transform -translate-x-1/2 -translate-y-1/2 shadow-xl"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
            >
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white text-xl hover:text-[#c20001] transition duration-200"
              >
                <IoMdClose />
              </button>

              <h2 className="text-2xl font-bold mb-4 text-center font-poppins">
                {type === 'login' ? 'Log In to IoTera' : 'Create Your Account'}
              </h2>

              <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                {type === 'signup' && (
                  <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="px-4 py-2 bg-white/10 border border-white/20 rounded-md focus:outline-none"
                    required
                  />
                )}

                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="px-4 py-2 bg-white/10 border border-white/20 rounded-md focus:outline-none"
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="px-4 py-2 bg-white/10 border border-white/20 rounded-md focus:outline-none"
                  required
                />

                <button
                  type="submit"
                  className="bg-[#c20001] hover:bg-[#ff4d4d] transition duration-300 py-2 rounded-md font-semibold"
                >
                  {type === 'login' ? 'Login' : 'Signup'}
                </button>

                {msg && (
                  <p className="text-center text-sm mt-2 text-gray-300">{msg}</p>
                )}
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </>
  );
};

export default AuthModal;
