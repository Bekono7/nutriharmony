import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import DishCard from "@/components/DishCard";
import { Filter, Search, Info } from "lucide-react";
import CommentsSection from "@/components/CommentsSection";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { dishesApi, resolveMediaUrl, type Dish } from "@/lib/api";
import fallbackImg from "@/assets/ndole-camerounais.jpg";

const Menu = () => {
  const { isAuthenticated } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const categories = [
    { id: "all", name: "Tous" },
    { id: "entrees", name: "Entrées" },
    { id: "plats", name: "Plats" },
    { id: "desserts", name: "Desserts" },
    { id: "boissons", name: "Boissons" },
  ];

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const acc: Dish[] = [];
        let page = 1;
        for (;;) {
          const { data } = await dishesApi.list({ page, page_size: 100 });
          acc.push(...data.results);
          if (!data.next) break;
          page += 1;
        }
        if (!cancelled) setDishes(acc);
      } catch {
        if (!cancelled) {
          setError("Impossible de charger le menu. Vérifiez que le serveur tourne sur le port 8000.");
          setDishes([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredDishes = dishes.filter((dish) => {
    const matchesCategory =
      selectedCategory === "all" || dish.category === selectedCategory;
    const matchesSearch =
      dish.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dish.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-muted/20">
      <div className="bg-gradient-to-r from-primary/10 to-accent/10 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">Notre Menu</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Découvrez nos plats sains et savoureux, préparés avec des ingrédients frais et de
              qualité
            </p>
          </div>

          {!isAuthenticated && (
            <div className="bg-white/80 backdrop-blur-sm border border-primary/20 rounded-xl p-6 max-w-4xl mx-auto">
              <div className="flex items-center gap-4">
                <Info className="h-6 w-6 text-primary flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-semibold text-primary mb-1">
                    Connectez-vous pour découvrir votre menu personnalisé !
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Créez votre profil santé pour voir uniquement les plats adaptés à vos allergies,
                    régimes et objectifs nutritionnels.
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link to="/login">
                    <Button variant="outline" size="sm">
                      Connexion
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button size="sm" className="bg-gradient-to-r from-primary to-accent">
                      Inscription
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Rechercher un plat..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="interactive"
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {loading && (
          <p className="text-muted-foreground mb-6">Chargement du menu…</p>
        )}
        {error && (
          <p className="text-destructive mb-6" role="alert">
            {error}
          </p>
        )}

        <div className="mb-6">
          <p className="text-muted-foreground">
            {filteredDishes.length} plat{filteredDishes.length > 1 ? "s" : ""} trouvé
            {filteredDishes.length > 1 ? "s" : ""}
          </p>
        </div>

<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDishes.map((dish) => (
            <DishCard
              key={dish.id}
              dish={dish}
              name={dish.name}
              description={dish.description}
              price={dish.price}
              image={resolveMediaUrl(dish.image_url) ?? fallbackImg}
              badges={Array.isArray(dish.badges) ? dish.badges : []}
              calories={dish.calories}
              proteins={dish.proteins}
            />
          ))}
        </div>

        {!loading && filteredDishes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg mb-4">
              Aucun plat trouvé pour votre recherche
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
              }}
            >
              Réinitialiser les filtres
            </Button>
          </div>
        )}

        {filteredDishes.length > 0 && (
          <div className="mt-12">
            <CommentsSection dishId={filteredDishes[0].id} />
          </div>
        )}
      </div>

      <div className="bg-gradient-to-r from-primary to-accent text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Prêt à personnaliser votre expérience ?</h2>
          <p className="text-lg mb-6 opacity-90">
            Créez votre profil pour découvrir un menu adapté à vos besoins
          </p>
          <Link to="/register">
            <Button size="lg" variant="secondary" className="interactive">
              Créer mon profil santé
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Menu;
