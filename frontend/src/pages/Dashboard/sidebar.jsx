import React from 'react';
import { FiBox, FiPlusCircle, FiLogOut, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const Sidebar = ({ activePage, setActivePage, sidebarOpen, setSidebarOpen }) => {
  return (
    <div
      className={`${
        sidebarOpen ? 'w-64' : 'w-16'
      } bg-[#111827] text-white flex flex-col p-4 rounded-xl ml-4 mt-4 mb-4 min-h-[90vh] transition-all duration-300 relative`}
    >
      {/* Toggle Button */}
      <button
        className="absolute -right-3 top-4 bg-[#111827] p-1 rounded-full border border-white hover:bg-gray-700 transition"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <FiChevronLeft /> : <FiChevronRight />}
      </button>

      {/* Title */}
      {sidebarOpen && <h2 className="text-2xl font-bold mb-6 text-center">Admin Panel</h2>}

      {/* Inventory */}
      <button
        onClick={() => setActivePage('inventory')}
        className={`flex items-center gap-3 py-2 px-4 text-left rounded-md mb-2 transition ${
          activePage === 'inventory' ? 'bg-[#c20001]' : 'hover:bg-gray-700'
        }`}
      >
        <FiBox />
        {sidebarOpen && 'Inventory'}
      </button>

      {/* Add Product */}
      <button
        onClick={() => setActivePage('add')}
        className={`flex items-center gap-3 py-2 px-4 text-left rounded-md mb-2 transition ${
          activePage === 'add' ? 'bg-[#c20001]' : 'hover:bg-gray-700'
        }`}
      >
        <FiPlusCircle />
        {sidebarOpen && 'Add Product'}
      </button>

      {/* Logout */}
      <button
        onClick={() => {
          localStorage.removeItem('token');
          window.location.href = '/';
        }}
        className="flex items-center gap-3 py-2 px-4 text-left rounded-md hover:bg-red-600 mt-auto transition"
      >
        <FiLogOut />
        {sidebarOpen && 'Logout'}
      </button>
    </div>
  );
};

export default Sidebar;
