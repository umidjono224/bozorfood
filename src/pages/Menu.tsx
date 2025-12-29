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

  const handleAdd = () => {
    addItem({
      id: food.id,
      name: food.name,
      price: food.price,
      image: food.image,
    });
  };

  const handleIncrease = () => {
    updateQuantity(food.id, quantity + 1);
  };

  const handleDecrease = () => {
    updateQuantity(food.id, quantity - 1);
  };

  return (
    <div className="bg-card rounded-xl overflow-hidden shadow-card border border-border animate-fade-in">
      <div className="aspect-[4/3] overflow-hidden">
        <img
          src={food.image}
          alt={food.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-foreground text-lg">{food.name}</h3>
        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
          {food.description}
        </p>
        <div className="flex items-center justify-between mt-4">
          <span className="font-bold text-primary text-lg">
            {food.price.toLocaleString()} so'm
          </span>
          
          {quantity === 0 ? (
            <Button size="sm" onClick={handleAdd}>
              <Plus className="w-4 h-4 mr-1" />
              Qo'shish
            </Button>
          ) : (
            <div className="flex items-center gap-3">
              <Button
                size="icon"
                variant="outline"
                className="h-9 w-9"
                onClick={handleDecrease}
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="font-semibold text-lg w-6 text-center">{quantity}</span>
              <Button
                size="icon"
                className="h-9 w-9"
                onClick={handleIncrease}
              >
                <Plus className="w-4 h-4" />
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

  return (
    <div className="min-h-screen bg-background pb-24">
      <PageHeader title="Taomlar" />
      
      <PageContainer>
        <div className="grid grid-cols-1 gap-4">
          {FOODS.map((food, index) => (
            <div key={food.id} style={{ animationDelay: `${index * 0.05}s` }}>
              <FoodCard food={food} />
            </div>
          ))}
        </div>
      </PageContainer>

      {/* Floating Cart Button */}
      {totalItems > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur-sm border-t border-border safe-bottom">
          <Button
            size="lg"
            className="w-full"
            onClick={() => navigate("/checkout")}
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            Buyurtma berish ({totalItems}) - {totalPrice.toLocaleString()} so'm
          </Button>
        </div>
      )}
    </div>
  );
}
