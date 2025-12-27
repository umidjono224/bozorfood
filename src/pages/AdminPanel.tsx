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
      color: "text-primary",
    },
    {
      icon: ShoppingBag,
      label: "Buyurtmalar",
      description: "Buyurtmalarni ko'rish va boshqarish",
      path: "/admin/orders",
      color: "text-accent-foreground",
    },
    {
      icon: BarChart3,
      label: "Statistika",
      description: "Savdo statistikasi",
      path: "/admin/stats",
      color: "text-success",
    },
  ];

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <PageHeader title="Admin Panel" showHome={false} />
      
      <PageContainer>
        <div className="space-y-3 mb-8">
          {menuItems.map((item, index) => (
            <Button
              key={item.path}
              variant="menu"
              size="menu"
              onClick={() => navigate(item.path)}
              className="animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center gap-4 w-full">
                <div className={`p-3 rounded-xl bg-accent ${item.color}`}>
                  <item.icon className="w-6 h-6" />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-semibold text-foreground">{item.label}</div>
                  <div className="text-sm text-muted-foreground">
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
          className="w-full text-destructive border-destructive/50 hover:bg-destructive/10"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5 mr-2" />
          Chiqish
        </Button>
      </PageContainer>
    </div>
  );
}
