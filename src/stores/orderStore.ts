import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type OrderStatus = 'pending' | 'preparing' | 'delivering' | 'delivered';

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

export interface Order {
  id: string;
  phone: string;
  items: OrderItem[];
  totalPrice: number;
  status: OrderStatus;
  address: string;
  comment?: string;
  createdAt: string;
}

interface OrderStore {
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'status' | 'createdAt'>) => string;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  getOrdersByPhone: (phone: string) => Order[];
  getStats: () => {
    totalOrders: number;
    todayOrders: number;
    totalRevenue: number;
    topFood: { name: string; count: number } | null;
  };
}

export const useOrderStore = create<OrderStore>()(
  persist(
    (set, get) => ({
      orders: [],
      
      addOrder: (orderData) => {
        const id = `order_${Date.now()}`;
        const newOrder: Order = {
          ...orderData,
          id,
          status: 'pending',
          createdAt: new Date().toISOString(),
        };
        set({ orders: [...get().orders, newOrder] });
        return id;
      },
      
      updateOrderStatus: (orderId, status) => {
        set({
          orders: get().orders.map((order) =>
            order.id === orderId ? { ...order, status } : order
          ),
        });
      },
      
      getOrdersByPhone: (phone) => {
        return get().orders.filter((order) => order.phone === phone);
      },
      
      getStats: () => {
        const orders = get().orders;
        const today = new Date().toDateString();
        
        const todayOrders = orders.filter(
          (order) => new Date(order.createdAt).toDateString() === today
        ).length;
        
        const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);
        
        // Calculate top food
        const foodCounts: Record<string, number> = {};
        orders.forEach((order) => {
          order.items.forEach((item) => {
            foodCounts[item.name] = (foodCounts[item.name] || 0) + item.quantity;
          });
        });
        
        let topFood: { name: string; count: number } | null = null;
        Object.entries(foodCounts).forEach(([name, count]) => {
          if (!topFood || count > topFood.count) {
            topFood = { name, count };
          }
        });
        
        return {
          totalOrders: orders.length,
          todayOrders,
          totalRevenue,
          topFood,
        };
      },
    }),
    {
      name: 'bozorfood-orders',
    }
  )
);
