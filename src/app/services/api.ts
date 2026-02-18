'use client';

import { useState, useEffect } from 'react';
import { MenuItem, Order, CreateOrderDto } from '../types';

const API_Base = 'http://localhost:5146/api';

const SAMPLE_MENU: MenuItem[] = [
    { id: 1, name: "Gourmet Beef Burger", description: "Juicy prime beef patty with truffle mayo, caramelised onions, and melted aged cheddar.", price: 12.50, category: "Foods", imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800&auto=format&fit=crop", isAvailable: true },
    { id: 2, name: "Iced Caramel Macchiato", description: "Freshly pulled espresso with creamy milk and rich buttery caramel sauce over ice.", price: 4.80, category: "Drinks", imageUrl: "https://images.unsplash.com/photo-1558024920-b41e18820790?q=80&w=800&auto=format&fit=crop", isAvailable: true },
    { id: 3, name: "Avocado Sourdough Toast", description: "Smashed Hass avocado, chilli flakes, pumpkin seeds and two poached organic eggs.", price: 10.20, category: "Foods", imageUrl: "https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=800&auto=format&fit=crop", isAvailable: true },
    { id: 4, name: "Tropical Dragonfruit Bowl", description: "Pitaya base topped with granola, chia seeds, fresh blueberries and raw honey.", price: 9.50, category: "Foods", imageUrl: "https://images.unsplash.com/photo-1590301157890-4810ed352733?q=80&w=800&auto=format&fit=crop", isAvailable: true },
    { id: 5, name: "Signature Hot Chocolate", description: "70% Dark Belgian chocolate melted into silky textured milk with toasted marshmallows.", price: 5.20, category: "Drinks", imageUrl: "https://images.unsplash.com/photo-1544781477-b62f4fd932bc?q=80&w=800&auto=format&fit=crop", isAvailable: true },
    { id: 6, name: "Crispy Korean Chicken", description: "Twice-fried chicken wings glazed in a spicy-sweet gochujang sauce with sesame.", price: 11.00, category: "Foods", imageUrl: "https://images.unsplash.com/photo-1527477396000-e27163b481c2?q=80&w=800&auto=format&fit=crop", isAvailable: false },
];

export const getMenu = async (): Promise<MenuItem[]> => {
    try {
        const res = await fetch(`${API_Base}/menu`, { cache: 'no-store' });
        if (res.ok) {
            const data = await res.json();
            // If you have items, show them! If empty, then show samples.
            return data.length > 0 ? data : SAMPLE_MENU;
        }
        return SAMPLE_MENU;
    } catch (error) {
        // This usually happens on Vercel because it can't talk to your Localhost PC
        console.warn("Backend not found at localhost:5146. Showing sample menu for preview.");
        return SAMPLE_MENU;
    }
};

export const createMenuItem = async (item: Omit<MenuItem, "id">): Promise<MenuItem | null> => {
    try {
        const res = await fetch(`${API_Base}/menu`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item),
        });
        if (!res.ok) throw new Error('Failed to create menu item');
        return res.json();
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const updateMenuItem = async (id: number, item: MenuItem): Promise<boolean> => {
    try {
        const res = await fetch(`${API_Base}/menu/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item),
        });
        return res.ok;
    } catch (error) {
        console.error(error);
        return false;
    }
};

export const deleteMenuItem = async (id: number): Promise<boolean> => {
    try {
        const res = await fetch(`${API_Base}/menu/${id}`, {
            method: 'DELETE',
        });
        return res.ok;
    } catch (error) {
        console.error(error);
        return false;
    }
};

export const getOrders = async (): Promise<Order[]> => {
    try {
        const res = await fetch(`${API_Base}/order`, { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to fetch orders');
        return res.json();
    } catch (error) {
        console.error(error);
        return [];
    }
};

export const createOrder = async (order: CreateOrderDto): Promise<Order | null> => {
    try {
        console.log('Creating order:', order);
        const res = await fetch(`${API_Base}/order`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(order),
        });
        if (!res.ok) {
            const errorText = await res.text();
            console.error('Order creation failed:', res.status, errorText);
            throw new Error(`Failed to create order: ${res.status} - ${errorText}`);
        }
        const result = await res.json();
        console.log('Order created successfully:', result);
        return result;
    } catch (error) {
        console.error('Error creating order:', error);
        return null;
    }
};

export const updateOrderStatus = async (id: number, status: string): Promise<boolean> => {
    try {
        const res = await fetch(`${API_Base}/order/${id}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(status),
        });
        return res.ok;
    } catch (error) {
        console.error(error);
        return false;
    }
};

export const getDailyRevenue = async (): Promise<number> => {
    try {
        const res = await fetch(`${API_Base}/order/revenue`);
        if (!res.ok) throw new Error('Failed to fetch revenue');
        return res.json();
    } catch (error) {
        console.error(error);
        return 0;
    }
}

export const getActiveOrder = async (tableNumber: string): Promise<Order | null> => {
    try {
        const res = await fetch(`${API_Base}/order/table/${tableNumber}/active`);
        if (res.status === 404) return null;
        if (!res.ok) throw new Error('Failed to fetch active order');
        return res.json();
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const addItemsToOrder = async (orderId: number, items: any[]): Promise<Order | null> => {
    try {
        const res = await fetch(`${API_Base}/order/${orderId}/items`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(items),
        });
        if (!res.ok) throw new Error('Failed to add items to order');
        return res.json();
    } catch (error) {
        console.error(error);
        return null;
    }
};
