import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCartStore } from "@/stores/cartStore";
import { useUserStore } from "@/stores/userStore";
import { useOrderStore } from "@/stores/orderStore";
import { useToast } from "@/hooks/use-toast";
import { MapPin, MessageSquare, Minus, Plus, Trash2, AlertCircle } from "lucide-react";

export default function Checkout() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useUserStore();
  const { items, updateQuantity, removeItem, clearCart, getTotalPrice } = useCartStore();
  const { addOrder } = useOrderStore();
  const [address, setAddress] = useState("");
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalPrice = getTotalPrice();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!address.trim()) {
      toast({
        title: "Xatolik",
        description: "Yetkazib berish manzilini kiriting",
        variant: "destructive",
      });
      return;
    }

    if (items.length === 0) {
      toast({
        title: "Xatolik",
        description: "Savatcha bo'sh",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      addOrder({
        phone: user?.phone || "",
        items: items.map((item) => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          image: item.image,
        })),
        totalPrice,
        address: address.trim(),
        comment: comment.trim() || undefined,
      });

      clearCart();

      toast({
        title: "Buyurtma qabul qilindi!",
        description: "Tez orada siz bilan bog'lanamiz",
      });

      navigate("/orders");
    } catch (error) {
      toast({
        title: "Xatolik",
        description: "Buyurtmani yuborishda xatolik yuz berdi",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <PageHeader title="Buyurtma" />
        <PageContainer className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">Savatcha bo'sh</h2>
            <p className="text-muted-foreground mb-6">Avval taom tanlang</p>
            <Button onClick={() => navigate("/menu")}>
              Taomlar ro'yxatiga o'tish
            </Button>
          </div>
        </PageContainer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-32">
      <PageHeader title="Buyurtma" />
      
      <PageContainer>
        {/* Cart Items */}
        <div className="space-y-3 mb-6">
          <h2 className="font-semibold text-foreground">Tanlangan taomlar</h2>
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 bg-card rounded-xl p-3 border border-border"
            >
              {item.image && (
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-foreground truncate">{item.name}</h3>
                <p className="text-sm text-primary font-semibold">
                  {item.price.toLocaleString()} so'm
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="icon"
                  variant="outline"
                  className="h-8 w-8"
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                >
                  <Minus className="w-3 h-3" />
                </Button>
                <span className="w-6 text-center font-semibold">{item.quantity}</span>
                <Button
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                >
                  <Plus className="w-3 h-3" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-destructive"
                  onClick={() => removeItem(item.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              Yetkazib berish manzili *
            </label>
            <Input
              placeholder="Manzilni kiriting"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-primary" />
              Izoh (ixtiyoriy)
            </label>
            <Textarea
              placeholder="Qo'shimcha izoh..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
            />
          </div>

          {/* Phone Display */}
          <div className="bg-secondary rounded-xl p-4">
            <p className="text-sm text-muted-foreground">Telefon raqam</p>
            <p className="font-semibold text-foreground">{user?.phone}</p>
          </div>

          {/* Payment Notice */}
          <div className="bg-accent rounded-xl p-4 border-2 border-primary/20">
            <p className="text-center text-accent-foreground font-medium">
              💰 To'lov yetkazib berilganda amalga oshiriladi
            </p>
          </div>
        </form>
      </PageContainer>

      {/* Fixed Bottom */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur-sm border-t border-border safe-bottom">
        <div className="flex items-center justify-between mb-3">
          <span className="text-muted-foreground">Jami:</span>
          <span className="text-xl font-bold text-foreground">
            {totalPrice.toLocaleString()} so'm
          </span>
        </div>
        <Button
          size="lg"
          className="w-full"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Yuborilmoqda..." : "Buyurtmani tasdiqlash"}
        </Button>
      </div>
    </div>
  );
}
