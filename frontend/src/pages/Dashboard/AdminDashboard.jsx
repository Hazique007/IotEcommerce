import React, { useState } from 'react';
import Sidebar from './sidebar';
import Inventory from './inventory';
import AddProduct from './addproduct';
import Users from './users';

const AdminDashboard = () => {
  const [activePage, setActivePage] = useState('inventory');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const renderPage = () => {
    switch (activePage) {
      case 'inventory':
        return <Inventory />;
      case 'addproduct':
        return <AddProduct />;
      case 'users':
        return <Users />;
      default:
        return <Inventory />;
    }
  };

  return (
    <div className="flex">
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      <div className={`flex-1 p-6 transition-all duration-300 ${sidebarOpen ? 'ml-4' : 'ml-0'}`}>
        {renderPage()}
      </div>
    </div>
  );
};

export default AdminDashboard;
