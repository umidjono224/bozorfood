import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cartStore";
import { Plus, Minus, ShoppingCart } from "lucide-react";
import { FOODS, Food } from "@/data/foods";

interface FoodCardProps {
  food: Food;
}

function FoodCard({ food }: FoodCardProps) {
  const { items, addItem, updateQuantity } = useCartStore();
  const cartItem = items.find((item) => item.id === food.id);
  const quantity = cartItem?.quantity || 0;
  const [animateQuantity, setAnimateQuantity] = useState(false);

  const handleAdd = () => {
    addItem({
      id: food.id,
      name: food.name,
      price: food.price,
      image: food.image,
    });
    triggerAnimation();
  };

  const handleIncrease = () => {
    updateQuantity(food.id, quantity + 1);
    triggerAnimation();
  };

  const handleDecrease = () => {
    updateQuantity(food.id, quantity - 1);
    triggerAnimation();
  };

  const triggerAnimation = () => {
    setAnimateQuantity(true);
    setTimeout(() => setAnimateQuantity(false), 200);
  };

  return (
    <div className="bg-card rounded-2xl overflow-hidden shadow-card border border-border animate-fade-in">
      {/* Reduced image height by ~25% - using aspect-[16/9] instead of aspect-[4/3] */}
      <div className="aspect-[16/9] overflow-hidden">
        <img
          src={food.image}
          alt={food.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="p-4">
        {/* Improved readability with larger text */}
        <h3 className="font-semibold text-foreground text-lg leading-tight">{food.name}</h3>
        <p className="text-sm text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed">
          {food.description}
        </p>
        
        {/* Price and quantity controls - optimized for thumb reach */}
        <div className="flex items-center justify-between mt-4 gap-3">
          <span className="font-bold text-primary text-lg">
            {food.price.toLocaleString()} so'm
          </span>
          
          {quantity === 0 ? (
            <Button 
              size="sm" 
              onClick={handleAdd}
              className="h-11 px-5 rounded-xl touch-feedback"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Qo'shish
            </Button>
          ) : (
            /* Quantity controls pushed to right with larger tap areas */
            <div className="flex items-center gap-2">
              <Button
                size="icon"
                variant="outline"
                className="h-11 w-11 rounded-xl touch-feedback"
                onClick={handleDecrease}
              >
                <Minus className="w-5 h-5" />
              </Button>
              <span 
                className={`font-bold text-lg w-8 text-center tabular-nums ${
                  animateQuantity ? 'quantity-pop' : ''
                }`}
              >
                {quantity}
              </span>
              <Button
                size="icon"
                className="h-11 w-11 rounded-xl touch-feedback"
                onClick={handleIncrease}
              >
                <Plus className="w-5 h-5" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Menu() {
  const navigate = useNavigate();
  const { getTotalItems, getTotalPrice } = useCartStore();
  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();
  const [cartVisible, setCartVisible] = useState(totalItems > 0);
  const [cartKey, setCartKey] = useState(0);

  // Animate cart button when items change
  useEffect(() => {
    if (totalItems > 0) {
      setCartVisible(true);
      setCartKey(prev => prev + 1);
    } else {
      setCartVisible(false);
    }
  }, [totalItems]);

  return (
    <div className="min-h-screen bg-background pb-28">
      <PageHeader title="Taomlar" />
      
      <PageContainer className="px-4">
        <div className="grid grid-cols-1 gap-5">
          {FOODS.map((food, index) => (
            <div key={food.id} style={{ animationDelay: `${index * 0.04}s` }}>
              <FoodCard food={food} />
            </div>
          ))}
        </div>
      </PageContainer>

      {/* Floating Cart Button - Sticky at bottom with animation */}
      {cartVisible && (
        <div 
          key={cartKey}
          className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur-md border-t border-border safe-bottom slide-up-enter"
        >
          <Button
            size="lg"
            className="w-full h-14 rounded-2xl text-base font-semibold cart-pulse touch-feedback shadow-primary"
            onClick={() => navigate("/checkout")}
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            Buyurtma ({totalItems}) — {totalPrice.toLocaleString()} so'm
          </Button>
        </div>
      )}
    </div>
  );
}
