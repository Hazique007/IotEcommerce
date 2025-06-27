import React, { useState } from 'react';
import InventorySidebar from './inventorySIdebar';
import InventoryOverview from './inventoryOverview';
import AddStock from './addStock';
import MovementHistory from './movementHistory';
import InventoryReports from './inventoryReports';

const InventoryDashboard = () => {
  const [activePage, setActivePage] = useState('overview');

  const renderPage = () => {
    switch (activePage) {
      case 'addstock': return <AddStock />;
      case 'history': return <MovementHistory />;
      case 'reports': return <InventoryReports />;
      default: return <InventoryOverview />;
    }
  };

  return (
    <div className="flex bg-white min-h-screen">
      <InventorySidebar activePage={activePage} setActivePage={setActivePage} />
      <div className="flex-1">{renderPage()}</div>
    </div>
  );
};

export default InventoryDashboard;
