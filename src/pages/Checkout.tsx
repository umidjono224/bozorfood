import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCartStore } from "@/stores/cartStore";
import { useUserStore } from "@/stores/userStore";
import { useCreateOrder } from "@/hooks/useOrders";
import { MapPin, MessageSquare, Minus, Plus, Trash2, AlertCircle, Banknote } from "lucide-react";

export default function Checkout() {
  const navigate = useNavigate();
  const { user } = useUserStore();
  const { items, updateQuantity, removeItem, clearCart, getTotalPrice } = useCartStore();
  const createOrder = useCreateOrder();
  const [address, setAddress] = useState("");
  const [comment, setComment] = useState("");
  const [animatingItem, setAnimatingItem] = useState<string | null>(null);

  const totalPrice = getTotalPrice();

  const handleQuantityChange = (id: string, newQuantity: number) => {
    setAnimatingItem(id);
    updateQuantity(id, newQuantity);
    setTimeout(() => setAnimatingItem(null), 200);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!address.trim()) {
      return;
    }

    if (items.length === 0) {
      return;
    }

    createOrder.mutate(
      {
        phone: user?.phone || "",
        items: items.map((item) => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          image: item.image,
        })),
        total_price: totalPrice,
        address: address.trim(),
        comment: comment.trim() || undefined,
      },
      {
        onSuccess: () => {
          clearCart();
          navigate("/orders");
        },
      }
    );
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <PageHeader title="Buyurtma" />
        <PageContainer className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="text-center px-6">
            <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-5">
              <AlertCircle className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">Savatcha bo'sh</h2>
            <p className="text-muted-foreground mb-8">Avval taom tanlang</p>
            <Button 
              onClick={() => navigate("/menu")}
              className="h-12 px-6 rounded-xl touch-feedback"
            >
              Taomlar ro'yxatiga o'tish
            </Button>
          </div>
        </PageContainer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-36">
      <PageHeader title="Buyurtma" />
      
      <PageContainer className="px-4">
        {/* Cart Items - Compact with thumb-friendly controls */}
        <div className="space-y-3 mb-6">
          <h2 className="font-semibold text-foreground text-base">Tanlangan taomlar</h2>
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 bg-card rounded-2xl p-3 border border-border"
            >
              {item.image && (
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-foreground text-sm leading-tight truncate">
                  {item.name}
                </h3>
                <p className="text-sm text-primary font-semibold mt-1">
                  {item.price.toLocaleString()} so'm
                </p>
              </div>
              
              {/* Quantity controls - pushed right for thumb access */}
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <Button
                  size="icon"
                  variant="outline"
                  className="h-10 w-10 rounded-xl touch-feedback"
                  onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span 
                  className={`w-7 text-center font-semibold tabular-nums ${
                    animatingItem === item.id ? 'quantity-pop' : ''
                  }`}
                >
                  {item.quantity}
                </span>
                <Button
                  size="icon"
                  className="h-10 w-10 rounded-xl touch-feedback"
                  onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                >
                  <Plus className="w-4 h-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-10 w-10 rounded-xl text-destructive hover:bg-destructive/10 touch-feedback ml-1"
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
              className="h-12 rounded-xl"
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
              className="rounded-xl resize-none"
            />
          </div>

          {/* Phone Display */}
          <div className="bg-secondary rounded-2xl p-4">
            <p className="text-sm text-muted-foreground">Telefon raqam</p>
            <p className="font-semibold text-foreground">{user?.phone}</p>
          </div>
        </form>
      </PageContainer>

      {/* Fixed Bottom - Payment notice + CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-md border-t border-border safe-bottom">
        {/* Payment notice - Short and clear */}
        <div className="flex items-center justify-center gap-2 py-2 bg-accent/50 border-b border-border">
          <Banknote className="w-4 h-4 text-accent-foreground" />
          <span className="text-sm font-medium text-accent-foreground">
            To'lov yetkazib berilganda
          </span>
        </div>
        
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-muted-foreground">Jami:</span>
            <span className="text-xl font-bold text-foreground">
              {totalPrice.toLocaleString()} so'm
            </span>
          </div>
          <Button
            size="lg"
            className="w-full h-14 rounded-2xl text-base font-semibold touch-feedback shadow-primary"
            onClick={handleSubmit}
            disabled={createOrder.isPending || !address.trim()}
          >
            {createOrder.isPending ? "Yuborilmoqda..." : "Buyurtmani tasdiqlash"}
          </Button>
        </div>
      </div>
    </div>
  );
}
