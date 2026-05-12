import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ordersApi } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, ShoppingCart } from "lucide-react";

const CartPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const cart = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");

  const total = useMemo(() => cart.total, [cart.total]);

  const submitOrder = async () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: "/cart" } });
      return;
    }
    if (cart.items.length === 0) {
      toast({ title: "Panier vide", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    try {
      const payload = {
        full_name: fullName,
        phone,
        address,
        note,
        items: cart.items.map((it) => ({ dish: it.dishId, quantity: it.quantity })),
      };
      const { data } = await ordersApi.create(payload);
      cart.clear();
      toast({ title: "Commande créée", description: `Commande #${data.id}` });
      navigate("/orders");
    } catch (e: unknown) {
      const msg =
        e && typeof e === "object" && "response" in e
          ? JSON.stringify((e as { response?: { data?: unknown } }).response?.data)
          : "Création impossible.";
      toast({ title: "Erreur", description: String(msg), variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/20 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <Link
          to="/menu"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour au menu
        </Link>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-6 w-6 text-primary" />
              Panier
            </CardTitle>
            <CardDescription>Vérifiez vos produits et passez la commande.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {cart.items.length === 0 ? (
              <div className="text-muted-foreground">
                Votre panier est vide. <Link className="text-primary" to="/menu">Voir le menu</Link>.
              </div>
            ) : (
              <>
                <ul className="space-y-3">
                  {cart.items.map((it) => (
                    <li key={it.dishId} className="flex flex-wrap items-center justify-between gap-2 border rounded-lg p-4 bg-background">
                      <div className="min-w-[12rem]">
                        <p className="font-medium">{it.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {Number(it.price).toLocaleString()} FCFA / unité
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => cart.setQuantity(it.dishId, it.quantity - 1)}
                        >
                          -
                        </Button>
                        <Input
                          className="w-20"
                          type="number"
                          min={1}
                          value={it.quantity}
                          onChange={(e) => cart.setQuantity(it.dishId, Number(e.target.value))}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => cart.setQuantity(it.dishId, it.quantity + 1)}
                        >
                          +
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-destructive"
                          onClick={() => cart.remove(it.dishId)}
                        >
                          Retirer
                        </Button>
                      </div>
                      <div className="font-semibold">
                        {(Number(it.price) * it.quantity).toLocaleString()} FCFA
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="flex justify-end">
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Total</p>
                    <p className="text-2xl font-bold">{total.toLocaleString()} FCFA</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nom complet</Label>
                    <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Téléphone</Label>
                    <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Adresse de livraison</Label>
                  <Textarea value={address} onChange={(e) => setAddress(e.target.value)} rows={3} />
                </div>
                <div className="space-y-2">
                  <Label>Note</Label>
                  <Textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} />
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button onClick={submitOrder} disabled={isSubmitting}>
                    {isSubmitting ? "Commande…" : "Passer la commande"}
                  </Button>
                  <Button type="button" variant="outline" onClick={cart.clear}>
                    Vider le panier
                  </Button>
                </div>

                {!isAuthenticated && (
                  <p className="text-sm text-muted-foreground">
                    Vous devez être connecté pour passer la commande.
                  </p>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CartPage;

