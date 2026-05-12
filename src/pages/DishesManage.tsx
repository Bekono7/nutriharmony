import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { dishesApi, type Dish } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, ChefHat, Pencil, Trash2 } from "lucide-react";

const CATEGORIES = [
  { id: "entrees", label: "Entrées" },
  { id: "plats", label: "Plats" },
  { id: "desserts", label: "Desserts" },
  { id: "boissons", label: "Boissons" },
];

const emptyForm = () => ({
  name: "",
  description: "",
  price: "0",
  category: "plats",
  calories: "",
  proteins: "",
  badges: "",
});

const DishesManagePage = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState<Dish[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);

  const reload = useCallback(async () => {
    const { data } = await dishesApi.list({ mine: true, page_size: 100 });
    setList(data.results);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await reload();
      } catch {
        if (!cancelled) {
          toast({
            title: "Erreur",
            description: "Impossible de charger vos plats.",
            variant: "destructive",
          });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [reload, toast]);

  const openNew = () => {
    setEditingId(null);
    setForm(emptyForm());
    setDialogOpen(true);
  };

  const openEdit = (d: Dish) => {
    setEditingId(d.id);
    setForm({
      name: d.name,
      description: d.description,
      price: String(d.price),
      category: d.category,
      calories: d.calories != null ? String(d.calories) : "",
      proteins: d.proteins != null ? String(d.proteins) : "",
      badges: Array.isArray(d.badges) ? d.badges.join(", ") : "",
    });
    setDialogOpen(true);
  };

  const save = async () => {
    if (!form.name.trim()) {
      toast({ title: "Le nom est requis", variant: "destructive" });
      return;
    }
    const badges = form.badges
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price) || 0,
      category: form.category,
      calories: form.calories === "" ? null : Number(form.calories),
      proteins: form.proteins === "" ? null : Number(form.proteins),
      badges,
    };
    try {
      if (editingId) {
        await dishesApi.update(editingId, payload);
        toast({ title: "Plat mis à jour" });
      } else {
        await dishesApi.create(payload);
        toast({ title: "Plat créé" });
      }
      setDialogOpen(false);
      await reload();
    } catch {
      toast({ title: "Erreur d'enregistrement", variant: "destructive" });
    }
  };

  const remove = async (id: number) => {
    if (!confirm("Supprimer ce plat ?")) return;
    try {
      await dishesApi.delete(id);
      toast({ title: "Plat supprimé" });
      await reload();
    } catch {
      toast({ title: "Suppression impossible", variant: "destructive" });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center text-muted-foreground">
        Chargement…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <Link
          to="/menu"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Voir le menu public
        </Link>
        <Card>
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <ChefHat className="h-6 w-6 text-primary" />
                Mes plats
              </CardTitle>
              <CardDescription>
                Créez ou modifiez les plats dont vous êtes l’auteur (visibles aussi sur le menu
                public).
              </CardDescription>
            </div>
            <Button onClick={openNew}>Nouveau plat</Button>
          </CardHeader>
          <CardContent>
            {list.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Vous n’avez pas encore créé de plat. Les plats du seed sont sans auteur : créez les
                vôtres ici.
              </p>
            ) : (
              <ul className="space-y-2">
                {list.map((d) => (
                  <li
                    key={d.id}
                    className="flex flex-wrap items-center justify-between gap-2 border rounded-lg p-3 bg-background"
                  >
                    <div>
                      <p className="font-medium">{d.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {CATEGORIES.find((c) => c.id === d.category)?.label ?? d.category} ·{" "}
                        {Number(d.price).toLocaleString()} FCFA
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => openEdit(d)}>
                        <Pencil className="h-4 w-4 mr-1" />
                        Modifier
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive"
                        onClick={() => remove(d.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? "Modifier le plat" : "Nouveau plat"}</DialogTitle>
              <DialogDescription>Champs principaux du catalogue.</DialogDescription>
            </DialogHeader>
            <div className="space-y-3 py-2">
              <div className="space-y-2">
                <Label>Nom</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label>Prix (FCFA)</Label>
                  <Input
                    type="number"
                    min={0}
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Catégorie</Label>
                  <Select
                    value={form.category}
                    onValueChange={(v) => setForm({ ...form, category: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label>Calories</Label>
                  <Input
                    type="number"
                    min={0}
                    value={form.calories}
                    onChange={(e) => setForm({ ...form, calories: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Protéines (g)</Label>
                  <Input
                    type="number"
                    min={0}
                    step="0.1"
                    value={form.proteins}
                    onChange={(e) => setForm({ ...form, proteins: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Badges (virgules)</Label>
                <Input
                  value={form.badges}
                  onChange={(e) => setForm({ ...form, badges: e.target.value })}
                  placeholder="Végan, Sans Gluten"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={save}>Enregistrer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default DishesManagePage;
