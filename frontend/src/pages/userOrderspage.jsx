import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { motion } from 'framer-motion';
import groupBy from 'lodash/groupBy';

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const limit = 5;

    const totalPages = Math.ceil(total / limit);

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            try {
                const res = await axios.get(
                    `http://localhost:5000/api/orders/user-orders?page=${page}&limit=${limit}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                        },
                    }
                );

                const reversed = res.data.orders.sort(
                    (a, b) => new Date(b.created_at) - new Date(a.created_at)
                );

                setOrders(reversed);
                setTotal(res.data.total);
            } catch (err) {
                console.error('Error fetching orders:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [page]);

    const groupedByDate = Object.entries(
        groupBy(orders, (order) =>
            new Date(order.created_at).toLocaleDateString()
        )
    );

    return (
        <>
            <Navbar />
            <div className="pt-24 px-4 md:px-10 bg-black min-h-screen text-white pb-24">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-3xl font-bold mb-8 text-left"
                >
                    My Orders
                </motion.h1>

                {loading ? (
                    <div className="flex justify-center items-center mt-24">
                        <div className="w-10 h-10 border-4 border-white/20 border-t-[#c20001] rounded-full animate-spin"></div>
                    </div>
                ) : total === 0 ? (
                    <div className="flex justify-center items-center h-[60vh]">
                        <p className="text-center text-gray-400 text-lg">
                            You haven’t placed any orders yet.
                        </p>
                    </div>
                ) : (
                    <>
                        {groupedByDate.map(([date, ordersOnDate], i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 mb-10 shadow-[0_0_30px_rgba(255,255,255,0.05)] border border-white/10"
                            >
                                <h2 className="text-xl font-bold text-white/90 mb-4 border-b border-white/10 pb-2">
                                    Orders from {date}
                                </h2>

                                <div className="space-y-6">
                                    {ordersOnDate.map((order) => (
                                        <div
                                            key={order.orderID}
                                            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 transition hover:shadow-xl hover:border-white/20"
                                        >
                                            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
                                                <div>
                                                    <p className="font-medium text-lg text-white/95">
                                                        Order #{order.orderID}
                                                    </p>
                                                    <p className="text-sm text-gray-300">
                                                        Payment: {order.paymentMethod}
                                                    </p>
                                                </div>
                                                <p className="text-green-400 font-bold mt-2 md:mt-0">
                                                    Total: ₹{order.totalAmount}
                                                </p>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                {order.items.map((item, index) => (
                                                    <div
                                                        key={index}
                                                        className="bg-black/20 border border-white/10 rounded-lg p-3 text-sm"
                                                    >
                                                        <p className="font-medium text-white/90">
                                                            {item.name}
                                                        </p>
                                                        <p className="text-gray-400">Qty: {item.quantity}</p>
                                                        <p className="text-gray-400">
                                                            Price: ₹{item.price}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        ))}

                        {/* Pagination */}
                        <div className="mt-8 flex justify-center items-center gap-4 text-sm mb-20">
                            {page > 1 && (
                                <button
                                    onClick={() => setPage(page - 1)}
                                    className="px-4 py-2 border border-gray-500 rounded hover:bg-white/10 transition"
                                >
                                    ← Prev
                                </button>
                            )}

                            <span>
                                Page {page} of {totalPages}
                            </span>

                            <button
                                disabled={page === totalPages}
                                onClick={() => setPage(page + 1)}
                                className={`px-4 py-2 border border-gray-500 rounded transition ${page === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/10'
                                    }`}
                            >
                                Next →
                            </button>

                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export default MyOrders;
