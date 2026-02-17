'use client';

import { useState, useEffect } from 'react';
import { Order, MenuItem } from '../types';
import { getOrders, getDailyRevenue, updateOrderStatus, getMenu, createMenuItem, updateMenuItem, deleteMenuItem } from '../services/api';
import { Trash2, Edit, Plus, X, Search, Image as ImageIcon } from 'lucide-react';

export default function ManagerDashboard() {
    const [activeTab, setActiveTab] = useState<'overview' | 'menu'>('overview');

    // Dashboard State
    const [orders, setOrders] = useState<Order[]>([]);
    const [dailyRevenue, setDailyRevenue] = useState<number>(0);
    const [filter, setFilter] = useState('All');

    // Menu State
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
    const [formData, setFormData] = useState<Partial<MenuItem>>({
        name: '',
        description: '',
        price: 0,
        category: 'Foods',
        imageUrl: ''
    });

    useEffect(() => {
        loadData();
        const interval = setInterval(loadData, 30000); // 30s poll
        return () => clearInterval(interval);
    }, [activeTab]);

    const loadData = async () => {
        if (activeTab === 'overview') {
            const all = await getOrders();
            setOrders(all.sort((a, b) => b.id - a.id));
            const rev = await getDailyRevenue();
            setDailyRevenue(rev);
        } else {
            const items = await getMenu();
            setMenuItems(items);
        }
    };

    const handleSaveItem = async () => {
        if (!formData.name || !formData.price || !formData.category) return;

        if (editingItem) {
            await updateMenuItem(editingItem.id, { ...editingItem, ...formData } as MenuItem);
        } else {
            await createMenuItem(formData as MenuItem);
        }

        setIsModalOpen(false);
        setEditingItem(null);
        setFormData({ name: '', description: '', price: 0, category: 'Foods', imageUrl: '' });
        loadData();
    };

    const handleDeleteItem = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            const success = await deleteMenuItem(id);
            if (success) {
                loadData();
            } else {
                alert('Failed to delete item. It might be part of an existing order.');
            }
        }
    };

    const openEditModal = (item: MenuItem) => {
        setEditingItem(item);
        setFormData(item);
        setIsModalOpen(true);
    };

    const filteredOrders = filter === 'All'
        ? orders
        : orders.filter(o => o.status === filter);

    return (
        <div className="min-h-screen bg-gray-50 font-sans p-8">
            <header className="flex justify-between items-center mb-8 border-b border-gray-200 pb-4">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Manager Dashboard</h1>
                    <p className="text-gray-500 mt-1">Manage orders and menu items</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex bg-gray-200 p-1 rounded-lg">
                        <button
                            onClick={() => setActiveTab('overview')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'overview' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
                        >
                            Overview
                        </button>
                        <button
                            onClick={() => setActiveTab('menu')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'menu' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
                        >
                            Menu Management
                        </button>
                    </div>
                    <a href="/" className="text-gray-500 hover:text-gray-900 font-medium ml-4">← Back to POS</a>
                </div>
            </header>

            {activeTab === 'overview' ? (
                <>
                    <div className="mb-6">
                        <div className="bg-white px-6 py-4 rounded-xl shadow-sm border border-emerald-100 flex items-center gap-4 w-fit">
                            <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <div>
                                <p className="text-gray-500 text-xs font-semibold uppercase">Daily Revenue</p>
                                <h2 className="text-2xl font-bold text-gray-900">${dailyRevenue.toFixed(2)}</h2>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-800">Order History</h2>
                            <div className="flex gap-2">
                                {['All', 'Pending', 'Preparing', 'Served', 'Paid', 'Cancelled'].map((f) => (
                                    <button
                                        key={f}
                                        onClick={() => setFilter(f)}
                                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === f
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                    >
                                        {f}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
                                    <tr>
                                        <th className="px-6 py-4">Order ID</th>
                                        <th className="px-6 py-4">Table</th>
                                        <th className="px-6 py-4">Time</th>
                                        <th className="px-6 py-4">Items</th>
                                        <th className="px-6 py-4">Total</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredOrders.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="px-6 py-8 text-center text-gray-400">
                                                No orders found
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredOrders.map((order) => (
                                            <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 font-mono text-sm text-gray-600">#{order.id}</td>
                                                <td className="px-6 py-4 font-bold text-gray-800">{order.tableNumber}</td>
                                                <td className="px-6 py-4 text-sm text-gray-500">{new Date(order.orderDate).toLocaleTimeString()}</td>
                                                <td className="px-6 py-4 text-sm">
                                                    <div className="flex flex-col gap-1">
                                                        {order.orderItems.map((item, idx) => (
                                                            <span key={idx} className="text-gray-700">
                                                                <span className="font-bold">{item.quantity}x</span> {item.menuItemName}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 font-bold text-gray-900">${order.totalPrice.toFixed(2)}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${order.status === 'Paid' ? 'bg-emerald-100 text-emerald-800' :
                                                        order.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                                                            order.status === 'Served' ? 'bg-blue-100 text-blue-800' :
                                                                'bg-amber-100 text-amber-800'
                                                        }`}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {order.status !== 'Paid' && order.status !== 'Cancelled' && (
                                                        <div className="flex gap-2">
                                                            {order.status === 'Served' && (
                                                                <button
                                                                    onClick={() => updateOrderStatus(order.id, 'Paid').then(loadData)}
                                                                    className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg transition-colors font-medium"
                                                                >
                                                                    Mark Paid
                                                                </button>
                                                            )}
                                                            <button
                                                                onClick={() => updateOrderStatus(order.id, 'Cancelled').then(loadData)}
                                                                className="text-xs text-red-600 hover:bg-red-50 hover:text-red-700 font-medium px-2 py-1 rounded transition-colors"
                                                            >
                                                                Cancel
                                                            </button>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            ) : (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search menu..."
                                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <button
                            onClick={() => {
                                setEditingItem(null);
                                setFormData({ name: '', description: '', price: 0, category: 'Food', imageUrl: '' });
                                setIsModalOpen(true);
                            }}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
                        >
                            <Plus size={20} />
                            Add Item
                        </button>
                    </div>

                    {/* Menu List View */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
                                <tr>
                                    <th className="px-6 py-4">Image</th>
                                    <th className="px-6 py-4">Name</th>
                                    <th className="px-6 py-4">Category</th>
                                    <th className="px-6 py-4">Price</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {menuItems.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50 transition-colors group">
                                        <td className="px-6 py-3">
                                            <div className="h-12 w-12 rounded-lg bg-gray-100 overflow-hidden border border-gray-200 flex items-center justify-center">
                                                {item.imageUrl ? (
                                                    <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
                                                ) : (
                                                    <ImageIcon size={20} className="text-gray-400" />
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-3">
                                            <div className="font-bold text-gray-900">{item.name}</div>
                                            <div className="text-xs text-gray-500 line-clamp-1 max-w-[200px]">{item.description}</div>
                                        </td>
                                        <td className="px-6 py-3">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                                                {item.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-3 font-mono font-medium text-gray-700">
                                            ${item.price.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-3">
                                            <span className={`inline-flex h-2 w-2 rounded-full ${item.isAvailable ? 'bg-emerald-500' : 'bg-red-500'}`} title={item.isAvailable ? "Available" : "Unavailable"} />
                                        </td>
                                        <td className="px-6 py-3 text-right">
                                            <div className="flex justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => openEditModal(item)}
                                                    className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteItem(item.id)}
                                                    className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {menuItems.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                                            <div className="flex flex-col items-center gap-2">
                                                <h3 className="text-lg font-medium text-gray-900">No items found</h3>
                                                <p>Get started by adding a new menu item.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Modal */}
                    {isModalOpen && (
                        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                            <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                                    <h3 className="font-bold text-lg text-gray-900">
                                        {editingItem ? 'Edit Item' : 'New Menu Item'}
                                    </h3>
                                    <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                        <X size={20} />
                                    </button>
                                </div>
                                <div className="p-6 space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                            placeholder="e.g. Classic Burger"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                                        <input
                                            type="number"
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                            placeholder="0.00"
                                            step="0.01"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                        <select
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white"
                                        >
                                            <option value="Foods">Foods</option>
                                            <option value="Drinks">Drinks</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                        <textarea
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                            placeholder="Details about the item..."
                                            rows={3}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                                        <input
                                            type="text"
                                            value={formData.imageUrl}
                                            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                            placeholder="https://example.com/image.jpg"
                                        />
                                    </div>
                                </div>
                                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                                    <button
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSaveItem}
                                        disabled={!formData.name || !formData.price || !formData.category} // Basic validation
                                        className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {editingItem ? 'Save Changes' : 'Create Item'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
