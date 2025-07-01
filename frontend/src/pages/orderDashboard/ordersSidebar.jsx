import React, { useState } from 'react';
import {
  FiClipboard,
  FiDownload,
  FiChevronLeft,
  FiChevronRight,
  FiBox
} from 'react-icons/fi';

const OrdersSidebar = ({ activeTab, setActiveTab }) => {
  const [collapsed, setCollapsed] = useState(false);

  const links = [
    { name: 'Overview', icon:FiBox, key: 'overview' },
    { name: 'Order History', icon: FiClipboard, key: 'orders' },
    { name: 'Reports', icon: FiDownload, key: 'download' },
  ];

  return (
    <div
      className={`bg-[#111827] text-white shadow-xl transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-64'
      } h-[calc(100vh-2rem)] my-4 ml-4 rounded-xl flex flex-col justify-between`}
    >
      <div>
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-700">
          {!collapsed && <h1 className="text-xl font-bold">Orders</h1>}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-gray-400 hover:text-white transition"
          >
            {collapsed ? <FiChevronRight /> : <FiChevronLeft />}
          </button>
        </div>

        <div className="flex flex-col gap-2 p-2">
          {links.map(({ name, icon: Icon, key }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition text-sm ${
                activeTab === key
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

export default OrdersSidebar;
