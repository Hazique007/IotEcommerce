import React from "react";
import { motion } from "framer-motion";

const devices = [
  { name: "Arduino", src: "./prod1.png" },
  { name: "ESP32", src: "./prod2.png" },
  { name: "Raspberry Pi", src: "./prod3.png" },
  { name: "Node MCU", src: "./prod4.png" },
  { name: "STM32", src: "./prod5.png" },
];
const floatAnim = {
  animate: {
    y: [0, -8, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};
const DeviceLineup = () => {
  return (
      <div className="w-full flex justify-center items-end bg-transparent py-16 pb-10 mt-20 overflow-hidden gap-4">
      {devices.map((device, index) => (
        <motion.div
          key={index}
          className="relative group flex flex-col items-center"
          variants={floatAnim}
          animate="animate"
          whileHover={{ y: -20, scale: 1.05 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          <img
            src={device.src}
            alt={device.name}
            className="h-[150px] object-contain transition-all duration-300 group-hover:drop-shadow-[0_0_15px_#c20001]"
          />

          {/* Hover name below image */}
          <div className="text-xs text-white mt-2 opacity-0 group-hover:opacity-100 transition duration-300">
            {device.name}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default DeviceLineup;
