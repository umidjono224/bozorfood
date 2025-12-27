import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/stores/userStore";
import { useCartStore } from "@/stores/cartStore";
import { UtensilsCrossed, ShoppingBag, Phone, Shield, ChefHat } from "lucide-react";

export default function Home() {
  const navigate = useNavigate();
  const { user } = useUserStore();
  const totalItems = useCartStore((state) => state.getTotalItems());

  const menuItems = [
    {
      icon: UtensilsCrossed,
      label: "Taomlar",
      description: "Mazali taomlar ro'yxati",
      path: "/menu",
      color: "text-primary",
    },
    {
      icon: ShoppingBag,
      label: "Buyurtmalarim",
      description: "Buyurtmalar tarixi",
      path: "/orders",
      badge: totalItems > 0 ? totalItems : undefined,
      color: "text-accent-foreground",
    },
    {
      icon: Phone,
      label: "Yordam",
      description: "Bog'lanish uchun",
      path: "/help",
      color: "text-success",
    },
    {
      icon: Shield,
      label: "Admin",
      description: "Boshqaruv paneli",
      path: "/admin",
      color: "text-muted-foreground",
    },
  ];

  return (
    <div className="min-h-screen bg-background safe-top">
      {/* Header */}
      <header className="px-4 pt-8 pb-6">
        <div className="flex items-center gap-4 mb-6 animate-fade-in">
          <div className="w-14 h-14 rounded-full gradient-primary flex items-center justify-center shadow-primary">
            <ChefHat className="w-7 h-7 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Bozorfood</h1>
            <p className="text-muted-foreground text-sm">
              {user?.name ? `Salom, ${user.name}!` : "Xush kelibsiz!"}
            </p>
          </div>
        </div>
      </header>

      {/* Menu */}
      <main className="px-4 pb-8">
        <h2 className="text-lg font-semibold text-foreground mb-4">Asosiy menyu</h2>
        
        <div className="space-y-3">
          {menuItems.map((item, index) => (
            <Button
              key={item.path}
              variant="menu"
              size="menu"
              onClick={() => navigate(item.path)}
              className="animate-fade-up relative"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center gap-4 w-full">
                <div className={`p-3 rounded-xl bg-accent ${item.color}`}>
                  <item.icon className="w-6 h-6" />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-semibold text-foreground">{item.label}</div>
                  <div className="text-sm text-muted-foreground">{item.description}</div>
                </div>
                {item.badge && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full gradient-primary flex items-center justify-center text-xs font-bold text-primary-foreground">
                    {item.badge}
                  </div>
                )}
              </div>
            </Button>
          ))}
        </div>
      </main>

      {/* Footer Notice */}
      <footer className="px-4 pb-8">
        <div className="bg-accent rounded-xl p-4 text-center">
          <p className="text-sm text-accent-foreground font-medium">
            💰 To'lov yetkazib berilganda amalga oshiriladi
          </p>
        </div>
      </footer>
    </div>
  );
}
