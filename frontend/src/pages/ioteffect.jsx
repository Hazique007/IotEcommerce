import React, { useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from "gsap";
import Home from './Home';

const IotEffect = () => {
  const [showContent, setShowContent] = useState(false);

  useGSAP(() => {
    const tl = gsap.timeline();

    tl.to(".vi-mask-group", {
      rotate: 10,
      duration: 2,
      ease: "power3.inOut",
      transformOrigin: "50% 50%",
    })
    .to(".vi-mask-group", {
      scale: 8,
      duration: 2,
      delay: -1.8,
      ease: "expo.inOut",
      transformOrigin: "50% 50%", // typo fix: 'tranformOrigin' → 'transformOrigin'
      opacity: 0,
      onUpdate: function () {
        if (this.progress() >= 0.9) {
          setShowContent(true); // ✅ Let React handle unmounting
          this.kill();
        }
      }
    });
  });

  return (
    <>
      {!showContent && (
        <div className='svg flex items-center justify-center fixed top-0 left-0 z-[100] w-full h-screen overflow-hidden bg-white'>
          <svg viewBox="0 0 800 600" preserveAspectRatio='xMidYMid slice'>
            <defs>
              <mask id='viMask'>
                <rect width="100%" height="100%" fill='black' />
                <g className='vi-mask-group'>
                  <text
                    x="50%" y="50%" fontSize="200" textAnchor='middle' fill='white'
                    dominantBaseline="middle" fontFamily='Arial Black'
                  >
                    IOT
                  </text>
                </g>
              </mask>
            </defs>
            <image
              href='./bg2.jpg'
              mask='url(#viMask)'
              width="100%"
              height="100%"
              preserveAspectRatio='xMidYMid slice'
            />
          </svg>
        </div>
      )}

      {showContent && <Home />}
    </>
  );
};

export default IotEffect;   
