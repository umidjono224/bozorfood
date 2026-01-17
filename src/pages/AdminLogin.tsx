import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAdminStore } from "@/stores/adminStore";
import { useToast } from "@/hooks/use-toast";
import { User, Lock } from "lucide-react";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login, isAuthenticated } = useAdminStore();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/admin/panel", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  if (isAuthenticated) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 500));

    const success = login(username, password);

    if (success) {
      toast({
        title: "Muvaffaqiyatli",
        description: "Admin paneliga kirish amalga oshirildi",
      });
      navigate("/admin/panel", { replace: true });
    } else {
      toast({
        title: "Xatolik",
        description: "Login yoki parol noto'g'ri",
        variant: "destructive",
      });
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--admin))]">
      <PageHeader title="Kirish" />
      
      <PageContainer className="flex flex-col items-center justify-center min-h-[70vh]">
        <div className="w-full max-w-sm">
          {/* Clean admin login - no hints about admin mode */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-[hsl(var(--admin-accent))] flex items-center justify-center mx-auto mb-4">
              <Lock className="w-7 h-7 text-[hsl(var(--admin-foreground))]" />
            </div>
            <h2 className="text-xl font-bold text-[hsl(var(--admin-foreground))]">Kirish</h2>
            <p className="text-sm text-[hsl(var(--admin-foreground)/0.6)] mt-1">
              Login va parolni kiriting
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[hsl(var(--admin-foreground))] flex items-center gap-2">
                <User className="w-4 h-4 text-[hsl(var(--admin-foreground)/0.6)]" />
                Login
              </label>
              <Input
                type="text"
                placeholder="Login"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="h-12 rounded-xl bg-[hsl(var(--admin-accent))] border-[hsl(var(--admin-muted))] text-[hsl(var(--admin-foreground))] placeholder:text-[hsl(var(--admin-foreground)/0.4)]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-[hsl(var(--admin-foreground))] flex items-center gap-2">
                <Lock className="w-4 h-4 text-[hsl(var(--admin-foreground)/0.6)]" />
                Parol
              </label>
              <Input
                type="password"
                placeholder="Parol"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12 rounded-xl bg-[hsl(var(--admin-accent))] border-[hsl(var(--admin-muted))] text-[hsl(var(--admin-foreground))] placeholder:text-[hsl(var(--admin-foreground)/0.4)]"
              />
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full mt-6 h-14 rounded-xl touch-feedback"
              disabled={isLoading}
            >
              {isLoading ? "Kirish..." : "Kirish"}
            </Button>
          </form>
        </div>
      </PageContainer>
    </div>
  );
}
