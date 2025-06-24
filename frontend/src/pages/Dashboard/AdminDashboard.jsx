import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Inventory from './inventory';
import AddProduct from './addproduct';

const AdminDashboard = () => {
  const [activePage, setActivePage] = useState('inventory');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex">
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      <div className={`flex-1 p-6 transition-all duration-300 ${sidebarOpen ? 'ml-4' : 'ml-0'}`}>
        {activePage === 'inventory' ? <Inventory /> : <AddProduct />}
      </div>
    </div>
  );
};

export default AdminDashboard;
