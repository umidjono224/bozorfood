import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, Clock, ChefHat, Truck, CheckCircle } from "lucide-react";
import { useOrderStore, Order, OrderStatus } from "@/stores/orderStore";
import { useUserStore } from "@/stores/userStore";

const STATUS_CONFIG: Record<OrderStatus, { label: string; icon: typeof Clock; color: string }> = {
  pending: {
    label: "Qabul qilindi",
    icon: Clock,
    color: "text-warning bg-warning/10",
  },
  preparing: {
    label: "Tayyorlanmoqda",
    icon: ChefHat,
    color: "text-primary bg-primary/10",
  },
  delivering: {
    label: "Yetkazilmoqda",
    icon: Truck,
    color: "text-accent-foreground bg-accent",
  },
  delivered: {
    label: "Yakunlandi",
    icon: CheckCircle,
    color: "text-success bg-success/10",
  },
};

interface OrderCardProps {
  order: Order;
}

function OrderCard({ order }: OrderCardProps) {
  const status = STATUS_CONFIG[order.status];
  const StatusIcon = status.icon;
  const date = new Date(order.createdAt).toLocaleDateString("uz-UZ", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="bg-card rounded-xl p-4 border border-border shadow-card animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-muted-foreground">{date}</span>
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${status.color}`}>
          <StatusIcon className="w-3.5 h-3.5" />
          {status.label}
        </div>
      </div>

      <div className="space-y-2 mb-3">
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

      <div className="pt-3 border-t border-border">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Jami:</span>
          <span className="font-bold text-foreground">
            {order.totalPrice.toLocaleString()} so'm
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">📍 {order.address}</p>
      </div>
    </div>
  );
}

export default function Orders() {
  const navigate = useNavigate();
  const { user } = useUserStore();
  const { getOrdersByPhone } = useOrderStore();
  
  const orders = user?.phone ? getOrdersByPhone(user.phone) : [];
  const sortedOrders = [...orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  if (sortedOrders.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <PageHeader title="Buyurtmalarim" />
        <PageContainer className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Buyurtmalar yo'q
            </h2>
            <p className="text-muted-foreground mb-6">
              Siz hali buyurtma bermagansiz
            </p>
            <Button onClick={() => navigate("/menu")}>
              Taomlar ro'yxatiga o'tish
            </Button>
          </div>
        </PageContainer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <PageHeader title="Buyurtmalarim" />
      
      <PageContainer>
        <div className="space-y-4">
          {sortedOrders.map((order, index) => (
            <div key={order.id} style={{ animationDelay: `${index * 0.1}s` }}>
              <OrderCard order={order} />
            </div>
          ))}
        </div>
      </PageContainer>
    </div>
  );
}
