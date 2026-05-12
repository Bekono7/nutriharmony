import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { healthProfileApi, type HealthProfile } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Leaf, ArrowLeft } from "lucide-react";

const genderOptions = [
  { value: "male", label: "Masculin" },
  { value: "female", label: "Féminin" },
  { value: "other", label: "Autre" },
  { value: "prefer_not_to_say", label: "Préfère ne pas dire" },
];

const tribes = [
  "Bamoun",
  "Bamiléké",
  "Bassa",
  "Béti",
  "Douala",
  "Bakweri",
  "Bakossi",
  "Bulu",
  "Ewondo",
  "Fang",
  "Tikar",
  "Maka",
  "Pygmée",
  "Autre",
];

const HealthProfilePage = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Partial<HealthProfile>>({
    age: null,
    gender: "",
    tribe: "",
    health_info: "",
    allergies: "",
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await healthProfileApi.get();
        if (!cancelled) {
          setForm({
            age: data.age,
            gender: data.gender,
            tribe: data.tribe,
            health_info: data.health_info,
            allergies: data.allergies,
          });
        }
      } catch (e) {
        toast({
          title: "Erreur",
          description: "Impossible de charger le profil santé.",
          variant: "destructive",
        });
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await healthProfileApi.patch({
        age: form.age === null || form.age === undefined ? null : Number(form.age),
        gender: form.gender ?? "",
        tribe: form.tribe ?? "",
        health_info: form.health_info ?? "",
        allergies: form.allergies ?? "",
      });
      toast({ title: "Profil enregistré", description: "Vos informations ont été mises à jour." });
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "response" in err
          ? JSON.stringify((err as { response?: { data?: unknown } }).response?.data)
          : "Échec de l'enregistrement.";
      toast({ title: "Erreur", description: String(msg), variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (!confirm("Supprimer votre profil santé ? Vous pourrez le recréer ensuite.")) return;
    try {
      await healthProfileApi.delete();
      setForm({
        age: null,
        gender: "",
        tribe: "",
        health_info: "",
        allergies: "",
      });
      toast({ title: "Profil supprimé" });
    } catch {
      toast({ title: "Erreur", variant: "destructive" });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center text-muted-foreground">
        Chargement du profil…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20 py-12">
      <div className="container mx-auto px-4 max-w-xl">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Accueil
        </Link>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Leaf className="h-6 w-6 text-primary" />
              <CardTitle>Profil santé</CardTitle>
            </div>
            <CardDescription>
              Ces données servent à personnaliser les recommandations (allergies, tribu, etc.).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age">Âge</Label>
                  <Input
                    id="age"
                    type="number"
                    min={1}
                    max={120}
                    value={form.age ?? ""}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        age: e.target.value === "" ? null : Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Sexe</Label>
                  <Select
                    value={form.gender ? form.gender : undefined}
                    onValueChange={(v) => setForm({ ...form, gender: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir" />
                    </SelectTrigger>
                    <SelectContent>
                      {genderOptions.map((o) => (
                        <SelectItem key={o.value} value={o.value}>
                          {o.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Tribu / groupe</Label>
                <Select
                  value={form.tribe ? form.tribe : undefined}
                  onValueChange={(v) => setForm({ ...form, tribe: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir" />
                  </SelectTrigger>
                  <SelectContent>
                    {tribes.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="health_info">Informations de santé</Label>
                <Textarea
                  id="health_info"
                  value={form.health_info ?? ""}
                  onChange={(e) => setForm({ ...form, health_info: e.target.value })}
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="allergies">Allergies</Label>
                <Textarea
                  id="allergies"
                  value={form.allergies ?? ""}
                  onChange={(e) => setForm({ ...form, allergies: e.target.value })}
                  placeholder="Séparées par des virgules"
                  rows={2}
                />
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                <Button type="submit" disabled={saving}>
                  {saving ? "Enregistrement…" : "Enregistrer"}
                </Button>
                <Button type="button" variant="outline" onClick={handleReset}>
                  Réinitialiser le profil
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HealthProfilePage;
