import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUserStore } from "@/stores/userStore";
import { Phone, User, ChefHat } from "lucide-react";

export default function Register() {
  const navigate = useNavigate();
  const { setUser } = useUserStore();
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Basic phone validation for Uzbekistan numbers
    const cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.length < 9) {
      setError("Telefon raqamni to'liq kiriting");
      return;
    }

    // Generate a simple ID
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    setUser({
      id: userId,
      phone: cleanPhone,
      name: name.trim() || undefined,
    });

    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        {/* Logo */}
        <div className="mb-8 animate-fade-in">
          <div className="w-24 h-24 rounded-full gradient-primary flex items-center justify-center shadow-primary">
            <ChefHat className="w-12 h-12 text-primary-foreground" />
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-10 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <h1 className="text-3xl font-bold text-foreground mb-2">Bozorfood</h1>
          <p className="text-muted-foreground">Mazali taomlar yetkazib berish</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4 animate-fade-up" style={{ animationDelay: "0.2s" }}>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <Phone className="w-4 h-4 text-primary" />
              Telefon raqam *
            </label>
            <Input
              type="tel"
              placeholder="+998 90 123 45 67"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <User className="w-4 h-4 text-primary" />
              Ismingiz (ixtiyoriy)
            </label>
            <Input
              type="text"
              placeholder="Ismingizni kiriting"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="text-lg"
            />
          </div>

          {error && (
            <p className="text-destructive text-sm text-center">{error}</p>
          )}

          <Button type="submit" size="lg" className="w-full mt-6">
            Davom etish
          </Button>
        </form>
      </div>

      {/* Footer */}
      <div className="text-center pb-8 text-sm text-muted-foreground">
        <p>© 2024 Bozorfood</p>
      </div>
    </div>
  );
}
