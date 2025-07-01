import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';

const OrderOverview = () => {
  const [data, setData] = useState({
    totalOrders: 0,
    ordersThisMonth: 0,
    monthlySales: [],
    totalSales: 0,
    topProduct: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/api/orders/overview')
      .then(res => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const chartData = {
    labels: data.monthlySales.map(m => `Month ${m.month}`),
    datasets: [{
      label: 'Sales ₹',
      data: data.monthlySales.map(m => m.sales),
      borderColor: '#c20001',
      backgroundColor: 'rgba(194,0,1,0.1)',
      fill: true,
      tension: 0.3,
    }],
  };

  const chartOptions = {
    maintainAspectRatio: false,
    responsive: true,
    scales: { y: { beginAtZero: true } },
    plugins: {
      legend: { labels: { font: { size: 14 } } }
    }
  };

  return (
    <div className="h-[calc(100vh-40px)] overflow-hidden p-6 bg-white rounded-xl shadow-lg">
      {loading ? (
        <p>Loading overview...</p>
      ) : (
        <div className="flex flex-col h-full">
          {/* Heading */}
          <h2 className="text-2xl font-semibold mb-4 text-black">Order Overview</h2>

          {/* Info Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-100 p-4 rounded-xl text-center shadow-sm">
              <p className="text-gray-500">Total Orders</p>
              <p className="text-2xl font-bold">{data.totalOrders}</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-xl text-center shadow-sm">
              <p className="text-gray-500">Orders This Month</p>
              <p className="text-2xl font-bold">{data.ordersThisMonth}</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-xl text-center shadow-sm">
              <p className="text-gray-500">Top Product</p>
              <p className="text-md font-bold text-[#c20001]">{data.topProduct}</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-xl text-center shadow-sm">
              <p className="text-gray-500">Total Sales</p>
              <p className="text-2xl font-bold">₹{data.totalSales?.toLocaleString()}</p>
            </div>
          </div>

          {/* Chart */}
          <div className="flex-1 min-h-0">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderOverview;
