import React from 'react';
import { motion } from 'framer-motion';
import { FaChevronDown } from 'react-icons/fa';
import AnimatedSection from './animatedsection';
import DeviceLineup from './deviceshowcase';
import DeviceCarousel from './devicecarousel';
import { useMediaQuery } from 'react-responsive';

const HeroSection = () => {
  const isDesktopOrLaptop = useMediaQuery({ query: '(min-width: 1024px)' });

  return (
    <AnimatedSection>
      <section className="relative w-full h-screen bg-black overflow-hidden">
        {/* Gradient Overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-[#c20001]/20 via-transparent to-[#c20001]/10 z-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
        />

        {/* Glowing Blobs */}
        <motion.div
          className="absolute top-[-100px] left-[-100px] w-[250px] h-[250px] bg-[#c20001]/40 rounded-full blur-3xl z-0"
          animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-[-100px] right-[-100px] w-[250px] h-[250px] bg-[#c20001]/30 rounded-full blur-3xl z-0"
          animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Main Content */}
        <div className={`z-10 relative max-w-7xl mx-auto px-4 sm:px-6 flex justify-center items-center ${isDesktopOrLaptop ? 'h-full' : 'pt-50'}`}>
          {isDesktopOrLaptop ? <DeviceLineup /> : <DeviceCarousel />}
        </div>

        {/* Top Left Text */}
        <div className={`${isDesktopOrLaptop ? "absolute top-24 left-4 sm:left-10 md:left-24" : "absolute top-10 left-4"} text-left z-20 max-w-[80%] sm:max-w-xs md:max-w-sm`}>
          <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-[#c20001] to-gray-500 bg-clip-text text-transparent font-poppins leading-tight">
            Intelligent Devices
          </h2>
          <p className="text-white text-sm sm:text-base mt-2">
            Our IoT devices are built for precision, automation and sustainability.
          </p>
        </div>

        {/* Bottom Right Text */}
        <div className={`${isDesktopOrLaptop ? "absolute bottom-10 right-4 sm:right-10 md:right-24" : "absolute bottom-24 right-4"} text-right z-20 max-w-[80%] sm:max-w-xs md:max-w-sm`}>
          <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-[#c20001] to-gray-500 bg-clip-text text-transparent font-poppins leading-tight">
            Smarter Monitoring
          </h2>
          <p className="text-white text-sm sm:text-base mt-2">
            Track, control and optimize with real-time insights from your environment.
          </p>
        </div>

        {/* Scroll Icon */}
        <motion.div
          className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-white z-20"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <FaChevronDown size={isDesktopOrLaptop ? 22 : 15} />
        </motion.div>
      </section>
    </AnimatedSection>
  );
};

export default HeroSection;
