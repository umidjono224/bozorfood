import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { useAdminStore } from "@/stores/adminStore";
import { ShoppingBag, Calendar, TrendingUp, Award } from "lucide-react";

// Mock stats - will be replaced with backend
const MOCK_STATS = {
  totalOrders: 156,
  todayOrders: 12,
  totalRevenue: 15680000,
  topFood: {
    name: "Osh (Palov)",
    count: 89,
  },
};

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  subtitle?: string;
  color: string;
}

function StatCard({ icon: Icon, label, value, subtitle, color }: StatCardProps) {
  return (
    <div className="bg-card rounded-xl p-5 border border-border shadow-card animate-fade-in">
      <div className="flex items-start justify-between mb-3">
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      <p className="text-sm text-muted-foreground mb-1">{label}</p>
      <p className="text-2xl font-bold text-foreground">{value}</p>
      {subtitle && (
        <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
      )}
    </div>
  );
}

export default function AdminStats() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAdminStore();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/admin", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const stats = MOCK_STATS;

  return (
    <div className="min-h-screen bg-background">
      <PageHeader title="Statistika" />
      
      <PageContainer>
        <div className="grid grid-cols-2 gap-4">
          <StatCard
            icon={ShoppingBag}
            label="Jami buyurtmalar"
            value={stats.totalOrders}
            color="bg-primary/10 text-primary"
          />
          <StatCard
            icon={Calendar}
            label="Bugungi"
            value={stats.todayOrders}
            subtitle="buyurtma"
            color="bg-accent text-accent-foreground"
          />
          <StatCard
            icon={TrendingUp}
            label="Umumiy daromad"
            value={`${(stats.totalRevenue / 1000000).toFixed(1)}M`}
            subtitle="so'm"
            color="bg-success/10 text-success"
          />
          <StatCard
            icon={Award}
            label="Eng mashhur"
            value={stats.topFood.count}
            subtitle={stats.topFood.name}
            color="bg-warning/10 text-warning"
          />
        </div>

        {/* Info */}
        <div className="mt-8 bg-accent rounded-xl p-4">
          <p className="text-sm text-center text-accent-foreground">
            📊 Statistika har kuni yangilanadi
          </p>
        </div>
      </PageContainer>
    </div>
  );
}
