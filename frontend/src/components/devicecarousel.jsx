import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const devices = [
  { name: "Arduino", src: "./prod1.png" },
  { name: "ESP32", src: "./prod2.png" },
  { name: "Raspberry Pi", src: "./prod3.png" },
  { name: "Node MCU", src: "./prod4.png" },
  { name: "STM32", src: "./prod5.png" },
];

const fadeVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

const DeviceCarousel = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % devices.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const currentDevice = devices[index];

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-10">
      <div className="w-40 h-40 relative">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentDevice.name}
            src={currentDevice.src}
            alt={currentDevice.name}
            variants={fadeVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.8 }}
            className="absolute top-0 left-0 w-full h-full object-contain"
          />
        </AnimatePresence>
      </div>
      <motion.div
        key={currentDevice.name + "-label"}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-white text-sm font-semibold"
      >
        {currentDevice.name}
      </motion.div>
    </div>
  );
};

export default DeviceCarousel;
