import Navbar from "../components/navbar"

const profile = () => {
  return (
   <div>
        <Navbar />
       
        <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-black via-black to-[#c20001] text-white px-4">
            <h1 className="mt-8 text-4xl sm:text-5xl font-bold text-white animate-pulse drop-shadow-lg text-center">
            🚀 Coming soon!
            </h1>
            <p className="mt-3 text-gray-300 text-sm sm:text-base text-center max-w-md">
            We’re working hard to launch something amazing. Stay tuned!
            </p>
        </div>
    </div>
  )
}

export default profile