import React from 'react';
import { Player } from '@lottiefiles/react-lottie-player';
import comingSoon from '../../assets/comingsoon.lottie'; // adjust path as needed

const ComingSoon = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-black via-black to-[#c20001] text-white px-4">
      <Player
        autoplay
        loop
        src={comingSoon}
        style={{ height: '300px', width: '300px' }}
      />

      <h1 className="mt-8 text-4xl sm:text-5xl font-bold text-white animate-pulse drop-shadow-lg text-center">
        🚀 Coming Soon
      </h1>

      <p className="mt-3 text-gray-300 text-sm sm:text-base text-center max-w-md">
        We’re working hard to launch something amazing. Stay tuned!
      </p>
    </div>
  );
};

export default ComingSoon;
