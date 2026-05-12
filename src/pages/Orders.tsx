import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ordersApi, type Order } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  ArrowLeft,
  Receipt,
  Trash2,
  ShoppingBag,
  Clock,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
  CalendarDays,
  Phone,
  MapPin,
  StickyNote,
} from "lucide-react";

const statusConfig = {
  pending: {
    label: "En attente",
    icon: Clock,
    variant: "secondary" as const,
    className: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
  paid: {
    label: "Payée",
    icon: CheckCircle2,
    variant: "default" as const,
    className: "bg-green-100 text-green-800 border-green-200",
  },
  cancelled: {
    label: "Annulée",
    icon: XCircle,
    variant: "destructive" as const,
    className: "bg-red-100 text-red-800 border-red-200",
  },
};

const OrderCard = ({
  order,
  onDelete,
}: {
  order: Order;
  onDelete: (id: number) => void;
}) => {
  const [expanded, setExpanded] = useState(false);
  const status = statusConfig[order.status] ?? statusConfig.pending;
  const StatusIcon = status.icon;

  const formattedDate = new Date(order.created_at).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="border rounded-xl bg-background overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="p-4 flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-base">Commande #{order.id}</p>
            <span
              className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border ${status.className}`}
            >
              <StatusIcon className="h-3 w-3" />
              {status.label}
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <CalendarDays className="h-3 w-3" />
            {formattedDate}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <p className="font-bold text-lg text-primary">
            {Number(order.total).toLocaleString("fr-FR")} FCFA
          </p>
          {order.status === "pending" && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive h-8 w-8">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Supprimer la commande ?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Cette action est irréversible. La commande #{order.id} sera définitivement supprimée.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive hover:bg-destructive/90"
                    onClick={() => onDelete(order.id)}
                  >
                    Supprimer
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setExpanded(!expanded)}
            aria-label={expanded ? "Réduire" : "Voir les détails"}
          >
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Summary line */}
      <div className="px-4 pb-3 text-sm text-muted-foreground">
        {order.items.length} article{order.items.length > 1 ? "s" : ""} ·{" "}
        {order.items.map((it) => it.dish_detail?.name ?? `Plat #${it.dish}`).join(", ")}
      </div>

      {/* Expanded details */}
      {expanded && (
        <>
          <Separator />
          <div className="p-4 space-y-4 bg-muted/20">
            {/* Items */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                Articles commandés
              </p>
              <ul className="space-y-2">
                {order.items.map((it) => (
                  <li key={it.id} className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <ShoppingBag className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>{it.dish_detail?.name ?? `Plat #${it.dish}`}</span>
                      <Badge variant="outline" className="text-xs px-1.5 py-0">
                        ×{it.quantity}
                      </Badge>
                    </span>
                    <span className="font-medium">
                      {(Number(it.unit_price) * it.quantity).toLocaleString("fr-FR")} FCFA
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Delivery info */}
            {(order.full_name || order.phone || order.address || order.note) && (
              <>
                <Separator />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                    Informations de livraison
                  </p>
                  <div className="space-y-1.5 text-sm">
                    {order.full_name && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Receipt className="h-3.5 w-3.5" />
                        <span>{order.full_name}</span>
                      </div>
                    )}
                    {order.phone && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="h-3.5 w-3.5" />
                        <span>{order.phone}</span>
                      </div>
                    )}
                    {order.address && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5" />
                        <span>{order.address}</span>
                      </div>
                    )}
                    {order.note && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <StickyNote className="h-3.5 w-3.5" />
                        <span>{order.note}</span>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* Total */}
            <Separator />
            <div className="flex justify-between items-center font-semibold">
              <span>Total</span>
              <span className="text-primary text-lg">
                {Number(order.total).toLocaleString("fr-FR")} FCFA
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const OrdersPage = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);

  const load = async () => {
    const acc: Order[] = [];
    let page = 1;
    for (;;) {
      const { data } = await ordersApi.list({ page });
      acc.push(...data.results);
      if (!data.next) break;
      page += 1;
    }
    setOrders(acc);
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await load();
      } catch {
        if (!cancelled) {
          toast({
            title: "Erreur",
            description: "Impossible de charger vos commandes.",
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
  }, [toast]);

  const remove = async (id: number) => {
    try {
      await ordersApi.delete(id);
      toast({ title: "Commande supprimée" });
      setOrders((prev) => prev.filter((o) => o.id !== id));
    } catch (e: unknown) {
      const msg =
        e && typeof e === "object" && "response" in e
          ? JSON.stringify((e as { response?: { data?: unknown } }).response?.data)
          : "Suppression impossible.";
      toast({ title: "Erreur", description: String(msg), variant: "destructive" });
    }
  };

  // Stats
  const total = orders.reduce((sum, o) => sum + Number(o.total), 0);
  const pending = orders.filter((o) => o.status === "pending").length;
  const paid = orders.filter((o) => o.status === "paid").length;

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
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="h-6 w-6 text-primary" />
              Mes commandes
            </CardTitle>
            <CardDescription>Historique de toutes vos commandes.</CardDescription>
          </CardHeader>

          {orders.length > 0 && (
            <div className="px-6 pb-4 grid grid-cols-3 gap-3">
              <div className="rounded-lg bg-muted/50 p-3 text-center">
                <p className="text-2xl font-bold">{orders.length}</p>
                <p className="text-xs text-muted-foreground">Total commandes</p>
              </div>
              <div className="rounded-lg bg-yellow-50 p-3 text-center">
                <p className="text-2xl font-bold text-yellow-700">{pending}</p>
                <p className="text-xs text-muted-foreground">En attente</p>
              </div>
              <div className="rounded-lg bg-green-50 p-3 text-center">
                <p className="text-2xl font-bold text-green-700">{paid}</p>
                <p className="text-xs text-muted-foreground">Payées</p>
              </div>
            </div>
          )}

          <CardContent className="space-y-3">
            {orders.length === 0 ? (
              <div className="text-center py-12 space-y-3">
                <ShoppingBag className="h-12 w-12 text-muted-foreground/40 mx-auto" />
                <p className="text-muted-foreground">Vous n'avez pas encore de commandes.</p>
                <Link to="/menu">
                  <Button variant="outline" size="sm">
                    Voir le menu
                  </Button>
                </Link>
              </div>
            ) : (
              <>
                <ul className="space-y-3">
                  {orders.map((o) => (
                    <li key={o.id}>
                      <OrderCard order={o} onDelete={remove} />
                    </li>
                  ))}
                </ul>
                <Separator className="my-4" />
                <div className="flex justify-between items-center text-sm font-semibold px-1">
                  <span className="text-muted-foreground">Total dépensé</span>
                  <span className="text-primary text-base">
                    {total.toLocaleString("fr-FR")} FCFA
                  </span>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OrdersPage;
