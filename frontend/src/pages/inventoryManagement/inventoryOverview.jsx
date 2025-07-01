import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar, Line } from 'react-chartjs-2';
import { motion } from 'framer-motion';
import { FiLayout, FiTrendingUp } from 'react-icons/fi'; // <-- Updated icon
import { useLocation } from 'react-router-dom';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend
);

const InventoryOverview = () => {
  const [summary, setSummary] = useState([]);
  const [distribution, setDistribution] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [showTable, setShowTable] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const summaryRes = await axios.get('http://localhost:5000/api/inventory/summary');
        const distRes = await axios.get('http://localhost:5000/api/inventory/stock-distribution');
        const lowStockRes = await axios.get('http://localhost:5000/api/inventory/low-stock');

        setSummary(summaryRes.data);
        setDistribution(distRes.data.data);
        setTotalProducts(distRes.data.data.length);
        setLowStock(lowStockRes.data.lowStock);
      } catch (err) {
        console.error('Error fetching inventory overview:', err);
      }
    };

    fetchData();
  }, [location.pathname]);

  const months = [...new Set(summary.map(item => item.month))].reverse();
  const added = months.map(m => {
    const match = summary.find(s => s.month === m && s.change_type === 'add');
    return match ? match.total_quantity : 0;
  });
  const deducted = months.map(m => {
    const match = summary.find(s => s.month === m && s.change_type === 'deduct');
    return match ? match.total_quantity : 0;
  });

  const barData = {
    labels: months,
    datasets: [
      {
        label: 'Added',
        data: added,
        backgroundColor: '#10b981'
      },
      {
        label: 'Deducted',
        data: deducted,
        backgroundColor: '#ef4444'
      }
    ]
  };

  const lineData = {
    labels: distribution.map(d => d.name),
    datasets: [
      {
        label: 'Stock Quantity',
        data: distribution.map(d => d.quantity),
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
        tension: 0.3,
        fill: true,
        pointBackgroundColor: '#6366f1',
      }
    ]
  };

  return (
    <div className="w-full p-6 bg-white text-gray-900 min-h-screen">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold mb-6"
      >
        Inventory Dashboard
      </motion.h1>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <InfoCard label="Total Products" value={totalProducts} />
        <LowStockCard items={lowStock} />
        <InfoCard label="Monthly Received" value={added.reduce((a, b) => a + b, 0)} />
        <InfoCard label="Vendors Count" value="--" />
      </motion.div>

      <motion.div
        className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        {/* Bar Chart */}
        <div className="bg-white border border-gray-200 p-6 rounded-xl shadow hover:shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Monthly Stock Trend</h2>
          <div className="h-64">
            <Bar
              data={barData}
              options={{
                responsive: true,
                plugins: {
                  legend: { labels: { color: '#111' } }
                },
                scales: {
                  x: { ticks: { color: '#111' } },
                  y: { ticks: { color: '#111' } }
                }
              }}
            />
          </div>
        </div>

        {/* Line Chart or Table Toggle */}
        <div className="bg-white border border-gray-200 p-6 rounded-xl shadow hover:shadow-lg relative">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Category Distribution</h2>
            <button
              onClick={() => setShowTable(!showTable)}
              className="text-gray-500 hover:text-blue-600 transition text-lg"
              title={showTable ? 'View Line Chart' : 'View Table'}
            >
              {showTable ?  <FiLayout />: <FiTrendingUp />}
            </button>
          </div>

          {showTable ? (
            <div className="h-64">
              <Line
                data={lineData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { labels: { color: '#111' } }
                  },
                  scales: {
                    x: { ticks: { color: '#111' } },
                    y: { ticks: { color: '#111' } }
                  }
                }}
              />
            </div>
          ) : (
            <div className="max-h-64 overflow-y-auto">
              <table className="w-full text-sm text-left border border-gray-100">
                <thead className="bg-gray-50 text-gray-700">
                  <tr>
                    <th className="py-2 px-4 border-b">Category</th>
                    <th className="py-2 px-4 border-b">Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {distribution.map((d, i) => (
                    <tr key={i} className="border-b hover:bg-gray-50">
                      <td className="py-2 px-4">{d.name}</td>
                      <td className="py-2 px-4">{d.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

// Reusable Info Card
const InfoCard = ({ label, value }) => (
  <motion.div
    className="bg-white border border-gray-200 p-6 rounded-xl shadow hover:shadow-lg transition-all"
    whileHover={{ scale: 1.03 }}
  >
    <h2 className="text-lg font-semibold mb-2">{label}</h2>
    <p className="text-2xl font-bold text-blue-600">{value}</p>
  </motion.div>
);

// Low Stock List

// Low Stock List
const LowStockCard = ({ items }) => (
  <motion.div
    className="bg-white border border-gray-200 p-6 rounded-xl shadow hover:shadow-lg transition-all overflow-hidden"
    whileHover={{ scale: 1.03 }}
  >
    <h2 className="text-lg font-semibold mb-2 flex items-center justify-between">
      <span>Low Stock Items</span>
      <span className="text-red-500 text-lg">⚠️</span>
    </h2>
    {items.length === 0 ? (
      <p className="text-sm text-gray-600">All items sufficiently stocked</p>
    ) : (
      <div className="overflow-y-auto" style={{ maxHeight: '80px' }}>
        <ul className="space-y-1 text-sm text-red-600 font-medium pr-1">
          {items.map((item, idx) => (
            <li key={idx} className="flex justify-between items-center">
              <span>{item.name}</span>
              <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded">
                Qty: {item.quantity}
              </span>
            </li>
          ))}
        </ul>
      </div>
    )}
  </motion.div>
);



export default InventoryOverview;
