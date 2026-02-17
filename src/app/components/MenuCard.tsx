'use client';

import { useState } from 'react';
import { MenuItem } from '../types';
import { Plus, Minus, ShoppingCart } from 'lucide-react';

interface MenuCardProps {
    item: MenuItem;
    onAdd: (item: MenuItem, qty: number, notes: string) => void;
}

export default function MenuCard({ item, onAdd }: MenuCardProps) {
    const [qty, setQty] = useState(1);
    const [isAdded, setIsAdded] = useState(false);

    const handleAdd = () => {
        console.log('🍽️ MenuCard: Add button clicked for', item.name, 'Qty:', qty);
        onAdd(item, qty, '');
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 1500);
        setQty(1);
    };

    return (
        <div className={`group relative bg-white rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-2xl ${!item.isAvailable ? 'opacity-60' : 'shadow-md hover:-translate-y-1'}`}>
            {/* Image Section with Gradient Overlay */}
            <div className="relative h-48 overflow-hidden">
                {item.imageUrl ? (
                    <>
                        <img
                            src={item.imageUrl}
                            alt={item.name}
                            className={`w-full h-full object-cover transition-all duration-700 ${!item.isAvailable ? 'grayscale' : 'group-hover:scale-110'}`}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    </>
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-emerald-400 via-teal-400 to-cyan-500 flex items-center justify-center">
                        <span className="text-white/30 text-7xl">🍽️</span>
                    </div>
                )}

                {/* Sold Out Overlay */}
                {!item.isAvailable && (
                    <div className="absolute inset-0 bg-black/70 flex items-center justify-center backdrop-blur-sm">
                        <div className="bg-red-500 text-white px-6 py-2 rounded-full font-bold text-sm tracking-wide shadow-xl transform -rotate-12">
                            SOLD OUT
                        </div>
                    </div>
                )}
            </div>

            {/* Content Section */}
            <div className="p-5">
                {/* Title and Price */}
                <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="text-lg font-bold text-zinc-800 flex-1 line-clamp-1 group-hover:text-emerald-600 transition-colors">
                        {item.name}
                    </h3>
                    <div className="bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-full shadow-sm shrink-0">
                        <span className="font-bold text-sm">{item.price.toFixed(2)} birr</span>
                    </div>
                </div>

                {/* Description */}
                <p className="text-zinc-500 text-sm mb-4 line-clamp-2 leading-relaxed min-h-[2.5rem]">
                    {item.description}
                </p>

                {/* Action Bar - Vertical Layout */}
                <div className="space-y-3">
                    {/* Quantity Selector */}
                    <div className={`flex items-center justify-center bg-gradient-to-r from-zinc-50 to-zinc-100 rounded-xl p-1.5 shadow-inner ${!item.isAvailable ? 'opacity-40 pointer-events-none' : ''}`}>
                        <button
                            onClick={() => setQty(Math.max(1, qty - 1))}
                            className="w-10 h-10 flex items-center justify-center rounded-lg bg-white text-zinc-600 hover:text-emerald-600 hover:bg-emerald-50 shadow-sm transition-all active:scale-95"
                            aria-label="Decrease quantity"
                        >
                            <Minus size={18} strokeWidth={2.5} />
                        </button>
                        <span className="flex-1 text-center font-bold text-zinc-800 text-lg tabular-nums">
                            {qty}
                        </span>
                        <button
                            onClick={() => setQty(qty + 1)}
                            className="w-10 h-10 flex items-center justify-center rounded-lg bg-white text-zinc-600 hover:text-emerald-600 hover:bg-emerald-50 shadow-sm transition-all active:scale-95"
                            aria-label="Increase quantity"
                        >
                            <Plus size={18} strokeWidth={2.5} />
                        </button>
                    </div>

                    {/* Add to Cart Button - Full Width */}
                    <button
                        onClick={handleAdd}
                        disabled={!item.isAvailable}
                        className={`w-full h-11 flex items-center justify-center gap-2 rounded-xl font-bold text-sm transition-all duration-300 ${!item.isAvailable
                                ? 'bg-zinc-200 text-zinc-400 cursor-not-allowed'
                                : isAdded
                                    ? 'bg-gradient-to-r from-zinc-700 to-zinc-900 text-white shadow-lg scale-95'
                                    : 'bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 hover:scale-105 active:scale-100'
                            }`}
                    >
                        {!item.isAvailable ? (
                            <span>Unavailable</span>
                        ) : isAdded ? (
                            <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                                <span>Added!</span>
                            </>
                        ) : (
                            <>
                                <ShoppingCart size={18} strokeWidth={2.5} />
                                <span>Add to Cart</span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Shimmer Effect on Hover */}
            {item.isAvailable && (
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </div>
            )}
        </div>
    );
}
