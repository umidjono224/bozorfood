import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAdminStore } from "@/stores/adminStore";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Image, X } from "lucide-react";
import { useEffect } from "react";

// Mock foods data - will be replaced with backend
const INITIAL_FOODS = [
  {
    id: "1",
    name: "Osh (Palov)",
    description: "An'anaviy o'zbek oshi, mol go'shti bilan",
    price: 35000,
    image: "https://images.unsplash.com/photo-1630409351217-bc4fa6422075?w=400&h=300&fit=crop",
  },
  {
    id: "2",
    name: "Lag'mon",
    description: "Qo'lda tayyorlangan lag'mon, sabzavotlar bilan",
    price: 28000,
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop",
  },
];

interface Food {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

interface FoodFormProps {
  food?: Food;
  onSave: (food: Omit<Food, "id">) => void;
  onCancel: () => void;
}

function FoodForm({ food, onSave, onCancel }: FoodFormProps) {
  const [name, setName] = useState(food?.name || "");
  const [description, setDescription] = useState(food?.description || "");
  const [price, setPrice] = useState(food?.price?.toString() || "");
  const [image, setImage] = useState(food?.image || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      description,
      price: parseInt(price) || 0,
      image,
    });
  };

  return (
    <div className="fixed inset-0 bg-background z-50 overflow-auto">
      <PageHeader title={food ? "Taomni tahrirlash" : "Yangi taom"} showHome={false} />
      <PageContainer>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Taom nomi *</label>
            <Input
              placeholder="Masalan: Osh"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Tavsif</label>
            <Textarea
              placeholder="Taom haqida qisqacha..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Narxi (so'm) *</label>
            <Input
              type="number"
              placeholder="35000"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <Image className="w-4 h-4" />
              Rasm URL
            </label>
            <Input
              type="url"
              placeholder="https://..."
              value={image}
              onChange={(e) => setImage(e.target.value)}
            />
          </div>

          {image && (
            <div className="aspect-video rounded-xl overflow-hidden bg-muted">
              <img
                src={image}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" className="flex-1" onClick={onCancel}>
              Bekor qilish
            </Button>
            <Button type="submit" className="flex-1">
              Saqlash
            </Button>
          </div>
        </form>
      </PageContainer>
    </div>
  );
}

export default function AdminFoods() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated } = useAdminStore();
  const [foods, setFoods] = useState<Food[]>(INITIAL_FOODS);
  const [editingFood, setEditingFood] = useState<Food | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/admin", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleAdd = (foodData: Omit<Food, "id">) => {
    const newFood: Food = {
      id: `food_${Date.now()}`,
      ...foodData,
    };
    setFoods([...foods, newFood]);
    setIsAdding(false);
    toast({
      title: "Muvaffaqiyatli",
      description: "Yangi taom qo'shildi",
    });
  };

  const handleEdit = (foodData: Omit<Food, "id">) => {
    if (!editingFood) return;
    setFoods(
      foods.map((f) =>
        f.id === editingFood.id ? { ...f, ...foodData } : f
      )
    );
    setEditingFood(null);
    toast({
      title: "Muvaffaqiyatli",
      description: "Taom yangilandi",
    });
  };

  const handleDelete = (id: string) => {
    setFoods(foods.filter((f) => f.id !== id));
    toast({
      title: "O'chirildi",
      description: "Taom o'chirildi",
    });
  };

  if (isAdding) {
    return <FoodForm onSave={handleAdd} onCancel={() => setIsAdding(false)} />;
  }

  if (editingFood) {
    return (
      <FoodForm
        food={editingFood}
        onSave={handleEdit}
        onCancel={() => setEditingFood(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <PageHeader title="Taomlar" />
      
      <PageContainer>
        <div className="space-y-3">
          {foods.map((food) => (
            <div
              key={food.id}
              className="flex items-center gap-3 bg-card rounded-xl p-3 border border-border animate-fade-in"
            >
              {food.image && (
                <img
                  src={food.image}
                  alt={food.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-foreground truncate">{food.name}</h3>
                <p className="text-sm text-primary font-semibold">
                  {food.price.toLocaleString()} so'm
                </p>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-9 w-9"
                  onClick={() => setEditingFood(food)}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-9 w-9 text-destructive"
                  onClick={() => handleDelete(food.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {foods.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Taomlar yo'q</p>
          </div>
        )}
      </PageContainer>

      {/* Add Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur-sm border-t border-border safe-bottom">
        <Button size="lg" className="w-full" onClick={() => setIsAdding(true)}>
          <Plus className="w-5 h-5 mr-2" />
          Yangi taom qo'shish
        </Button>
      </div>
    </div>
  );
}
