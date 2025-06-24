import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import AnimatedSection from './animatedsection';

const RegularCustomers = () => {
  const logoRefs = useRef([]);

  const logos = [
    './logo1.png',
    './logo2.png',
    './logo3.png',
    './logo4.png',
    './logo5.png',
    './logo6.png',
    './logo7.png',
    './logo8.png',
    './logo9.png',
    './logo10.png',
    './logo11.png',
  ];

  const logoVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: (index) => ({
      scale: 1,
      opacity: 1,
      transition: {
        delay: index * 0.15,
        duration: 0.8,
        ease: 'easeOut',
      },
    }),
    hover: {
      scale: 1.1,
      transition: { duration: 0.3, ease: 'easeOut' },
    },
  };

  return (
    <AnimatedSection>
      <section className="bg-black py-10 sm:py-20 overflow-hidden w-full">
        <div className="text-center mb-10 px-4">
          <motion.h2
            className="text-2xl sm:text-4xl md:text-5xl font-bold text-white font-poppins"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            viewport={{ once: true }}
          >
            Our Regular Customers
          </motion.h2>
          <motion.p
            className="text-sm sm:text-base text-gray-400 mt-2"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            viewport={{ once: true }}
          >
            Brands that trust our products
          </motion.p>
        </div>

        <div className="relative w-full overflow-hidden">
          <div className="flex w-max animate-scroll whitespace-nowrap mask-edges px-2 sm:px-0">
            {[...logos, ...logos].map((logo, index) => (
              <motion.div
                key={index}
                ref={(el) => (logoRefs.current[index] = el)}
                custom={index % logos.length}
                variants={logoVariants}
                initial="hidden"
                whileInView="visible"
                whileHover="hover"
                viewport={{ once: true }}
                className="mx-4 sm:mx-8 flex items-center justify-center h-12 w-20 sm:h-20 sm:w-32"
              >
                <img
                  src={logo}
                  alt={`Logo ${index}`}
                  className="h-full w-full object-contain mix-blend-multiply"
                />
              </motion.div>
            ))}
          </div>
        </div>

        <style>
          {`
            @keyframes scroll {
              0% { transform: translateX(0%); }
              100% { transform: translateX(-50%); }
            }

            .animate-scroll {
              animation: scroll 25s linear infinite;
              will-change: transform;
            }

            .mask-edges {
              mask-image: linear-gradient(
                to right,
                transparent 0%,
                black 10%,
                black 90%,
                transparent 100%
              );
              -webkit-mask-image: linear-gradient(
                to right,
                transparent 0%,
                black 10%,
                black 90%,
                transparent 100%
              );
            }
          `}
        </style>
      </section>
    </AnimatedSection>
  );
};

export default RegularCustomers;
