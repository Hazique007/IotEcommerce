import React from 'react';
import { useEffect, useState } from 'react';

import { useMediaQuery } from 'react-responsive';
import TopProductsMobile from '../components/TopProductsMobile';
import Navbar from '../components/navbar';
import gsap from "gsap";
import ProductsSection from '../components/topprod';
import { ScrollTrigger } from "gsap/ScrollTrigger";
import RegularCustomers from '../components/RegularCustomer';
import HeroSection from '../components/Herosection';
import Footer from '../components/footer';
import UseCaseCarousel from '../components/usecase';

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const [showWelcome, setShowWelcome] = useState(false);
  const isDesktopOrLaptop = useMediaQuery({ query: '(min-width: 1024px)' });

  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisited');
    if (!hasVisited) {
      setShowWelcome(true);
      localStorage.setItem('hasVisited', 'true');
    }
  }, []);

  return (
    <div className="main w-full relative overflow-x-hidden overflow-y-scroll no-scrollbar bg-black text-white">
      {/* Show Navbar only on desktop/laptop */}
      {showWelcome && (
        <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex justify-center items-center px-4">
          <div className="bg-white text-black max-w-lg w-full p-6 rounded-xl shadow-xl text-center space-y-4">
            <h2 className="text-2xl font-bold font-poppins">Hello, IOT enthusiast! 👋</h2>
            <p className="text-lg">Just a quick heads-up , please login first to order products from our website. Happy shopping! 😊</p>
            <button
              onClick={() => setShowWelcome(false)}
              className="mt-4 px-6 py-2 bg-[#c20001] hover:bg-[#ff4d4d] text-white rounded-lg transition"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
      <Navbar />

      <HeroSection />

      <div className="mt-20 ml-4 sm:ml-12 text-left">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-poppins">
          Our Top Products
        </h2>
      </div>

      {/* Always mount both, just hide the one you don't need */}
      <div className={`${isDesktopOrLaptop ? 'block' : 'hidden'}`}>
        <ProductsSection />
      </div>
      <div className={`${!isDesktopOrLaptop ? 'block' : 'hidden'}`}>
        <TopProductsMobile />
      </div>
      <UseCaseCarousel />
      <RegularCustomers />
      <Footer />

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
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default Home;
