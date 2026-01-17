import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/stores/userStore";
import { useCartStore } from "@/stores/cartStore";
import { UtensilsCrossed, ShoppingBag, Phone, Shield } from "lucide-react";

export default function Home() {
  const navigate = useNavigate();
  const { user } = useUserStore();
  const totalItems = useCartStore((state) => state.getTotalItems());

  // User-facing menu items (Admin is separate)
  const menuItems = [
    {
      icon: UtensilsCrossed,
      label: "Taomlar",
      description: "Mazali taomlar ro'yxati",
      path: "/menu",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      icon: ShoppingBag,
      label: "Buyurtmalarim",
      description: "Buyurtmalar tarixi",
      path: "/orders",
      badge: totalItems > 0 ? totalItems : undefined,
      color: "text-accent-foreground",
      bgColor: "bg-accent",
    },
    {
      icon: Phone,
      label: "Yordam",
      description: "Bog'lanish uchun",
      path: "/help",
      color: "text-success",
      bgColor: "bg-success/10",
    },
  ];

  return (
    <div className="min-h-screen bg-background safe-top flex flex-col">
      {/* Header - Compact for more content space */}
      <header className="px-5 pt-6 pb-4">
        <div className="flex items-center gap-4 animate-fade-in">
          <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center shadow-primary">
            <span className="text-2xl font-bold text-primary-foreground">O</span>
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Orzubek777</h1>
            <p className="text-muted-foreground text-sm mt-0.5">
              {user?.name ? `Salom, ${user.name}!` : "Xush kelibsiz!"}
            </p>
          </div>
        </div>
      </header>

      {/* Main Menu - Optimized for thumb reach */}
      <main className="flex-1 px-5 pb-6">
        <h2 className="text-base font-semibold text-muted-foreground mb-4 uppercase tracking-wide">
          Asosiy menyu
        </h2>
        
        {/* Main menu cards with increased vertical spacing */}
        <div className="space-y-4">
          {menuItems.map((item, index) => (
            <Button
              key={item.path}
              variant="menu"
              size="menu"
              onClick={() => navigate(item.path)}
              className="animate-fade-up relative min-h-[80px] rounded-2xl touch-feedback"
              style={{ animationDelay: `${index * 0.08}s` }}
            >
              <div className="flex items-center gap-4 w-full py-1">
                <div className={`p-3.5 rounded-xl ${item.bgColor} ${item.color}`}>
                  <item.icon className="w-6 h-6" />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-semibold text-foreground text-base">{item.label}</div>
                  <div className="text-sm text-muted-foreground mt-0.5">{item.description}</div>
                </div>
                {item.badge && (
                  <div className="w-7 h-7 rounded-full gradient-primary flex items-center justify-center text-xs font-bold text-primary-foreground shadow-primary">
                    {item.badge}
                  </div>
                )}
              </div>
            </Button>
          ))}
        </div>

        {/* Admin access - Visually separated with neutral styling */}
        <div className="mt-8 pt-6 border-t border-border/50">
          <Button
            variant="ghost"
            size="menu"
            onClick={() => navigate("/admin")}
            className="animate-fade-up w-full min-h-[64px] rounded-xl bg-muted/30 hover:bg-muted/50 touch-feedback"
            style={{ animationDelay: "0.3s" }}
          >
            <div className="flex items-center gap-4 w-full">
              <div className="p-3 rounded-lg bg-muted">
                <Shield className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="flex-1 text-left">
                <div className="font-medium text-muted-foreground text-sm">Admin</div>
              </div>
            </div>
          </Button>
        </div>
      </main>
    </div>
  );
}
