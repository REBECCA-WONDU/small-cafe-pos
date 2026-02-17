'use client';

import { useState, useEffect } from 'react';
import { Order } from '../types';
import { getOrders, updateOrderStatus } from '../services/api';

export default function Kitchen() {
    const [orders, setOrders] = useState<Order[]>([]);

    useEffect(() => {
        fetchOrders();
        const interval = setInterval(fetchOrders, 10000); // 10s poll
        return () => clearInterval(interval);
    }, []);

    const fetchOrders = async () => {
        const all = await getOrders();
        // Filter only active orders for kitchen
        setOrders(all.filter(o => o.status !== 'Completed' && o.status !== 'Cancelled' && o.status !== 'Paid'));
    };

    const handleStatusUpdate = async (id: number, status: string) => {
        await updateOrderStatus(id, status);
        fetchOrders();
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6 font-sans">
            <header className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
                <h1 className="text-3xl font-bold text-emerald-400">Kitchen Display System</h1>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
                        Live Updates
                    </span>
                    <a href="/" className="hover:text-white transition-colors">← Back to POS</a>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {orders.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-600">
                        <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <p className="text-xl font-medium">No active orders</p>
                        <p className="text-sm">New orders will appear here automatically</p>
                    </div>
                ) : (
                    orders.map((order) => (
                        <div key={order.id} className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden shadow-xl flex flex-col animate-in fade-in duration-300">
                            <div className={`p-4 flex justify-between items-center ${order.status === 'Pending' ? 'bg-amber-900/40 border-b border-amber-800' : 'bg-blue-900/40 border-b border-blue-800'
                                }`}>
                                <div>
                                    <h2 className="text-2xl font-bold text-white">Table {order.tableNumber}</h2>
                                    <p className="text-xs text-gray-300 font-mono">#{order.id.toString().padStart(4, '0')} • {new Date(order.orderDate).toLocaleTimeString()}</p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${order.status === 'Pending' ? 'bg-amber-500 text-amber-950' : 'bg-blue-500 text-blue-950'
                                    }`}>
                                    {order.status}
                                </span>
                            </div>

                            <div className="p-4 flex-grow space-y-4">
                                {order.notes && (
                                    <div className="bg-red-900/20 text-red-200 p-3 rounded-lg text-sm border border-red-900/50 flex items-start gap-2">
                                        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                        <span>{order.notes}</span>
                                    </div>
                                )}

                                <ul className="space-y-3">
                                    {order.orderItems.map((item, idx) => (
                                        <li key={idx} className="flex justify-between items-start border-b border-gray-700 pb-2 last:border-0">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-emerald-400 text-lg">{item.quantity}x</span>
                                                    <span className="font-medium text-gray-200">{item.menuItemName}</span>
                                                </div>
                                                {item.specialInstructions && (
                                                    <div className="text-sm text-yellow-400 mt-1 pl-6 italic">
                                                        Note: {item.specialInstructions}
                                                    </div>
                                                )}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="p-4 bg-gray-800 border-t border-gray-700 grid grid-cols-2 gap-3">
                                {order.status === 'Pending' && (
                                    <button
                                        onClick={() => handleStatusUpdate(order.id, 'Preparing')}
                                        className="col-span-2 w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold transition-all shadow-lg shadow-blue-900/20"
                                    >
                                        Start Preparing
                                    </button>
                                )}
                                {order.status === 'Preparing' && (
                                    <button
                                        onClick={() => handleStatusUpdate(order.id, 'Served')}
                                        className="col-span-2 w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold transition-all shadow-lg shadow-emerald-900/20"
                                    >
                                        Mark Ready to Serve
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
