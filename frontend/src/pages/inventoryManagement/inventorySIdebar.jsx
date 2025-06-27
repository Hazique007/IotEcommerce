import React, { useState } from 'react';
import { FiBox, FiBarChart2, FiClipboard, FiPlusCircle, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const InventorySidebar = ({ activePage, setActivePage }) => {
  const [collapsed, setCollapsed] = useState(false);

  const links = [
    { name: 'Overview', icon: FiBox },
    { name: 'AddStock', icon: FiPlusCircle },
    { name: 'History', icon: FiClipboard },
    { name: 'Reports', icon: FiBarChart2 },
  ];

  return (
    <div
      className={`bg-[#111827] text-white shadow-xl transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-64'
      } h-[calc(100vh-2rem)] my-4 ml-4 rounded-xl flex flex-col justify-between`}
    >
      <div>
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-700">
          {!collapsed && <h1 className="text-xl font-bold">Inventory</h1>}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-gray-400 hover:text-white transition"
          >
            {collapsed ? <FiChevronRight /> : <FiChevronLeft />}
          </button>
        </div>

        <div className="flex flex-col gap-2 p-2">
          {links.map(({ name, icon: Icon }) => (
            <button
              key={name}
              onClick={() => setActivePage(name.toLowerCase())}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition text-sm ${
                activePage === name.toLowerCase()
                  ? 'bg-[#c20001]'
                  : 'hover:bg-gray-700'
              }`}
            >
              <Icon size={18} />
              {!collapsed && <span>{name}</span>}
            </button>
          ))}
        </div>
      </div>

      {!collapsed && (
        <div className="text-center text-xs text-gray-400 mb-4">© 2025 IoT Corp</div>
      )}
    </div>
  );
};

export default InventorySidebar;
