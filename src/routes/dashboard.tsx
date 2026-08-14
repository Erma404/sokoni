import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { ArrowUpRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/lib/app-context";
import { useT } from "@/lib/language";
import { StatusBadge } from "@/components/tracking/StatusBadge";
import { shortDate } from "@/lib/format";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Tableau de bord acheteur — Sokoni Export" },
      {
        name: "description",
        content:
          "Toutes vos commandes Sokoni Export au même endroit : commandes actives, statut en direct, livraisons passées et documents commerciaux téléchargeables.",
      },
      { property: "og:title", content: "Tableau de bord acheteur — Sokoni Export" },
      { property: "og:description", content: "Vos commandes d'avocat actives et passées." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Dashboard,
});

const COPY = {
  fr: {
    loading: "Chargement…",
    signInRequired: "Connexion requise",
    signInBody: "Votre tableau de bord liste chaque commande active et passée de votre entreprise.",
    signIn: "Se connecter",
    buyerPortal: "Portail acheteur",
    yourShipments: "Vos commandes",
    loadingOrders: "Chargement des commandes…",
    noOrders: "Aucune commande liée à ce compte pour le moment.",
    startRfq: "Démarrer un devis",
    active: "Actives",
    delivered: "Livrées",
    cartons: "cartons",
    track: "Suivre",
  },
  en: {
    loading: "Loading…",
    signInRequired: "Sign in required",
    signInBody: "Your dashboard lists every active and past shipment for your company.",
    signIn: "Sign in",
    buyerPortal: "Buyer portal",
    yourShipments: "Your shipments",
    loadingOrders: "Loading orders…",
    noOrders: "No orders linked to this account yet.",
    startRfq: "Start an RFQ",
    active: "Active",
    delivered: "Delivered",
    cartons: "cartons",
    track: "Track",
  },
};

interface OrderRow {
  id: string;
  tracking_code: string;
  product_summary: string;
  quantity_cartons: number;
  destination: string;
  incoterm: string;
  status: string;
  created_at: string;
}

function Dashboard() {
  const { user, loading } = useSession();
  const queryClient = useQueryClient();
  const t = useT(COPY);

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["my-orders", user?.id],
    enabled: Boolean(user),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select(
          "id, tracking_code, product_summary, quantity_cartons, destination, incoterm, status, created_at",
        )
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as OrderRow[];
    },
  });

  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel("my-orders")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, () => {
        queryClient.invalidateQueries({ queryKey: ["my-orders", user.id] });
      })
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, queryClient]);

  if (loading)
    return (
      <p className="mx-auto max-w-5xl px-5 py-24 text-sm text-muted-foreground">{t.loading}</p>
    );

  if (!user) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-28 text-center">
        <h1 className="stencil text-2xl font-medium text-primary">{t.signInRequired}</h1>
        <p className="mt-3 text-muted-foreground">{t.signInBody}</p>
        <Link to="/auth" className="mt-6 inline-block">
          <Button variant="lime">{t.signIn}</Button>
        </Link>
      </div>
    );
  }

  const active = orders.filter((o) => o.status !== "delivered");
  const past = orders.filter((o) => o.status === "delivered");

  return (
    <div className="mx-auto max-w-5xl px-5 py-14">
      <p className="eyebrow">{t.buyerPortal}</p>
      <h1 className="stencil mt-3 text-3xl font-medium text-primary sm:text-4xl">
        {t.yourShipments}
      </h1>

      {isLoading ? (
        <p className="py-16 text-sm text-muted-foreground">{t.loadingOrders}</p>
      ) : orders.length === 0 ? (
        <div className="mt-10 border border-dashed border-border p-12 text-center text-sm text-muted-foreground">
          {t.noOrders}{" "}
          <Link to="/catalog" className="text-clay underline underline-offset-4">
            {t.startRfq}
          </Link>
          .
        </div>
      ) : (
        <div className="mt-10 space-y-12">
          <OrderGroup
            title={t.active}
            cartonsLabel={t.cartons}
            trackLabel={t.track}
            orders={active}
          />
          <OrderGroup
            title={t.delivered}
            cartonsLabel={t.cartons}
            trackLabel={t.track}
            orders={past}
          />
        </div>
      )}
    </div>
  );
}

function OrderGroup({
  title,
  cartonsLabel,
  trackLabel,
  orders,
}: {
  title: string;
  cartonsLabel: string;
  trackLabel: string;
  orders: OrderRow[];
}) {
  if (!orders.length) return null;
  return (
    <section>
      <h2 className="eyebrow mb-3">{title}</h2>
      <ul className="divide-y divide-border border-y border-border">
        {orders.map((o) => (
          <li key={o.id} className="flex flex-wrap items-center gap-4 py-5">
            <div className="min-w-0 flex-1">
              <div className="stencil text-sm font-medium">{o.tracking_code}</div>
              <div className="mt-1 text-sm text-muted-foreground">{o.product_summary}</div>
              <div className="mt-1 text-xs text-muted-foreground">
                {o.quantity_cartons} {cartonsLabel} · {o.incoterm} · {o.destination} ·{" "}
                {shortDate(o.created_at)}
              </div>
            </div>
            <StatusBadge status={o.status} />
            <Link to="/track/$code" params={{ code: o.tracking_code }}>
              <Button variant="outline" size="sm">
                {trackLabel}
                <ArrowUpRight className="size-3.5" />
              </Button>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
