// @ts-nocheck
'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { MenuItem, OrderItem, CreateOrderDto } from './types';
import { getMenu, createOrder, getActiveOrder, addItemsToOrder } from './services/api';
import MenuGrid from './components/MenuGrid';
import Cart from './components/Cart';
import { ChefHat, LayoutDashboard, Monitor, Coffee, UtensilsCrossed, AlertCircle } from 'lucide-react';

export default function Home() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [cartItems, setCartItems] = useState<OrderItem[]>([]);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Category State
  const [mainCategory, setMainCategory] = useState<'Food' | 'Drinks'>('Food');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('All');

  useEffect(() => {
    setLoading(true);
    getMenu()
      .then(items => {
        setMenuItems(items);
        setError(null);
      })
      .catch(err => {
        console.error("Failed to load menu", err);
        setError("Could not connect to the server. Please ensure the backend is running.");
      })
      .finally(() => setLoading(false));
  }, []);

  // Monitor cart changes
  useEffect(() => {
    console.log('🛒 Cart state changed! Items count:', cartItems.length, 'Items:', cartItems);
  }, [cartItems]);

  const addToCart = (item: MenuItem, quantity: number, notes: string = '') => {
    console.log('Adding to cart:', item.name, 'Qty:', quantity, 'Price:', item.price);
    const newItem: OrderItem = {
      id: Date.now(), // Temporary ID for frontend
      menuItemId: item.id,
      menuItemName: item.name,
      price: item.price,
      quantity,
      specialInstructions: notes
    };
    const updatedCart = [...cartItems, newItem];
    console.log('Updated cart:', updatedCart);
    setCartItems(updatedCart);
    showToast(`Added ${quantity} x ${item.name} to cart`, 'success');
  };

  const removeFromCart = (index: number) => {
    console.log('Removing item at index:', index);
    const newCart = [...cartItems];
    newCart.splice(index, 1);
    console.log('Cart after removal:', newCart);
    setCartItems(newCart);
  };

  const submitOrder = async (tableNumber: string, notes: string) => {
    if (cartItems.length === 0) return;

    console.log('Submitting order for table:', tableNumber, 'with', cartItems.length, 'items');

    try {
      const orderItemsDto = cartItems.map(i => ({
        menuItemId: i.menuItemId,
        quantity: i.quantity,
        specialInstructions: i.specialInstructions
      }));

      console.log('Order items:', orderItemsDto);

      // Check for active order
      const activeOrder = await getActiveOrder(tableNumber);
      console.log('Active order check:', activeOrder);

      let result;
      if (activeOrder) {
        // Update existing order
        console.log('Updating existing order:', activeOrder.id);
        result = await addItemsToOrder(activeOrder.id, orderItemsDto);
        if (result) {
          showToast(`Updated Order #${activeOrder.id} for Table ${tableNumber}`, 'success');
        }
      } else {
        // Create new order
        const orderDto: CreateOrderDto = {
          tableNumber,
          items: orderItemsDto,
          notes
        };
        console.log('Creating new order:', orderDto);
        result = await createOrder(orderDto);
        console.log('Create order result:', result);
        if (result) {
          showToast(`New Order placed for Table ${tableNumber}`, 'success');
        }
      }

      if (result) {
        console.log('Order successful, clearing cart');
        setCartItems([]);
      } else {
        console.error('Order failed: no result returned');
        showToast('Failed to process order. Please try again.', 'error');
      }

    } catch (err) {
      console.error('Order submission error:', err);
      showToast('An unexpected error occurred.', 'error');
    }
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // --- Category Logic ---
  // Define keywords or exact matches for your logic
  const DRINK_KEYWORDS = [
    'drink', 'coffee', 'beverage', 'tea', 'juice', 'soda', 'water',
    'ale', 'wine', 'beer', 'liquor', 'alcohol', 'cocktail', 'mocktail',
    'shake', 'smoothie', 'latte', 'espresso', 'cappuccino', 'macchiato',
    'mocha', 'milk', 'cider', 'lemonade', 'ice'
  ];

  const filteredItems = useMemo(() => {
    return menuItems.filter(item => {
      const cat = item.category.toLowerCase();
      const isDrink = DRINK_KEYWORDS.some(k => cat.includes(k));

      // Filter by Main Category (Food vs Drink)
      if (mainCategory === 'Drinks' && !isDrink) return false;
      if (mainCategory === 'Food' && isDrink) return false;

      return true;
    });
  }, [menuItems, mainCategory]); // Removed selectedSubCategory dependency

  const availableSubCategories = useMemo(() => {
    const categories = new Set<string>();
    menuItems.forEach(item => {
      const cat = item.category.toLowerCase();
      const isDrink = DRINK_KEYWORDS.some(k => cat.includes(k));

      if (mainCategory === 'Food' && !isDrink) {
        categories.add(item.category);
      } else if (mainCategory === 'Drinks' && isDrink) {
        categories.add(item.category);
      }
    });
    return Array.from(categories);
  }, [menuItems, mainCategory]);

  const scrollToCategory = (category: string) => {
    const element = document.getElementById(`category-${category}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setSelectedSubCategory(category);
    }
  };


  return (
    <div className="min-h-screen bg-zinc-50/50 font-sans text-zinc-900 selection:bg-emerald-100 selection:text-emerald-900">
      <nav className="bg-white/80 backdrop-blur-md border-b border-zinc-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="bg-gradient-to-tr from-emerald-600 to-teal-500 p-2.5 rounded-xl shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-shadow">
                <ChefHat className="text-white" size={24} />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-zinc-900 to-zinc-600 bg-clip-text text-transparent">
                5-Star Menu
              </h1>
            </div>

            <div className="hidden md:flex space-x-2">
              <Link href="/kitchen" className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 px-4 py-2 rounded-lg transition-all font-medium">
                <Monitor size={18} />
                <span>Kitchen Display</span>
              </Link>
              <Link href="/manager" className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 px-4 py-2 rounded-lg transition-all font-medium">
                <LayoutDashboard size={18} />
                <span>Manager</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3 space-y-6">
            <header className="mb-4">
              {error ? (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 text-red-700 animate-in fade-in slide-in-from-top-2">
                  <AlertCircle size={24} />
                  <div>
                    <h3 className="font-bold">Connection Error</h3>
                    <p className="text-sm">{error}</p>
                  </div>
                </div>
              ) : (
                <>
                  <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight mb-6">Menu</h1>

                  {/* Main Category Tabs (Food vs Drinks) */}
                  <div className="flex p-1 bg-zinc-100 rounded-xl mb-6 w-full md:w-fit">
                    <button
                      onClick={() => { setMainCategory('Food'); setSelectedSubCategory('All'); }}
                      className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg font-bold text-sm transition-all duration-200 ${mainCategory === 'Food'
                        ? 'bg-white text-emerald-700 shadow-sm'
                        : 'text-zinc-500 hover:text-zinc-700'
                        }`}
                    >
                      <UtensilsCrossed size={18} />
                      <span>Foods</span>
                    </button>
                    <button
                      onClick={() => { setMainCategory('Drinks'); setSelectedSubCategory('All'); }}
                      className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg font-bold text-sm transition-all duration-200 ${mainCategory === 'Drinks'
                        ? 'bg-white text-indigo-700 shadow-sm'
                        : 'text-zinc-500 hover:text-zinc-700'
                        }`}
                    >
                      <Coffee size={18} />
                      <span>Drinks</span>
                    </button>
                  </div>

                  {/* Sub Category Pills */}
                  {availableSubCategories.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6 animate-in slide-in-from-left-4 duration-300">
                      <button
                        onClick={() => setSelectedSubCategory('All')}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${selectedSubCategory === 'All'
                          ? 'bg-zinc-800 text-white border-zinc-800'
                          : 'bg-white text-zinc-600 border-zinc-200 hover:border-emerald-500 hover:text-emerald-600'
                          }`}
                      >
                        All {mainCategory}
                      </button>
                      {availableSubCategories.map(cat => (
                        <button
                          key={cat}
                          onClick={() => scrollToCategory(cat)}
                          className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${selectedSubCategory === cat
                            ? 'bg-zinc-800 text-white border-zinc-800'
                            : 'bg-white text-zinc-600 border-zinc-200 hover:border-emerald-500 hover:text-emerald-600'
                            }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </header>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-80 bg-zinc-100 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : (
              <MenuGrid items={filteredItems} onAddToCart={addToCart} />
            )}
          </div>

          <div className="lg:w-1/3 min-w-[350px]">
            <Cart
              items={cartItems}
              onRemove={removeFromCart}
              onSubmit={submitOrder}
            />
          </div>
        </div>
      </main>

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-6 right-6 px-6 py-4 rounded-xl shadow-2xl text-white transform transition-all duration-500 hover:scale-105 cursor-pointer ${toast.type === 'success'
          ? 'bg-gradient-to-r from-emerald-600 to-teal-600'
          : 'bg-gradient-to-r from-red-600 to-rose-600'
          } z-50 flex items-center gap-3`}>
          <div className="bg-white/20 p-1 rounded-full">
            {toast.type === 'success' ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            )}
          </div>
          <span className="font-semibold">{toast.message}</span>
        </div>
      )}
    </div>
  );
}
