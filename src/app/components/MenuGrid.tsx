'use client';

import { MenuItem } from '../types';
import MenuCard from './MenuCard';

export default function MenuGrid({
    items,
    onAddToCart,
}: {
    items: MenuItem[];
    onAddToCart: (item: MenuItem, quantity: number, notes: string) => void;
}) {
    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-zinc-50 rounded-3xl border-2 border-dashed border-zinc-200">
                <div className="text-6xl mb-4">🥗</div>
                <h3 className="text-xl font-bold text-zinc-900">No Menu Items Yet</h3>
                <p className="text-zinc-500 mt-2">Start by adding some delicious items to your menu.</p>
            </div>
        );
    }

    // Group items by Category
    const groupedItems = items.reduce((acc, item) => {
        if (!acc[item.category]) {
            acc[item.category] = [];
        }
        acc[item.category].push(item);
        return acc;
    }, {} as Record<string, MenuItem[]>);

    return (
        <div className="space-y-12">
            {Object.entries(groupedItems).map(([category, categoryItems]) => (
                <div key={category} className="scroll-mt-24" id={`category-${category}`}>
                    <div className="flex items-center gap-4 mb-6">
                        <h2 className="text-2xl font-bold text-zinc-800">{category}</h2>
                        <div className="h-px bg-zinc-200 flex-1"></div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {categoryItems.map((item) => (
                            <MenuCard
                                key={item.id}
                                item={item}
                                onAdd={onAddToCart}
                            />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
