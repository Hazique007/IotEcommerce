
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const ParallaxWrapper = ({ children, yOffset = 100 }) => {
  const ref = useRef();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });

  const y = useTransform(scrollYProgress, [0, 1], [yOffset, -yOffset]);

  return (
    <motion.div ref={ref} style={{ y }} className="relative will-change-transform">
      {children}
    </motion.div>
  );
};

export default ParallaxWrapper;
