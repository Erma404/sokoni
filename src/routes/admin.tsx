import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Copy, Package, PackageCheck, Truck, Warehouse } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/lib/app-context";
import { STAGES, stageIndex } from "@/lib/checkpoints";
import { useLanguage, useT } from "@/lib/language";
import { statusLabel } from "@/lib/checkpoints";
import { shortDate, dateTime } from "@/lib/format";
import { AdminShell } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PdfLogoSettings } from "@/components/admin/PdfLogoSettings";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Back office — Sokoni Export" },
      {
        name: "description",
        content:
          "Back office interne Sokoni Export : créer des commandes et enregistrer les étapes de suivi.",
      },
      { property: "og:title", content: "Back office — Sokoni Export" },
      { property: "og:description", content: "Gestion interne des commandes et étapes de suivi." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Admin,
});

const COPY = {
  fr: {
    loading: "Chargement…",
    signInRequired: "Connectez-vous avec un compte de l'équipe Sokoni pour ouvrir le back office.",
    restricted: "Cette zone est réservée à l'équipe Sokoni.",
    backOffice: "Back office",
    overview: "Vue d'ensemble des commandes et de la traçabilité",
    statTotal: "Commandes",
    statProcessing: "En traitement",
    statTransit: "En transit",
    statDelivered: "Livrées",
    pdfLogo: "Logo des documents PDF",
    newOrder: "Nouvelle commande",
    newOrderDesc: "Enregistre une commande et génère son lien de suivi transitaire.",
    orders: "Commandes",
    ordersDesc: "Cliquez une ligne pour ouvrir le détail et enregistrer une étape.",
    noOrders: "Aucune commande pour le moment.",
    copyForwarderLink: "Copier le lien transitaire",
    forwarderLinkCopied: "Lien transitaire copié",
    cartons: "cartons",
    trackingCode: "Code de suivi",
    buyerCompany: "Entreprise acheteuse",
    productSummary: "Résumé produit",
    productSummaryPlaceholder: "Avocat Hass · calibre 16 · caisse 4 kg",
    cartonsLabel: "Cartons",
    netKg: "Kg net",
    incoterm: "Incoterm",
    originFarm: "Ferme d'origine",
    destination: "Destination",
    creating: "Création…",
    createOrder: "Créer la commande",
    orderCreated: "Commande créée",
    checkpoint: "Étape",
    dateTime: "Date & heure",
    location: "Lieu",
    reference: "Référence",
    tempC: "Temp °C",
    documentLabel: "Libellé du document",
    documentUrl: "URL du document",
    notes: "Notes",
    logging: "Enregistrement…",
    logCheckpoint: "Enregistrer l'étape",
    checkpointLogged: "Étape enregistrée — la timeline de l'acheteur est mise à jour",
    colCode: "Code",
    colClient: "Client",
    colProduct: "Produit",
    colCartons: "Cartons",
    colStatus: "Statut",
    colCreated: "Créée",
    created: "Créée",
  },
  en: {
    loading: "Loading…",
    signInRequired: "Sign in with a Sokoni team account to open the back office.",
    restricted: "This area is restricted to the Sokoni team.",
    backOffice: "Back office",
    overview: "Orders and traceability overview",
    statTotal: "Orders",
    statProcessing: "Processing",
    statTransit: "In transit",
    statDelivered: "Delivered",
    pdfLogo: "PDF document logo",
    newOrder: "New order",
    newOrderDesc: "Records an order and generates its forwarder tracking link.",
    orders: "Orders",
    ordersDesc: "Click a row to open the detail and log a checkpoint.",
    noOrders: "No orders yet.",
    copyForwarderLink: "Copy forwarder link",
    forwarderLinkCopied: "Forwarder link copied",
    cartons: "cartons",
    trackingCode: "Tracking code",
    buyerCompany: "Buyer company",
    productSummary: "Product summary",
    productSummaryPlaceholder: "Hass avocado · caliber 16 · 4 kg crate",
    cartonsLabel: "Cartons",
    netKg: "Net kg",
    incoterm: "Incoterm",
    originFarm: "Origin farm",
    destination: "Destination",
    creating: "Creating…",
    createOrder: "Create order",
    orderCreated: "Order created",
    checkpoint: "Checkpoint",
    dateTime: "Date & time",
    location: "Location",
    reference: "Reference",
    tempC: "Temp °C",
    documentLabel: "Document label",
    documentUrl: "Document URL",
    notes: "Notes",
    logging: "Logging…",
    logCheckpoint: "Log checkpoint",
    checkpointLogged: "Checkpoint logged — buyer timeline updated",
    colCode: "Code",
    colClient: "Client",
    colProduct: "Product",
    colCartons: "Cartons",
    colStatus: "Status",
    colCreated: "Created",
    created: "Created",
  },
};

