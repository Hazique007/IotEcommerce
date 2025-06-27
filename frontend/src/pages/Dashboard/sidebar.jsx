import {
  FiBox,
  FiPlusCircle,
  FiLogOut,
  FiChevronLeft,
  FiChevronRight,
  FiUser,
} from 'react-icons/fi';

const Sidebar = ({ activePage, setActivePage, sidebarOpen, setSidebarOpen }) => {
  return (
    <div
      className={`${
        sidebarOpen ? 'w-64' : 'w-16'
      } bg-[#f9f9f9] text-black flex flex-col p-4 border border-black  rounded-xl ml-4 mt-4 mb-4 min-h-[90vh] transition-all duration-300 relative shadow-md`}
    >
      {/* Toggle Button */}
      <button
        className="absolute -right-3 top-4 bg-[#f9f9f9] p-1 rounded-full border border-gray-400 hover:bg-gray-200 transition"
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
          activePage === 'inventory' ? 'bg-blue-100' : 'hover:bg-gray-200'
        }`}
      >
        <FiBox />
        {sidebarOpen && 'Inventory'}
      </button>

      {/* Add Product */}
      <button
        onClick={() => setActivePage('addproduct')}
        className={`flex items-center gap-3 py-2 px-4 text-left rounded-md mb-2 transition ${
          activePage === 'addproduct' ? 'bg-blue-100' : 'hover:bg-gray-200'
        }`}
      >
        <FiPlusCircle />
        {sidebarOpen && 'Add Product'}
      </button>

      {/* Users */}
      <button
        onClick={() => setActivePage('users')}
        className={`flex items-center gap-3 py-2 px-4 text-left rounded-md mb-2 transition ${
          activePage === 'users' ? 'bg-blue-100' : 'hover:bg-gray-200'
        }`}
      >
        <FiUser />
        {sidebarOpen && 'Users'}
      </button>

      {/* Logout */}
      <button
        onClick={() => {
          localStorage.removeItem('token');
          localStorage.removeItem('role');
          window.location.href = '/home';
        }}
        className="flex items-center gap-3 py-2 px-4 text-left rounded-md hover:bg-red-100 text-red-600 mt-auto transition"
      >
        <FiLogOut />
        {sidebarOpen && 'Logout'}
      </button>
    </div>
  );
};

export default Sidebar;
