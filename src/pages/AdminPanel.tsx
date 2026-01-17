import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { useAdminStore } from "@/stores/adminStore";
import { UtensilsCrossed, ShoppingBag, BarChart3, LogOut } from "lucide-react";
import { useEffect } from "react";

export default function AdminPanel() {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAdminStore();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/admin", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/admin", { replace: true });
  };

  const menuItems = [
    {
      icon: UtensilsCrossed,
      label: "Taomlar boshqaruvi",
      description: "Taomlarni qo'shish va tahrirlash",
      path: "/admin/foods",
    },
    {
      icon: ShoppingBag,
      label: "Buyurtmalar",
      description: "Buyurtmalarni ko'rish va boshqarish",
      path: "/admin/orders",
    },
    {
      icon: BarChart3,
      label: "Statistika",
      description: "Savdo statistikasi",
      path: "/admin/stats",
    },
  ];

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[hsl(var(--admin))]">
      <PageHeader title="Boshqaruv" showHome={false} />
      
      <PageContainer>
        <div className="space-y-3 mb-8">
          {menuItems.map((item, index) => (
            <Button
              key={item.path}
              variant="ghost"
              onClick={() => navigate(item.path)}
              className="w-full justify-start h-auto py-4 px-4 rounded-2xl bg-[hsl(var(--admin-accent))] hover:bg-[hsl(var(--admin-muted))] animate-fade-up touch-feedback"
              style={{ animationDelay: `${index * 0.08}s` }}
            >
              <div className="flex items-center gap-4 w-full">
                <div className="p-3 rounded-xl bg-[hsl(var(--admin-muted))]">
                  <item.icon className="w-6 h-6 text-[hsl(var(--admin-foreground))]" />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-semibold text-[hsl(var(--admin-foreground))]">
                    {item.label}
                  </div>
                  <div className="text-sm text-[hsl(var(--admin-foreground)/0.6)]">
                    {item.description}
                  </div>
                </div>
              </div>
            </Button>
          ))}
        </div>

        <Button
          variant="outline"
          size="lg"
          className="w-full h-14 rounded-xl text-destructive border-destructive/30 hover:bg-destructive/10 bg-transparent touch-feedback"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5 mr-2" />
          Chiqish
        </Button>
      </PageContainer>
    </div>
  );
}
