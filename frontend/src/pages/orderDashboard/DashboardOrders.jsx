import React, { useState } from 'react';
import OrdersSidebar from './ordersSidebar';
import OrdersTable from './ordersTable';
import DownloadReport from './DownloadReport';
import OrderOverview from './orderOverview';

const OrdersDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const renderContent = () => {
    switch (activeTab) {
      case 'orders':
        return <OrdersTable />;
        case 'download':
        return <DownloadReport />;
      case 'overview':
      default:
        return <OrderOverview />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <OrdersSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 p-8">{renderContent()}</div>
    </div>
  );
};

export default OrdersDashboard;
