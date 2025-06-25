import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import axios from 'axios';

gsap.registerPlugin(ScrollTrigger);

const ProductsSection = () => {
  const containerRef = useRef();
  const numberRef = useRef();
  const imageRef = useRef();
  const detailsRef = useRef();
  const currentIndex = useRef(0);
  const linkRef = useRef();
  const [productData, setProductData] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const ids = [1, 2, 3];
        const responses = await Promise.all(
          ids.map(id => axios.get(`http://localhost:5000/api/products/${id}`))
        );
        const data = responses.map(res => res.data);
        setProductData(data);
      } catch (err) {
        console.error('Error fetching products:', err);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (productData.length === 0) return;

    const section = containerRef.current;
    const totalSlides = productData.length;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: `+=${totalSlides * window.innerHeight}`,
        scrub: 1,
        pin: true,
        onUpdate: (self) => {
          const index = Math.floor(self.progress * totalSlides);
          const clampedIndex = Math.min(index, totalSlides - 1);

          if (clampedIndex !== currentIndex.current) {
            currentIndex.current = clampedIndex;

            // Update span number
            gsap.to(numberRef.current, {
              textContent: clampedIndex + 1,
              duration: 0.6,
              ease: 'power2.out',
              snap: { textContent: 1 },
            });

            // Update link href
            if (linkRef.current && productData[clampedIndex]) {
              linkRef.current.setAttribute('href', `/product-details/${productData[clampedIndex].id}`);
            }

            // Update image
            gsap.to(imageRef.current, {
              opacity: 0,
              scale: 0.9,
              duration: 0.3,
              ease: 'power1.inOut',
              onComplete: () => {
                imageRef.current.src = productData[clampedIndex].image_url;
                gsap.fromTo(
                  imageRef.current,
                  { opacity: 0, scale: 1.1 },
                  { opacity: 1, scale: 1, duration: 0.6, ease: 'power2.out' }
                );
              },
            });

            // Update details
            gsap.to(detailsRef.current, {
              opacity: 0,
              y: 30,
              duration: 0.3,
              ease: 'power1.inOut',
              onComplete: () => {
                const p = productData[clampedIndex];
                detailsRef.current.innerHTML = `
                  <h2 class="text-3xl font-bold mb-4 font-poppins" style="color: #c20001;">${p.name}</h2>
                  <p class="text-lg text-gray-300 mb-6">${p.description}</p>
                  <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div class="bg-white/10 p-6 rounded-lg">${p.f1}</div>
                    <div class="bg-white/10 p-6 rounded-lg">${p.f2}</div>
                    <div class="bg-white/10 p-6 rounded-lg">${p.f3}</div>
                  </div>
                `;
                gsap.fromTo(
                  detailsRef.current,
                  { opacity: 0, y: 40 },
                  { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
                );
              },
            });
          }
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, [productData]);

  if (productData.length === 0) return null;

  return (
    <section
      className="relative w-full h-screen top-5 overflow-hidden bg-black text-white no-scrollbar"
      ref={containerRef}
    >
      <div className="flex flex-col md:flex-row items-center justify-center h-full px-6">
        <div className="relative h-full w-full flex justify-center items-center px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="relative flex flex-row items-center justify-center gap-10"
          >
            {/* Number on the left */}
            <div className="relative w-[260px] h-[260px] flex justify-center items-center">
              <span
                ref={numberRef}
                className="absolute font-extrabold font-poppins text-transparent z-0 pointer-events-none"
                style={{
                  fontSize: 'clamp(15rem, 22vw, 18rem)',
                  background: 'linear-gradient(180deg, #888888, #444444)',
                  WebkitBackgroundClip: 'text',
                  opacity: 0.2,
                }}
              >
                1
              </span>
            </div>

            {/* Clickable Product (Image + Details) */}
            <a
              ref={linkRef}
              href={`/product-details/${productData[0]?.id}`}
              className="flex flex-col md:flex-row gap-10 items-center no-underline"
            >
              <motion.img
                ref={imageRef}
                src={productData[0]?.image_url}
                alt="Product"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="relative z-20 w-[400px] h-[400px] object-contain -ml-45 cursor-pointer"
              />

              <motion.div
                ref={detailsRef}
                className="group w-full max-w-xl bg-white/10 backdrop-blur-xl border border-white/10 shadow-lg p-8 rounded-2xl z-20 transition-all relative overflow-hidden glow-wrapper"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h2 className="text-3xl font-bold mb-4 font-poppins text-[#c20001]">
                  {productData[0]?.name}
                </h2>
                <p className="text-lg text-gray-300 mb-6">{productData[0]?.description}</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="bg-white/10 p-6 rounded-lg">{productData[0]?.f1}</div>
                  <div className="bg-white/10 p-6 rounded-lg">{productData[0]?.f2}</div>
                  <div className="bg-white/10 p-6 rounded-lg">{productData[0]?.f3}</div>
                </div>
              </motion.div>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
