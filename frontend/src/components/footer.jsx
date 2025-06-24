import React from 'react';
import { FaInstagram, FaLinkedin, FaTwitter, FaGithub } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-black text-white py-10 px-6 md:px-20 border-t  relative z-50">

      {/* Top Gradient Border */}
      
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Brand */}
        <div>
          <h1 className="text-2xl font-bold font-poppins">Engineering & Environmental Solutions</h1>
          <p className="mt-3 text-gray-400">Empowering sustainability with smart IoT solutions.</p>
        </div>

        {/* Links */}
        <div className="flex flex-col space-y-2">
          <h2 className="text-lg font-semibold text-white">Quick Links</h2>
          <a href="#home" className="text-gray-400 hover:text-white transition">Home</a>
          <a href="#products" className="text-gray-400 hover:text-white transition">Products</a>
          <a href="#about" className="text-gray-400 hover:text-white transition">About</a>
          <a href="#contact" className="text-gray-400 hover:text-white transition">Contact</a>
        </div>

        {/* Social */}
        <div>
          <h2 className="text-lg font-semibold mb-3 text-white">Follow Us</h2>
          <div className="flex space-x-4 text-xl">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-[#E1306C] transition">
              <FaInstagram />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-[#0e76a8] transition">
              <FaLinkedin />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-[#1DA1F2] transition">
              <FaTwitter />
            </a>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white transition">
              <FaGithub />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom note */}
      <div className="text-center text-sm text-gray-500 mt-10">
        © {new Date().getFullYear()} Eninering & Environmental Solutions. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
