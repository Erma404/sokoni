import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { Copy, Radio } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Timeline, DocumentList, RouteMap, currentStage, type TrackingEvent } from "@/components/tracking/Timeline";
import { STAGES } from "@/lib/checkpoints";
import { shortDate } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/tracking/StatusBadge";

export const Route = createFileRoute("/track/$code")({
  head: ({ params }) => ({
    meta: [
      { title: `Shipment ${params.code} — Sokoni Export` },
      {
        name: "description",
        content: `Live farm-to-Rungis tracking for Sokoni Export shipment ${params.code}, including certificates and cold-chain records.`,
      },
      { property: "og:title", content: `Shipment ${params.code} — Sokoni Export` },
      {
        property: "og:description",
        content: "Follow this shipment checkpoint by checkpoint, from the Kenyan farm to Rungis.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: TrackOrder,
});

interface OrderRow {
  id: string;
  tracking_code: string;
  buyer_company: string | null;
  product_summary: string;
  quantity_cartons: number;
  quantity_kg: number | null;
  incoterm: string;
  origin_farm: string | null;
  destination: string;
  status: string;
  created_at: string;
}

function TrackOrder() {
  const { code } = Route.useParams();
  const queryClient = useQueryClient();

  const orderQuery = useQuery({
    queryKey: ["track-order", code],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_order_by_code", { _code: code });
      if (error) throw error;
      return ((data as OrderRow[]) ?? [])[0] ?? null;
    },
  });

  const orderId = orderQuery.data?.id;

  const eventsQuery = useQuery({
    queryKey: ["track-events", orderId],
    enabled: Boolean(orderId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tracking_events")
        .select("*")
        .eq("order_id", orderId!)
        .order("stage_index", { ascending: true });
      if (error) throw error;
      return data as TrackingEvent[];
    },
  });

  // Live subscription — timeline updates the moment a checkpoint is logged.
  useEffect(() => {
    if (!orderId) return;
    const channel = supabase
      .channel(`tracking-${orderId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "tracking_events", filter: `order_id=eq.${orderId}` },
        () => {
          queryClient.invalidateQueries({ queryKey: ["track-events", orderId] });
          queryClient.invalidateQueries({ queryKey: ["track-order", code] });
          toast.success("Shipment updated");
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderId, code, queryClient]);

  if (orderQuery.isLoading) {
    return <Shell>Loading shipment…</Shell>;
  }

  if (!orderQuery.data) {
    return (
      <Shell>
        <p className="text-foreground">
          No shipment found for code <span className="font-mono">{code}</span>.
        </p>
        <Link to="/track" className="mt-4 inline-block text-clay underline underline-offset-4">
          Try another code
        </Link>
      </Shell>
    );
  }

  const order = orderQuery.data;
  const events = eventsQuery.data ?? [];
  const reached = currentStage(events);
  const progress = reached < 0 ? 0 : reached / (STAGES.length - 1);

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-6 border-b border-border pb-8">
        <div>
          <p className="eyebrow">Shipment</p>
          <h1 className="stencil mt-2 text-3xl font-medium text-primary sm:text-4xl">
            {order.tracking_code}
          </h1>
          <p className="mt-2 text-muted-foreground">{order.product_summary}</p>
        </div>
        <div className="flex flex-col items-start gap-3 sm:items-end">
          <StatusBadge status={order.status} />
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              void navigator.clipboard.writeText(window.location.href);
              toast.success("Tracking link copied");
            }}
          >
            <Copy className="size-3.5" />
            Copy shareable link
          </Button>
          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <Radio className="size-3 text-clay" />
            Live — updates without refresh
          </span>
        </div>
      </div>

      {/* Facts */}
      <dl className="grid grid-cols-2 gap-6 border-b border-border py-6 sm:grid-cols-5">
        <Fact label="Buyer" value={order.buyer_company || "—"} />
        <Fact label="Origin" value={order.origin_farm || "Kenya"} />
        <Fact label="Destination" value={order.destination} />
        <Fact label="Incoterm" value={order.incoterm} />
        <Fact
          label="Volume"
          value={`${order.quantity_cartons} cartons${order.quantity_kg ? ` · ${order.quantity_kg} kg` : ""}`}
        />
      </dl>

      <div className="mt-10 grid gap-12 lg:grid-cols-[1.4fr_1fr]">
        <section>
          <h2 className="eyebrow mb-6">Checkpoints</h2>
          <Timeline events={events} />
        </section>

        <aside className="space-y-10">
          <section>
            <h2 className="eyebrow mb-3">Route</h2>
            <RouteMap progress={progress} />
            <p className="mt-2 text-xs text-muted-foreground">
              Ordered {shortDate(order.created_at)} · {Math.round(progress * 100)}% of the route
              logged.
            </p>
          </section>

          <section>
            <h2 className="eyebrow mb-3">Shipment documents</h2>
            <DocumentList events={events} />
          </section>
        </aside>
      </div>
    </div>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto max-w-2xl px-5 py-24 text-sm text-muted-foreground">{children}</div>;
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="eyebrow">{label}</dt>
      <dd className="mt-1 text-sm text-foreground">{value}</dd>
    </div>
  );
}
