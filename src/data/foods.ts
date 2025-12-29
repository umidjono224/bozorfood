export interface Food {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

export const FOODS: Food[] = [
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
  {
    id: "3",
    name: "Manti",
    description: "Mol go'shtli manti, 5 dona",
    price: 25000,
    image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400&h=300&fit=crop",
  },
  {
    id: "4",
    name: "Shashlik",
    description: "Mol go'shti shashlik, 200g",
    price: 45000,
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop",
  },
  {
    id: "5",
    name: "Somsa",
    description: "Go'shtli somsa, 3 dona",
    price: 15000,
    image: "https://images.unsplash.com/photo-1509722747041-616f39b57569?w=400&h=300&fit=crop",
  },
  {
    id: "6",
    name: "Chuchvara",
    description: "Mol go'shtli chuchvara, sho'rva bilan",
    price: 22000,
    image: "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=400&h=300&fit=crop",
  },
];
