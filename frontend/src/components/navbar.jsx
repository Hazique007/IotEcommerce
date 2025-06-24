import React, { useEffect, useState } from 'react';
import AuthModal from './authmodal';
import {
  FiHome,
  FiBox,
  FiInfo,
  FiPhone,
  FiMenu,
  FiX,
  FiUser,
  FiShoppingCart,
  FiLogIn,
 
} from 'react-icons/fi';

import { useMediaQuery } from 'react-responsive';
import gsap from 'gsap';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const isDesktopOrLaptop = useMediaQuery({ query: '(min-width: 1024px)' });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Animate drawer open/close
  useEffect(() => {
    if (menuOpen) {
      gsap.fromTo(
        '.mobile-drawer',
        { y: '100%' },
        { y: '0%', duration: 0.5, ease: 'power3.out' }
      );
    }
  }, [menuOpen]);

  const links = ['Home', 'Products', 'Cart', 'About'];

  return (
    <>
      {isDesktopOrLaptop ? (
        // Top navbar for desktop
        <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/10 backdrop-blur-lg shadow-md' : 'bg-transparent'}`}>
          <div className=" mx-auto w-screen px-6 py-4 flex items-center justify-between">
            {/* Logo */}
            <a href="https://enggenv.com" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2">
              <img src="./logo.png" alt="Logo" className="w-10 h-10 object-contain" />
              <h1 className="text-xl font-bold font-poppins text-white">IoTera</h1>
            </a>

            {/* Nav Links */}
            <ul className="flex space-x-6 font-medium">
              {links.map((item, idx) => (
                <li key={idx}>
                  <a href={`#${item.toLowerCase()}`} className="relative text-white hover-underline-animation transition-all duration-300">
                    {item}
                  </a>
                </li>
              ))}
            </ul>

            {/* Auth Buttons */}
            <div className="flex space-x-4">
              <button
                onClick={() => setModalType('login')}
                className="px-4 py-1 bg-[#c20001] text-white rounded-lg text-sm font-semibold hover:shadow-[0_0_10px_#c20001]">
                Login
              </button>
              <button
                onClick={() => setModalType('signup')}
                className="px-4 py-1 bg-white text-[#c20001] rounded-lg text-sm font-semibold hover:shadow-[0_0_10px_#c20001]">
                Signup
              </button>
            </div>
          </div>
        </nav>
      ) : (
        // Bottom navbar for mobile
        <nav className="fixed bottom-0 left-0 w-full z-50 bg-black/90 backdrop-blur-lg shadow-inner border-t border-white/10">
          <div className="flex justify-around items-center py-2">
            <a href="#home" className="flex flex-col items-center text-white text-xs hover:text-[#c20001] transition">
              <FiHome size={18} />
              <span>Home</span>
            </a>
            <a href="#products" className="flex flex-col items-center text-white text-xs hover:text-[#c20001] transition">
              <FiBox size={18} />
              <span>Products</span>
            </a>
            <a href="#about" className="flex flex-col items-center text-white text-xs hover:text-[#c20001] transition">
              <FiShoppingCart size={18} />
              <span>Cart</span>
            </a>
            <a href="#contact" className="flex flex-col items-center text-white text-xs hover:text-[#c20001] transition">
              < FiUser size={18} />
              <span>Profile</span>
            </a>
            <button
              onClick={() => setMenuOpen(true)}
              className="flex flex-col items-center text-white text-xs hover:text-[#c20001] transition"
            >
              <FiMenu size={18} />
              <span>Menu</span>
            </button>
          </div>
        </nav>

      )}

      {/* Auth Modal */}
      {modalType && (
        <AuthModal
          type={modalType}
          isOpen={modalType !== null}
          onClose={() => setModalType(null)}
        />
      )}

      {/* Link underline animation */}
      <style>{`
        .hover-underline-animation::after {
          content: '';
          display: block;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, #c20001, #ff4d4d);
          transition: width 0.3s ease-in-out;
          position: absolute;
          bottom: -2px;
          left: 0;
        }
        .hover-underline-animation:hover::after {
          width: 100%;
        }
      `}</style>
    </>
  );
};

export default Navbar;
