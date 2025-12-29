import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAdminStore } from "@/stores/adminStore";
import { useToast } from "@/hooks/use-toast";
import { Shield, User, Lock } from "lucide-react";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login, isAuthenticated } = useAdminStore();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already authenticated - use useEffect to avoid render-time navigation
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/admin/panel", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Show nothing while redirecting
  if (isAuthenticated) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API delay
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
    <div className="min-h-screen bg-background">
      <PageHeader title="Admin" />
      
      <PageContainer className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-bold text-foreground">Admin kirish</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Login va parolni kiriting
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                Login
              </label>
              <Input
                type="text"
                placeholder="Login"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <Lock className="w-4 h-4 text-muted-foreground" />
                Parol
              </label>
              <Input
                type="password"
                placeholder="Parol"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full mt-6"
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
