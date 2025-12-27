import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, Clock, ChefHat, Truck, CheckCircle } from "lucide-react";

// Mock orders data - will be replaced with backend
const MOCK_ORDERS = [
  {
    id: "order_1",
    items: [
      { name: "Osh (Palov)", quantity: 2, price: 35000 },
      { name: "Somsa", quantity: 3, price: 15000 },
    ],
    totalPrice: 115000,
    status: "delivered",
    address: "Toshkent, Chilonzor 7",
    createdAt: "2024-01-15T12:30:00Z",
  },
  {
    id: "order_2",
    items: [
      { name: "Lag'mon", quantity: 1, price: 28000 },
      { name: "Manti", quantity: 1, price: 25000 },
    ],
    totalPrice: 53000,
    status: "preparing",
    address: "Toshkent, Sergeli 5",
    createdAt: "2024-01-15T14:00:00Z",
  },
];

const STATUS_CONFIG = {
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
  order: typeof MOCK_ORDERS[0];
}

function OrderCard({ order }: OrderCardProps) {
  const status = STATUS_CONFIG[order.status as keyof typeof STATUS_CONFIG];
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
  const orders = MOCK_ORDERS; // Will be replaced with real data

  if (orders.length === 0) {
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
          {orders.map((order, index) => (
            <div key={order.id} style={{ animationDelay: `${index * 0.1}s` }}>
              <OrderCard order={order} />
            </div>
          ))}
        </div>
      </PageContainer>
    </div>
  );
}
