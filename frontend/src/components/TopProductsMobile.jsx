import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
const productData = [
    {
        image: "./prod1.png",
        label: "Arduino",
        desc: "Arduino is an open-source microcontroller board that lets you easily build smart devices, automate tasks, and prototype electronics—perfect for beginners and pros alike.",
        feature1: "Plug-and-play coding",
        feature2: "Wide sensor support",
        feature3: "USB-powered setup",
    },
    {
        image: "./prod2.png",
        label: "ESP-32",
        desc: "ESP32 is a powerful microcontroller board with built-in Wi-Fi and Bluetooth, ideal for IoT projects, wireless communication, and fast real-time performance in compact form.",
        feature1: "Dual-core CPU",
        feature2: "Built-in Wi-Fi & BLE",
        feature3: "Low power consumption",
    },
    {
        image: "./prod3.png",
        label: "Raspberry-Pi",
        desc: "Raspberry Pi is a credit-card-sized computer that enables full computing, hardware control, and coding, perfect for learning, prototyping, and real-world applications.",
        feature1: "HDMI & USB ports",
        feature2: "Built-in Wi-Fi",
        feature3: "Linux support",
    },
];

const TopProductsMobile = () => {
    return (
        <section className="bg-black text-white px-4 py-10 flex flex-col w-full items-center">
            {productData.map((product, index) => (
                <div className="flex items-center justify-center pt-10 px-4">
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-md"
                    >
                        {/* Number + Image + Label Row */}
                        <Link to="/product-details">
                        <div className="flex items-center mb-4 gap-4">
                            {/* Number + Image wrapper */}
                            <div className="relative flex items-center">
                                {/* Number behind */}
                                <span
                                    className="text-5xl font-extrabold font-poppins text-transparent absolute left-0 top-1/2 -translate-y-1/2 z-0"
                                    style={{
                                        background: "linear-gradient(180deg, #888888, #444444)",
                                        WebkitBackgroundClip: "text",
                                        opacity: 0.2,
                                    }}
                                >
                                    {index + 1}
                                </span>

                                {/* Image on top of number */}
                                <img
                                    src={product.image}
                                    alt={product.label}
                                    className="w-20 h-20 object-contain relative z-10 ml-5"
                                />
                            </div>

                            {/* Product Name */}
                            <h2 className="text-xl font-bold text-[#c20001]">{product.label}</h2>
                        </div>
                       </Link>

                        {/* Description */}
                        <p className="text-sm text-gray-300 mb-4">{product.desc}</p>

                        {/* Features */}
                        <div className="grid grid-cols-1 gap-4">
                            <div className="bg-white/10 p-4 rounded-lg text-sm text-center">{product.feature1}</div>
                            <div className="bg-white/10 p-4 rounded-lg text-sm text-center">{product.feature2}</div>
                            <div className="bg-white/10 p-4 rounded-lg text-sm text-center">{product.feature3}</div>
                        </div>
                    </motion.div>
                </div>

            ))}
        </section>
    );
};

export default TopProductsMobile;
