import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Leaf, Wheat, Dumbbell } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useCart } from "@/contexts/CartContext";
import type { Dish } from "@/lib/api";

interface DishCardProps {
  dish?: Dish;
  name: string;
  description: string;
  price: number | string;
  image: string;
  badges: string[];
  calories?: number | null;
  proteins?: number | string | null;
}

const DishCard = ({ dish, name, description, price, image, badges, calories, proteins }: DishCardProps) => {
  const priceNum = typeof price === "number" ? price : Number(price);
  const { toast } = useToast();
  const cart = useCart();
  const getBadgeIcon = (badge: string) => {
    switch (badge) {
      case "Végan":
        return <Leaf className="h-3 w-3" />;
      case "Sans Gluten":
        return <Wheat className="h-3 w-3" />;
      case "Riche en Protéines":
        return <Dumbbell className="h-3 w-3" />;
      default:
        return null;
    }
  };

  const getBadgeClass = (badge: string) => {
    switch (badge) {
      case "Végan":
        return "badge-vegan";
      case "Sans Gluten":
        return "badge-gluten-free";
      case "Riche en Protéines":
        return "badge-protein";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="card-natural overflow-hidden group">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-3 right-3">
          <span className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-sm font-semibold text-primary">
            {priceNum.toLocaleString()} FCFA
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="font-semibold text-lg text-foreground mb-2">{name}</h3>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{description}</p>

        {/* Nutritional Info */}
        {(calories != null || proteins != null) && (
          <div className="flex gap-4 mb-4 text-xs text-muted-foreground">
            {calories != null && <span>{calories} kcal</span>}
            {proteins != null && <span>{proteins}g protéines</span>}
          </div>
        )}

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          {badges.map((badge, index) => (
            <Badge
              key={index}
              variant="secondary"
              className={`${getBadgeClass(badge)} flex items-center gap-1`}
            >
              {getBadgeIcon(badge)}
              {badge}
            </Badge>
          ))}
        </div>

        {/* Add to Cart Button */}
        <Button 
          className="w-full interactive bg-gradient-to-r from-primary to-accent hover:from-primary-hover hover:to-accent-hover"
          size="sm"
          onClick={() => {
            if (!dish) {
              toast({
                title: "Erreur",
                description: "Impossible d'ajouter ce plat au panier.",
                variant: "destructive",
              });
              return;
            }
            cart.addDish(dish, 1);
            toast({ title: "Ajouté au panier", description: dish.name });
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Ajouter au panier
        </Button>
      </div>
    </div>
  );
};

export default DishCard;