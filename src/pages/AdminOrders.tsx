import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { useAdminStore } from "@/stores/adminStore";
import { useToast } from "@/hooks/use-toast";
import { Clock, ChefHat, Truck, CheckCircle, Phone, MapPin } from "lucide-react";

// Mock orders data - will be replaced with backend
const INITIAL_ORDERS = [
  {
    id: "order_1",
    phone: "+998901234567",
    items: [
      { name: "Osh (Palov)", quantity: 2, price: 35000 },
      { name: "Somsa", quantity: 3, price: 15000 },
    ],
    totalPrice: 115000,
    status: "pending",
    address: "Toshkent, Chilonzor 7, 15-uy",
    comment: "Iltimos, ziravorni kam qiling",
    createdAt: "2024-01-15T12:30:00Z",
  },
  {
    id: "order_2",
    phone: "+998909876543",
    items: [
      { name: "Lag'mon", quantity: 1, price: 28000 },
      { name: "Manti", quantity: 1, price: 25000 },
    ],
    totalPrice: 53000,
    status: "preparing",
    address: "Toshkent, Sergeli 5, 42-xonadon",
    createdAt: "2024-01-15T14:00:00Z",
  },
  {
    id: "order_3",
    phone: "+998901112233",
    items: [
      { name: "Shashlik", quantity: 2, price: 45000 },
    ],
    totalPrice: 90000,
    status: "delivering",
    address: "Toshkent, Yunusobod 4",
    createdAt: "2024-01-15T15:30:00Z",
  },
];

type OrderStatus = "pending" | "preparing" | "delivering" | "delivered";

const STATUS_CONFIG: Record<OrderStatus, { label: string; icon: typeof Clock; color: string }> = {
  pending: {
    label: "Qabul qilindi",
    icon: Clock,
    color: "text-warning bg-warning/10 border-warning/30",
  },
  preparing: {
    label: "Tayyorlanmoqda",
    icon: ChefHat,
    color: "text-primary bg-primary/10 border-primary/30",
  },
  delivering: {
    label: "Yetkazilmoqda",
    icon: Truck,
    color: "text-accent-foreground bg-accent border-accent-foreground/30",
  },
  delivered: {
    label: "Yakunlandi",
    icon: CheckCircle,
    color: "text-success bg-success/10 border-success/30",
  },
};

const STATUS_ORDER: OrderStatus[] = ["pending", "preparing", "delivering", "delivered"];

interface Order {
  id: string;
  phone: string;
  items: { name: string; quantity: number; price: number }[];
  totalPrice: number;
  status: OrderStatus;
  address: string;
  comment?: string;
  createdAt: string;
}

export default function AdminOrders() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated } = useAdminStore();
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS as Order[]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/admin", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const updateStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
    toast({
      title: "Yangilandi",
      description: `Holat: ${STATUS_CONFIG[newStatus].label}`,
    });
  };

  const getNextStatus = (current: OrderStatus): OrderStatus | null => {
    const currentIndex = STATUS_ORDER.indexOf(current);
    if (currentIndex < STATUS_ORDER.length - 1) {
      return STATUS_ORDER[currentIndex + 1];
    }
    return null;
  };

  // Sort orders: active first, then by date
  const sortedOrders = [...orders].sort((a, b) => {
    const aActive = a.status !== "delivered";
    const bActive = b.status !== "delivered";
    if (aActive && !bActive) return -1;
    if (!aActive && bActive) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="min-h-screen bg-background">
      <PageHeader title="Buyurtmalar" />
      
      <PageContainer>
        <div className="space-y-4">
          {sortedOrders.map((order) => {
            const status = STATUS_CONFIG[order.status];
            const StatusIcon = status.icon;
            const nextStatus = getNextStatus(order.status);
            const date = new Date(order.createdAt).toLocaleDateString("uz-UZ", {
              day: "numeric",
              month: "short",
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <div
                key={order.id}
                className="bg-card rounded-xl p-4 border border-border shadow-card animate-fade-in"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-muted-foreground">{date}</span>
                  <div
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${status.color}`}
                  >
                    <StatusIcon className="w-3.5 h-3.5" />
                    {status.label}
                  </div>
                </div>

                {/* Contact Info */}
                <div className="flex items-center gap-4 mb-3 text-sm">
                  <a
                    href={`tel:${order.phone}`}
                    className="flex items-center gap-1 text-primary font-medium"
                  >
                    <Phone className="w-4 h-4" />
                    {order.phone}
                  </a>
                </div>

                {/* Items */}
                <div className="space-y-1.5 mb-3">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span className="text-foreground">
                        {item.name} × {item.quantity}
                      </span>
                      <span className="text-muted-foreground">
                        {(item.price * item.quantity).toLocaleString()} so'm
                      </span>
                    </div>
                  ))}
                </div>

                {/* Total & Address */}
                <div className="pt-3 border-t border-border space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Jami:</span>
                    <span className="font-bold text-foreground">
                      {order.totalPrice.toLocaleString()} so'm
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground flex items-start gap-1">
                    <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                    {order.address}
                  </p>
                  {order.comment && (
                    <p className="text-sm text-muted-foreground italic">
                      💬 {order.comment}
                    </p>
                  )}
                </div>

                {/* Action */}
                {nextStatus && (
                  <div className="mt-4">
                    <Button
                      size="sm"
                      className="w-full"
                      onClick={() => updateStatus(order.id, nextStatus)}
                    >
                      {STATUS_CONFIG[nextStatus].label} ga o'tkazish
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {orders.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Buyurtmalar yo'q</p>
          </div>
        )}
      </PageContainer>
    </div>
  );
}
