import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { useAdminStore } from "@/stores/adminStore";
import { useOrders, useUpdateOrderStatus, OrderStatus } from "@/hooks/useOrders";
import { useToast } from "@/hooks/use-toast";
import { Clock, ChefHat, Truck, CheckCircle, Phone, MapPin, Loader2 } from "lucide-react";

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

export default function AdminOrders() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated } = useAdminStore();
  const { data: orders = [], isLoading } = useOrders();
  const updateStatus = useUpdateOrderStatus();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/admin", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleUpdateStatus = (orderId: string, newStatus: OrderStatus) => {
    updateStatus.mutate(
      { orderId, status: newStatus },
      {
        onSuccess: () => {
          toast({
            title: "Yangilandi",
            description: `Holat: ${STATUS_CONFIG[newStatus].label}`,
          });
        },
      }
    );
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
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[hsl(var(--admin))]">
        <PageHeader title="Buyurtmalar" />
        <PageContainer className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </PageContainer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[hsl(var(--admin))]">
      <PageHeader title="Buyurtmalar" />
      
      <PageContainer>
        <div className="space-y-4">
          {sortedOrders.map((order) => {
            const status = STATUS_CONFIG[order.status];
            const StatusIcon = status.icon;
            const nextStatus = getNextStatus(order.status);
            const date = new Date(order.created_at).toLocaleDateString("uz-UZ", {
              day: "numeric",
              month: "short",
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <div
                key={order.id}
                className="bg-[hsl(var(--admin-accent))] rounded-2xl p-4 border border-[hsl(var(--admin-muted))] shadow-card animate-fade-in"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-[hsl(var(--admin-foreground)/0.6)]">{date}</span>
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

                <div className="space-y-1.5 mb-3">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span className="text-[hsl(var(--admin-foreground))]">
                        {item.name} × {item.quantity}
                      </span>
                      <span className="text-[hsl(var(--admin-foreground)/0.6)]">
                        {(item.price * item.quantity).toLocaleString()} so'm
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-[hsl(var(--admin-muted))] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[hsl(var(--admin-foreground)/0.6)]">Jami:</span>
                    <span className="font-bold text-[hsl(var(--admin-foreground))]">
                      {order.total_price.toLocaleString()} so'm
                    </span>
                  </div>
                  <p className="text-sm text-[hsl(var(--admin-foreground)/0.6)] flex items-start gap-1">
                    <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                    {order.address}
                  </p>
                  {order.comment && (
                    <p className="text-sm text-[hsl(var(--admin-foreground)/0.6)] italic">
                      💬 {order.comment}
                    </p>
                  )}
                </div>

                {nextStatus && (
                  <div className="mt-4">
                    <Button
                      size="sm"
                      className="w-full h-11 rounded-xl touch-feedback"
                      onClick={() => handleUpdateStatus(order.id, nextStatus)}
                      disabled={updateStatus.isPending}
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
            <p className="text-[hsl(var(--admin-foreground)/0.6)]">Buyurtmalar yo'q</p>
          </div>
        )}
      </PageContainer>
    </div>
  );
}
