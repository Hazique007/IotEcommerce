import { motion } from 'framer-motion';

const GlassCard = ({ image, title, desc }) => {
  return (
    <motion.div
      whileHover={{ y: -10, scale: 1.02 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="backdrop-blur-md bg-white/10 border border-white/20 shadow-md rounded-xl p-6 text-white w-full sm:w-80 hover:shadow-xl transition-shadow"
    >
      <img src={image} alt={title} className="w-full h-40 object-contain mb-4" />
      <h3 className="text-xl font-semibold text-[#c20001] mb-2">{title}</h3>
      <p className="text-sm text-gray-200">{desc}</p>
    </motion.div>
  );
};

export default GlassCard;
