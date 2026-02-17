'use client';

import { useState } from 'react';
import { OrderItem } from '../types';
import { Trash2, Receipt, ChefHat, Utensils } from 'lucide-react';

interface CartProps {
    items: OrderItem[];
    onRemove: (id: number) => void;
    onSubmit: (tableNumber: string, notes: string) => void;
}

export default function Cart({ items, onRemove, onSubmit }: CartProps) {
    const [tableNumber, setTableNumber] = useState('');
    const [notes, setNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    console.log('Cart rendered - Items:', items.length, 'Total:', total, 'Table:', tableNumber, 'Submitting:', isSubmitting);

    const handleSubmit = async () => {
        console.log('Complete Order clicked - Items:', items.length, 'Table:', tableNumber);
        setIsSubmitting(true);
        await onSubmit(tableNumber, notes);
        setIsSubmitting(false);
        setTableNumber('');
        setNotes('');
    };

    return (
        <div className="bg-white rounded-2xl shadow-xl border border-zinc-100 overflow-hidden flex flex-col h-[calc(100vh-8rem)] sticky top-24">
            <div className="bg-zinc-900 text-white p-6 flex items-center justify-between shadow-md z-10">
                <div className="flex items-center gap-3">
                    <div className="bg-white/10 p-2 rounded-lg">
                        <Receipt size={24} className="text-emerald-400" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold leading-tight">Current Order</h2>
                        <p className="text-white/60 text-xs font-medium">Table Service</p>
                    </div>
                </div>
                <span className="bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg shadow-emerald-900/20">
                    {items.length} Items
                </span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-zinc-50/50">
                {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-zinc-400 py-12">
                        <div className="bg-zinc-100 p-6 rounded-full mb-4">
                            <Utensils size={48} className="text-zinc-300" />
                        </div>
                        <p className="font-medium text-zinc-500">Your cart is empty</p>
                        <p className="text-xs mt-1 text-zinc-400">Add items from the menu to start</p>
                    </div>
                ) : (
                    <ul className="space-y-3">
                        {items.map((item, idx) => (
                            <li key={idx} className="bg-white p-4 rounded-xl shadow-sm border border-zinc-100 group hover:border-emerald-100 transition-colors">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <p className="font-bold text-zinc-800 text-sm">{item.menuItemName}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded text-xs font-medium">
                                                Qty: {item.quantity}
                                            </span>
                                            <span className="text-zinc-400 text-xs">×</span>
                                            <span className="text-zinc-600 text-xs font-medium">
                                                ${item.price.toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => onRemove(idx)}
                                        className="text-zinc-300 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                        title="Remove item"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                                {item.specialInstructions && (
                                    <div className="text-xs text-amber-700 bg-amber-50 px-3 py-2 rounded-lg border border-amber-100/50 mt-2 flex items-start gap-2">
                                        <ChefHat size={12} className="mt-0.5 shrink-0 opacity-50" />
                                        <span className="italic">{item.specialInstructions}</span>
                                    </div>
                                )}
                                <div className="mt-2 pt-2 border-t border-dashed border-zinc-100 text-right text-sm font-semibold text-zinc-900">
                                    ${(item.price * item.quantity).toFixed(2)}
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div className="bg-white p-6 border-t border-zinc-100 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] z-10">
                <div className="flex justify-between items-end mb-6">
                    <span className="text-zinc-500 font-medium text-sm mb-1">Total Amount</span>
                    <span className="text-3xl font-extrabold text-zinc-900 tracking-tight">
                        {total.toFixed(2)} birr
                    </span>
                </div>

                <div className="space-y-4">
                    <div>
                        <input
                            type="text"
                            placeholder="Table Number (e.g. 5A)"
                            className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all placeholder:text-zinc-400 font-medium text-zinc-700"
                            value={tableNumber}
                            onChange={(e) => setTableNumber(e.target.value)}
                        />
                    </div>
                    <div>
                        <textarea
                            placeholder="Order Notes (Optional)"
                            rows={2}
                            className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all placeholder:text-zinc-400 text-sm resize-none"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={handleSubmit}
                        disabled={items.length === 0 || !tableNumber || isSubmitting}
                        className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-emerald-500/30 transition-all duration-200 transform active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? (
                            <span className="animate-pulse">Processing...</span>
                        ) : (
                            <>
                                <span>Complete Order</span>
                                <Receipt size={18} />
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
