import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({ username: '', email: '', password: '' });
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = isLogin
        ? 'http://localhost:5000/api/auth/login'
        : 'http://localhost:5000/api/auth/signup';

      const { data } = await axios.post(url, formData);

      if (isLogin) {
        localStorage.setItem('token', data.token);
        toast.success('Login successful');
        setTimeout(() => {
          window.location.href = '/';
        }, 1500);
      } else {
        toast.success('Signup successful. You can now login.');
        setIsLogin(true);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.msg || 'Something went wrong');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#c20001] via-[#3a0001] to-black px-4">
      <motion.div
        initial={{ opacity: 0, y: 80 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-8 w-full max-w-md text-white shadow-2xl"
      >
        <h2 className="text-3xl font-bold text-center mb-6 tracking-tight drop-shadow">
          {isLogin ? 'Login' : 'Create Account'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <motion.input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-white/10 border border-white/30 rounded focus:outline-none focus:ring backdrop-blur placeholder-white/60"
              required
              whileFocus={{ scale: 1.02 }}
            />
          )}

          <motion.input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-white/10 border border-white/30 rounded focus:outline-none focus:ring backdrop-blur placeholder-white/60"
            required
            whileFocus={{ scale: 1.02 }}
          />

          <motion.input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-white/10 border border-white/30 rounded focus:outline-none focus:ring backdrop-blur placeholder-white/60"
            required
            whileFocus={{ scale: 1.02 }}
          />

          <motion.button
            type="submit"
            whileTap={{ scale: 0.98 }}
            whileHover={{ scale: 1.02 }}
            className="w-full bg-[#c20001] py-2 rounded font-semibold hover:opacity-90 transition"
          >
            {isLogin ? 'Login' : 'Sign Up'}
          </motion.button>
        </form>

        <p className="text-center text-sm mt-4 text-white/70">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button
            onClick={toggleMode}
            className="text-[#ff4b2b] underline ml-1 font-semibold"
          >
            {isLogin ? 'Sign up' : 'Login'}
          </button>
        </p>
      </motion.div>

      <ToastContainer position="top-center" autoClose={2000} />
    </div>
  );
};

export default AuthPage;
