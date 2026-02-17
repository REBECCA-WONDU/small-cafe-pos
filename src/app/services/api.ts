'use client';

import { useState, useEffect } from 'react';
import { MenuItem, Order, CreateOrderDto } from '../types';

const API_Base = 'http://localhost:5146/api';

export const getMenu = async (): Promise<MenuItem[]> => {
    try {
        const res = await fetch(`${API_Base}/menu`, { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to fetch menu');
        return res.json();
    } catch (error) {
        console.error(error);
        return [];
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
