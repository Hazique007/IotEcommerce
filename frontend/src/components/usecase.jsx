import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaQuoteLeft } from 'react-icons/fa';
import AnimatedSection from './animatedsection';
import { useMediaQuery } from 'react-responsive';

const useCases = [
  {
    company: 'XYZ Industries',
    logo: './xyz-logo.png',
    quote:
      'With real-time air quality tracking from E&E IoT devices, we cut monitoring costs by 40%.',
    name: 'Rajeev Kumar',
    position: 'Plant Head, XYZ Industries',
  },
  {
    company: 'AquaSense Ltd.',
    logo: './aqua-logo.png',
    quote:
      'Our groundwater insights are now 10x more accurate. Best investment in a decade!',
    name: 'Sonal Mehra',
    position: 'Operations Lead, AquaSense',
  },
  {
    company: 'EnviroTech Corp.',
    logo: './enviro-logo.png',
    quote:
      'Live dashboards and remote alerts streamlined our compliance reporting process.',
    name: 'Jonathan Reed',
    position: 'CTO, EnviroTech',
  },
];

const UseCaseCarousel = () => {
  const [current, setCurrent] = useState(0);
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % useCases.length);
    }, 5000); // Change every 5 seconds
    return () => clearInterval(timer);
  }, []);

  return (
    <AnimatedSection>
      <section className="py-20 px-6 bg-black text-white overflow-hidden">
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white font-poppins mb-8 text-center">
          Trusted by Industry Leaders
        </h2>

        {isMobile ? 
        (
          <div className="relative w-full flex justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-md bg-white/10 backdrop-blur-xl p-6 rounded-2xl border border-white/10 relative overflow-hidden"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <img
                    src={useCases[current].logo}
                    alt={useCases[current].company}
                    className="w-12 h-12 object-contain rounded-full bg-white p-1"
                  />
                  <div>
                    <p className="text-lg font-semibold">{useCases[current].company}</p>
                  </div>
                </div>
                <div className="text-gray-200 italic text-sm relative pl-6">
                  <FaQuoteLeft className="absolute left-0 top-1 text-[#c20001]" />
                  {useCases[current].quote}
                </div>
                <div className="mt-4 text-sm text-gray-400">
                  — {useCases[current].name},{' '}
                  <span className="italic">{useCases[current].position}</span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        ) : (
          <div className="relative w-full overflow-hidden">
            <motion.div
              className="flex space-x-6"
              animate={{ x: ['0%', '-50%'] }}
              transition={{
                repeat: Infinity,
                duration: 40,
                ease: 'linear',
              }}
            >
              {[...useCases, ...useCases].map((caseStudy, index) => (
                <motion.div
                  key={index}
                  className="min-w-[320px] md:min-w-[400px] bg-white/10 backdrop-blur-xl p-6 rounded-2xl border border-white/10 relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_25px_rgba(194,0,1,0.4)]"
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <img
                      src={caseStudy.logo}
                      alt={caseStudy.company}
                      className="w-12 h-12 object-contain rounded-full bg-white p-1"
                    />
                    <div>
                      <p className="text-lg font-semibold">{caseStudy.company}</p>
                    </div>
                  </div>
                  <div className="text-gray-200 italic text-sm relative pl-6">
                    <FaQuoteLeft className="absolute left-0 top-1 text-[#c20001]" />
                    {caseStudy.quote}
                  </div>
                  <div className="mt-4 text-sm text-gray-400">
                    — {caseStudy.name},{' '}
                    <span className="italic">{caseStudy.position}</span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        )}
      </section>
    </AnimatedSection>
  );
};

export default UseCaseCarousel;
