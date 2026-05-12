import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  dishesApi,
  mealPlansApi,
  type Dish,
  type MealPlan,
  type MealPlanItemInput,
} from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { ArrowLeft, CalendarPlus, Pencil, Trash2 } from "lucide-react";

async function fetchAllMealPlans(): Promise<MealPlan[]> {
  const acc: MealPlan[] = [];
  let page = 1;
  for (;;) {
    const { data } = await mealPlansApi.list({ page });
    acc.push(...data.results);
    if (!data.next) break;
    page += 1;
  }
  return acc;
}

async function fetchAllDishes(): Promise<Dish[]> {
  const acc: Dish[] = [];
  let page = 1;
  for (;;) {
    const { data } = await dishesApi.list({ page, page_size: 100 });
    acc.push(...data.results);
    if (!data.next) break;
    page += 1;
  }
  return acc;
}

const MealPlansPage = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [plans, setPlans] = useState<MealPlan[]>([]);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [editPlan, setEditPlan] = useState<MealPlan | null>(null);
  const [newName, setNewName] = useState("");
  const [newDate, setNewDate] = useState("");
  const [editItems, setEditItems] = useState<MealPlanItemInput[]>([]);
  const [addDishId, setAddDishId] = useState<string>("");

  const reload = useCallback(async () => {
    const [p, d] = await Promise.all([fetchAllMealPlans(), fetchAllDishes()]);
    setPlans(p);
    setDishes(d);
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
            description: "Chargement des menus impossible.",
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

  const openCreate = () => {
    setNewName("");
    setNewDate(new Date().toISOString().slice(0, 10));
    setCreateOpen(true);
  };

  const submitCreate = async () => {
    if (!newName.trim() || !newDate) {
      toast({ title: "Nom et date requis", variant: "destructive" });
      return;
    }
    try {
      await mealPlansApi.create({ name: newName.trim(), plan_date: newDate, items: [] });
      toast({ title: "Menu créé" });
      setCreateOpen(false);
      await reload();
    } catch (e) {
      toast({ title: "Erreur création", variant: "destructive" });
    }
  };

  const openEdit = (plan: MealPlan) => {
    setEditPlan(plan);
    setEditItems(
      plan.items.map((it) => ({ dish: it.dish, sort_order: it.sort_order })),
    );
    setAddDishId("");
  };

  const saveEdit = async () => {
    if (!editPlan) return;
    try {
      await mealPlansApi.update(editPlan.id, {
        name: editPlan.name,
        plan_date: editPlan.plan_date,
        items: editItems.map((it, i) => ({ ...it, sort_order: it.sort_order ?? i })),
      });
      toast({ title: "Menu mis à jour" });
      setEditPlan(null);
      await reload();
    } catch {
      toast({ title: "Erreur enregistrement", variant: "destructive" });
    }
  };

  const removePlan = async (id: number) => {
    if (!confirm("Supprimer ce menu ?")) return;
    try {
      await mealPlansApi.delete(id);
      toast({ title: "Menu supprimé" });
      await reload();
    } catch {
      toast({ title: "Erreur suppression", variant: "destructive" });
    }
  };

  const pushDish = () => {
    const id = Number(addDishId);
    if (!id) return;
    setEditItems((prev) => [...prev, { dish: id, sort_order: prev.length }]);
    setAddDishId("");
  };

  const removeItemAt = (index: number) => {
    setEditItems((prev) => prev.filter((_, i) => i !== index));
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
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Accueil
        </Link>
        <Card>
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CalendarPlus className="h-6 w-6 text-primary" />
                Mes menus
              </CardTitle>
              <CardDescription>
                Plans repas par date ; ajoutez des plats depuis le catalogue.
              </CardDescription>
            </div>
            <Button onClick={openCreate}>Nouveau menu</Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {plans.length === 0 ? (
              <p className="text-muted-foreground text-sm">Aucun menu pour l’instant.</p>
            ) : (
              <ul className="space-y-3">
                {plans.map((p) => (
                  <li
                    key={p.id}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-lg border p-4 bg-background"
                  >
                    <div>
                      <p className="font-medium">{p.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {p.plan_date} · {p.items.length} plat(s)
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => openEdit(p)}>
                        <Pencil className="h-4 w-4 mr-1" />
                        Modifier
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive"
                        onClick={() => removePlan(p.id)}
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

        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nouveau menu</DialogTitle>
              <DialogDescription>Nom et jour du plan repas.</DialogDescription>
            </DialogHeader>
            <div className="space-y-3 py-2">
              <div className="space-y-2">
                <Label>Nom</Label>
                <Input value={newName} onChange={(e) => setNewName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Date</Label>
                <Input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCreateOpen(false)}>
                Annuler
              </Button>
              <Button onClick={submitCreate}>Créer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={!!editPlan} onOpenChange={(o) => !o && setEditPlan(null)}>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Modifier le menu</DialogTitle>
              <DialogDescription>Plats inclus dans ce jour.</DialogDescription>
            </DialogHeader>
            {editPlan && (
              <>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label>Nom</Label>
                    <Input
                      value={editPlan.name}
                      onChange={(e) =>
                        setEditPlan({ ...editPlan, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Date</Label>
                    <Input
                      type="date"
                      value={editPlan.plan_date}
                      onChange={(e) =>
                        setEditPlan({ ...editPlan, plan_date: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Plats</Label>
                    <ul className="space-y-2 text-sm border rounded-md p-2 max-h-40 overflow-y-auto">
                      {editItems.length === 0 ? (
                        <li className="text-muted-foreground">Aucun plat</li>
                      ) : (
                        editItems.map((it, idx) => {
                          const d = dishes.find((x) => x.id === it.dish);
                          return (
                            <li
                              key={`${it.dish}-${idx}`}
                              className="flex justify-between items-center gap-2"
                            >
                              <span>{d?.name ?? `Plat #${it.dish}`}</span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeItemAt(idx)}
                              >
                                Retirer
                              </Button>
                            </li>
                          );
                        })
                      )}
                    </ul>
                    <div className="flex gap-2 flex-wrap">
                      <Select value={addDishId || undefined} onValueChange={setAddDishId}>
                        <SelectTrigger className="flex-1 min-w-[12rem]">
                          <SelectValue placeholder="Ajouter un plat…" />
                        </SelectTrigger>
                        <SelectContent>
                          {dishes.map((d) => (
                            <SelectItem key={d.id} value={String(d.id)}>
                              {d.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button type="button" variant="secondary" onClick={pushDish}>
                        Ajouter
                      </Button>
                    </div>
                  </div>
                </div>
                <DialogFooter className="mt-4">
                  <Button variant="outline" onClick={() => setEditPlan(null)}>
                    Fermer
                  </Button>
                  <Button onClick={saveEdit}>Enregistrer</Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default MealPlansPage;