interface AdminOrder {
  id: string;
  tracking_code: string;
  buyer_company: string | null;
  product_summary: string;
  quantity_cartons: number;
  destination: string;
  incoterm: string;
  origin_farm: string | null;
  status: string;
  forwarder_token: string;
  created_at: string;
}

function statusBadgeVariant(status: string): "default" | "secondary" | "outline" {
  if (status === "delivered") return "default";
  if (status === "in_transit") return "secondary";
  return "outline";
}

function Admin() {
  const { isAdmin, loading, user } = useSession();
  const { lang } = useLanguage();
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState<AdminOrder | null>(null);
  const t = useT(COPY);

  const { data: orders = [] } = useQuery({
    queryKey: ["admin-orders"],
    enabled: isAdmin,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as AdminOrder[];
    },
  });

  useEffect(() => {
    if (!isAdmin) return;
    const channel = supabase
      .channel("admin-orders")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, () => {
        queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      })
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAdmin, queryClient]);

  if (loading || !user || !isAdmin) {
    return (
      <AdminShell>
        <p className="mx-auto max-w-md py-24 text-center text-sm text-muted-foreground">
          {loading ? t.loading : !user ? t.signInRequired : t.restricted}
        </p>
      </AdminShell>
    );
  }

  const stats = {
    total: orders.length,
    processing: orders.filter((o) => o.status === "processing").length,
    inTransit: orders.filter((o) => o.status === "in_transit").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
  };

  // Keep the detail dialog's data in sync as realtime updates come in.
  const liveSelected = selected ? (orders.find((o) => o.id === selected.id) ?? null) : null;

  return (
    <AdminShell>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">{t.backOffice}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t.overview}</p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard icon={Package} label={t.statTotal} value={stats.total} />
        <StatCard icon={Warehouse} label={t.statProcessing} value={stats.processing} />
        <StatCard icon={Truck} label={t.statTransit} value={stats.inTransit} />
        <StatCard icon={PackageCheck} label={t.statDelivered} value={stats.delivered} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[380px_1fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t.pdfLogo}</CardTitle>
            </CardHeader>
            <CardContent>
              <PdfLogoSettings />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t.newOrder}</CardTitle>
              <CardDescription>{t.newOrderDesc}</CardDescription>
            </CardHeader>
            <CardContent>
              <NewOrderForm
                onCreated={() => queryClient.invalidateQueries({ queryKey: ["admin-orders"] })}
              />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t.orders}</CardTitle>
            <CardDescription>{t.ordersDesc}</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {orders.length === 0 ? (
              <p className="px-6 pb-6 text-sm text-muted-foreground">{t.noOrders}</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t.colCode}</TableHead>
                    <TableHead>{t.colClient}</TableHead>
                    <TableHead className="hidden md:table-cell">{t.colProduct}</TableHead>
                    <TableHead className="hidden sm:table-cell text-right">
                      {t.colCartons}
                    </TableHead>
                    <TableHead>{t.colStatus}</TableHead>
                    <TableHead className="hidden lg:table-cell">{t.colCreated}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((o) => (
                    <TableRow key={o.id} className="cursor-pointer" onClick={() => setSelected(o)}>
                      <TableCell className="font-mono text-xs font-medium">
                        {o.tracking_code}
                      </TableCell>
                      <TableCell className="max-w-[160px] truncate">
                        {o.buyer_company ?? "—"}
                      </TableCell>
                      <TableCell className="hidden max-w-[220px] truncate text-muted-foreground md:table-cell">
                        {o.product_summary}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-right tabular-nums">
                        {o.quantity_cartons}
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusBadgeVariant(o.status)}>
                          {statusLabel(o.status, lang)}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden text-muted-foreground lg:table-cell">
                        {shortDate(o.created_at)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={!!liveSelected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-h-[85vh] max-w-xl overflow-y-auto">
          {liveSelected && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 font-mono text-base">
                  {liveSelected.tracking_code}
                  <Badge variant={statusBadgeVariant(liveSelected.status)}>
                    {statusLabel(liveSelected.status, lang)}
                  </Badge>
                </DialogTitle>
                <DialogDescription>
                  {liveSelected.buyer_company ?? "—"} · {liveSelected.quantity_cartons} {t.cartons}{" "}
                  · {dateTime(liveSelected.created_at)}
                </DialogDescription>
              </DialogHeader>

              <button
                type="button"
                className="inline-flex w-fit items-center gap-1.5 text-xs text-muted-foreground hover:text-primary"
                onClick={() => {
                  void navigator.clipboard.writeText(
                    `${window.location.origin}/forwarder/${liveSelected.forwarder_token}`,
                  );
                  toast.success(t.forwarderLinkCopied);
                }}
              >
                <Copy className="size-3" /> {t.copyForwarderLink}
              </button>

              <CheckpointForm order={liveSelected} />
            </>
          )}
        </DialogContent>
      </Dialog>
    </AdminShell>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Package;
  label: string;
  value: number;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 p-4">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
          <Icon className="size-4.5" strokeWidth={1.8} />
        </span>
        <div className="min-w-0">
          <div className="text-xl font-semibold tabular-nums leading-none text-foreground">
            {value}
          </div>
          <div className="mt-1 truncate text-xs text-muted-foreground">{label}</div>
        </div>
      </CardContent>
    </Card>
  );
}

function NewOrderForm({ onCreated }: { onCreated: () => void }) {
  const [busy, setBusy] = useState(false);
  const t = useT(COPY);
  const [f, setF] = useState({
    tracking_code: "",
    buyer_company: "",
    product_summary: "",
    quantity_cartons: 100,
    quantity_kg: 1000,
    incoterm: "DAP",
    origin_farm: "",
    destination: "Rungis, Paris",
  });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.from("orders").insert({
      tracking_code: f.tracking_code.trim().toUpperCase(),
      buyer_company: f.buyer_company.trim() || null,
      product_summary: f.product_summary.trim(),
      quantity_cartons: Number(f.quantity_cartons),
      quantity_kg: Number(f.quantity_kg),
      incoterm: f.incoterm,
      origin_farm: f.origin_farm.trim() || null,
      destination: f.destination.trim(),
      status: "processing",
    });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(t.orderCreated);
    setF({ ...f, tracking_code: "", product_summary: "" });
    onCreated();
  }

  return (
    <form className="space-y-4" onSubmit={submit}>
      <Row label={t.trackingCode}>
        <Input
          required
          maxLength={40}
          placeholder="SKN-2026-0148"
          value={f.tracking_code}
          onChange={(e) => setF({ ...f, tracking_code: e.target.value })}
        />
      </Row>
      <Row label={t.buyerCompany}>
        <Input
          maxLength={120}
          value={f.buyer_company}
          onChange={(e) => setF({ ...f, buyer_company: e.target.value })}
        />
      </Row>
      <Row label={t.productSummary}>
        <Input
          required
          maxLength={200}
          placeholder={t.productSummaryPlaceholder}
          value={f.product_summary}
          onChange={(e) => setF({ ...f, product_summary: e.target.value })}
        />
      </Row>
      <div className="grid grid-cols-2 gap-4">
        <Row label={t.cartonsLabel}>
          <Input
            type="number"
            min={1}
            value={f.quantity_cartons}
            onChange={(e) => setF({ ...f, quantity_cartons: Number(e.target.value) })}
          />
        </Row>
        <Row label={t.netKg}>
          <Input
            type="number"
            min={1}
            value={f.quantity_kg}
            onChange={(e) => setF({ ...f, quantity_kg: Number(e.target.value) })}
          />
        </Row>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Row label={t.incoterm}>
          <select
            value={f.incoterm}
            onChange={(e) => setF({ ...f, incoterm: e.target.value })}
            className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm"
          >
            <option>DAP</option>
            <option>DDP</option>
            <option>FOB</option>
          </select>
        </Row>
        <Row label={t.originFarm}>
          <Input
            maxLength={120}
            value={f.origin_farm}
            onChange={(e) => setF({ ...f, origin_farm: e.target.value })}
          />
        </Row>
      </div>
      <Row label={t.destination}>
        <Input
          maxLength={120}
          value={f.destination}
          onChange={(e) => setF({ ...f, destination: e.target.value })}
        />
      </Row>
      <Button type="submit" disabled={busy} className="w-full">
        {busy ? t.creating : t.createOrder}
      </Button>
    </form>
  );
}

