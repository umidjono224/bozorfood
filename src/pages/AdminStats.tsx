import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { useAdminStore } from "@/stores/adminStore";
import { useOrderStats } from "@/hooks/useOrders";
import { ShoppingBag, Calendar, TrendingUp, Award, Loader2, CalendarDays } from "lucide-react";
import { format } from "date-fns";

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  subtitle?: string;
  color: string;
}

function StatCard({ icon: Icon, label, value, subtitle, color }: StatCardProps) {
  return (
    <div className="bg-[hsl(var(--admin-accent))] rounded-2xl p-5 border border-[hsl(var(--admin-muted))] shadow-card animate-fade-in">
      <div className="flex items-start justify-between mb-3">
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      <p className="text-sm text-[hsl(var(--admin-foreground)/0.6)] mb-1">{label}</p>
      <p className="text-2xl font-bold text-[hsl(var(--admin-foreground))]">{value}</p>
      {subtitle && (
        <p className="text-xs text-[hsl(var(--admin-foreground)/0.5)] mt-1">{subtitle}</p>
      )}
    </div>
  );
}

export default function AdminStats() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAdminStore();
  const { data: stats, isLoading } = useOrderStats();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/admin", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const monthName = stats?.monthStart 
    ? format(new Date(stats.monthStart), "MMMM yyyy")
    : format(new Date(), "MMMM yyyy");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[hsl(var(--admin))]">
        <PageHeader title="Statistika" />
        <PageContainer className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </PageContainer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[hsl(var(--admin))]">
      <PageHeader title="Statistika" />
      
      <PageContainer>
        {/* All-time stats */}
        <h2 className="text-lg font-semibold text-[hsl(var(--admin-foreground))] mb-3">Umumiy statistika</h2>
        <div className="grid grid-cols-2 gap-4">
          <StatCard
            icon={ShoppingBag}
            label="Jami buyurtmalar"
            value={stats?.totalOrders || 0}
            color="bg-primary/10 text-primary"
          />
          <StatCard
            icon={Calendar}
            label="Bugungi"
            value={stats?.todayOrders || 0}
            subtitle="buyurtma"
            color="bg-accent text-accent-foreground"
          />
          <StatCard
            icon={TrendingUp}
            label="Umumiy daromad"
            value={stats && stats.totalRevenue > 0 ? `${(stats.totalRevenue / 1000).toFixed(0)}K` : "0"}
            subtitle="so'm"
            color="bg-success/10 text-success"
          />
          <StatCard
            icon={Award}
            label="Eng mashhur"
            value={stats?.topFood?.count || 0}
            subtitle={stats?.topFood?.name || "—"}
            color="bg-warning/10 text-warning"
          />
        </div>

        {/* Monthly stats */}
        <h2 className="text-lg font-semibold text-[hsl(var(--admin-foreground))] mt-8 mb-3 flex items-center gap-2">
          <CalendarDays className="w-5 h-5" />
          Oylik statistika
          <span className="text-sm font-normal text-[hsl(var(--admin-foreground)/0.6)]">({monthName})</span>
        </h2>
        <p className="text-xs text-[hsl(var(--admin-foreground)/0.5)] mb-3">
          Har oyning 1-sanasida avtomatik yangilanadi
        </p>
        <div className="grid grid-cols-2 gap-4">
          <StatCard
            icon={ShoppingBag}
            label="Oylik buyurtmalar"
            value={stats?.monthlyOrders || 0}
            color="bg-blue-500/10 text-blue-500"
          />
          <StatCard
            icon={TrendingUp}
            label="Oylik daromad"
            value={stats && stats.monthlyRevenue > 0 ? `${(stats.monthlyRevenue / 1000).toFixed(0)}K` : "0"}
            subtitle="so'm"
            color="bg-emerald-500/10 text-emerald-500"
          />
          <StatCard
            icon={Award}
            label="Oylik mashhur"
            value={stats?.monthlyTopFood?.count || 0}
            subtitle={stats?.monthlyTopFood?.name || "—"}
            color="bg-purple-500/10 text-purple-500"
          />
        </div>

        {stats?.totalOrders === 0 && (
          <div className="mt-8 bg-[hsl(var(--admin-accent))] rounded-2xl p-4">
            <p className="text-sm text-center text-[hsl(var(--admin-foreground)/0.7)]">
              📊 Buyurtmalar kelib tushganda statistika ko'rsatiladi
            </p>
          </div>
        )}
      </PageContainer>
    </div>
  );
}
