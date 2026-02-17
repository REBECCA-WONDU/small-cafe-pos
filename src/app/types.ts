export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
  isAvailable?: boolean;
}

export interface OrderItem {
  id: number;
  menuItemId: number;
  menuItemName: string;
  price: number;
  quantity: number;
  specialInstructions?: string;
}

export interface Order {
  id: number;
  tableNumber?: string;
  orderDate: string;
  totalPrice: number;
  status: string;
  orderItems: OrderItem[];
  notes?: string;
}

export interface CreateOrderDto {
  tableNumber: string;
  items: {
    menuItemId: number;
    quantity: number;
    specialInstructions?: string;
  }[];
  notes?: string;
}