function CheckpointForm({ order }: { order: AdminOrder }) {
  const [busy, setBusy] = useState(false);
  const { lang } = useLanguage();
  const t = useT(COPY);
  const [e, setE] = useState({
    checkpoint: STAGES[0]!.key,
    occurred_at: new Date().toISOString().slice(0, 16),
    location: "",
    reference: "",
    temperature_c: "",
    notes: "",
    document_label: "",
    document_url: "",
  });

  async function submit(ev: React.FormEvent) {
    ev.preventDefault();
    setBusy(true);
    const { error } = await supabase.from("tracking_events").insert({
      order_id: order.id,
      checkpoint: e.checkpoint,
      stage_index: stageIndex(e.checkpoint),
      status: "completed",
      occurred_at: new Date(e.occurred_at).toISOString(),
      location: e.location.trim() || null,
      reference: e.reference.trim() || null,
      temperature_c: e.temperature_c === "" ? null : Number(e.temperature_c),
      notes: e.notes.trim() || null,
      document_label: e.document_label.trim() || null,
      document_url: e.document_url.trim() || null,
    });

    if (!error) {
      const status =
        e.checkpoint === "delivered"
          ? "delivered"
          : ["in_transit", "arrival_rungis"].includes(e.checkpoint)
            ? "in_transit"
            : "processing";
      await supabase.from("orders").update({ status }).eq("id", order.id);
    }
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(t.checkpointLogged);
    setE({ ...e, reference: "", notes: "", document_label: "", document_url: "" });
  }

  return (
    <form
      className="mt-2 space-y-3 rounded-md border border-border bg-muted/30 p-4"
      onSubmit={submit}
    >
      <Row label={t.checkpoint}>
        <select
          value={e.checkpoint}
          onChange={(ev) => setE({ ...e, checkpoint: ev.target.value })}
          className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm"
        >
          {STAGES.map((s) => (
            <option key={s.key} value={s.key}>
              {s.label[lang]}
            </option>
          ))}
        </select>
      </Row>
      <div className="grid grid-cols-2 gap-3">
        <Row label={t.dateTime}>
          <Input
            type="datetime-local"
            value={e.occurred_at}
            onChange={(ev) => setE({ ...e, occurred_at: ev.target.value })}
          />
        </Row>
        <Row label={t.location}>
          <Input
            maxLength={120}
            value={e.location}
            onChange={(ev) => setE({ ...e, location: ev.target.value })}
          />
        </Row>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Row label={t.reference}>
          <Input
            maxLength={120}
            value={e.reference}
            onChange={(ev) => setE({ ...e, reference: ev.target.value })}
          />
        </Row>
        <Row label={t.tempC}>
          <Input
            type="number"
            step="0.1"
            value={e.temperature_c}
            onChange={(ev) => setE({ ...e, temperature_c: ev.target.value })}
          />
        </Row>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Row label={t.documentLabel}>
          <Input
            maxLength={120}
            value={e.document_label}
            onChange={(ev) => setE({ ...e, document_label: ev.target.value })}
          />
        </Row>
        <Row label={t.documentUrl}>
          <Input
            type="url"
            maxLength={600}
            value={e.document_url}
            onChange={(ev) => setE({ ...e, document_url: ev.target.value })}
          />
        </Row>
      </div>
      <Row label={t.notes}>
        <Textarea
          rows={2}
          maxLength={600}
          value={e.notes}
          onChange={(ev) => setE({ ...e, notes: ev.target.value })}
        />
      </Row>
      <Button type="submit" size="sm" disabled={busy}>
        {busy ? t.logging : t.logCheckpoint}
      </Button>
    </form>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}
