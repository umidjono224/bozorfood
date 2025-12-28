import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
  total_price: number;
  status: OrderStatus;
  address: string;
  comment: string | null;
  created_at: string;
}

// Helper to transform database row to Order type
function transformOrder(row: {
  id: string;
  phone: string;
  items: unknown;
  total_price: number;
  status: string;
  address: string;
  comment: string | null;
  created_at: string;
}): Order {
  return {
    ...row,
    items: row.items as OrderItem[],
    status: row.status as OrderStatus,
  };
}

export function useOrders() {
  return useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return (data || []).map(transformOrder);
    },
  });
}

export function useOrdersByPhone(phone: string | undefined) {
  return useQuery({
    queryKey: ['orders', 'phone', phone],
    queryFn: async () => {
      if (!phone) return [];
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('phone', phone)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return (data || []).map(transformOrder);
    },
    enabled: !!phone,
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (orderData: {
      phone: string;
      items: OrderItem[];
      total_price: number;
      address: string;
      comment?: string;
    }) => {
      const insertData = {
        phone: orderData.phone,
        items: JSON.parse(JSON.stringify(orderData.items)),
        total_price: orderData.total_price,
        address: orderData.address,
        comment: orderData.comment || null,
      };
      
      const { data, error } = await supabase
        .from('orders')
        .insert(insertData)
        .select()
        .single();
      
      if (error) throw error;
      return transformOrder(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast({
        title: "Buyurtma qabul qilindi!",
        description: "Tez orada siz bilan bog'lanamiz",
      });
    },
    onError: () => {
      toast({
        title: "Xatolik",
        description: "Buyurtmani yuborishda xatolik yuz berdi",
        variant: "destructive",
      });
    },
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: OrderStatus }) => {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
    onError: () => {
      toast({
        title: "Xatolik",
        description: "Holatni yangilashda xatolik yuz berdi",
        variant: "destructive",
      });
    },
  });
}

export function useOrderStats() {
  return useQuery({
    queryKey: ['orders', 'stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*');
      
      if (error) throw error;
      
      const orders = (data || []).map(transformOrder);
      const today = new Date().toDateString();
      
      const todayOrders = orders.filter(
        (order) => new Date(order.created_at).toDateString() === today
      ).length;
      
      const totalRevenue = orders.reduce((sum, order) => sum + order.total_price, 0);
      
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
  });
}
