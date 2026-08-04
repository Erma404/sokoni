import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { getForwarderShipment, logForwarderCheckpoint } from "@/lib/forwarder.functions";
import { FORWARDER_STAGE_KEYS, STAGES, stageByKey } from "@/lib/checkpoints";
import { Timeline, type TrackingEvent } from "@/components/tracking/Timeline";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/forwarder/$token")({
  head: () => ({
    meta: [
      { title: "Forwarder Portal — Sokoni Export" },
      {
        name: "description",
        content:
          "Restricted Sokoni Export portal for the appointed freight forwarder to log export clearance, transit and Rungis arrival checkpoints for a single shipment.",
      },
      { property: "og:title", content: "Forwarder Portal — Sokoni Export" },
      { property: "og:description", content: "Log transit checkpoints for one shipment." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ForwarderPortal,
});

function ForwarderPortal() {
  const { token } = Route.useParams();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["forwarder", token],
    queryFn: () => getForwarderShipment({ data: { token } }),
    retry: false,
  });

  if (isLoading) return <Note>Loading shipment…</Note>;
  if (!data?.order) return <Note>This access link is not valid.</Note>;

  const order = data.order;
  const events = (data.events ?? []) as TrackingEvent[];

  return (
    <div className="mx-auto max-w-4xl px-5 py-14">
      <p className="eyebrow">Forwarder portal · restricted</p>
      <h1 className="stencil mt-3 text-3xl font-medium text-primary sm:text-4xl">
        {order.tracking_code}
      </h1>
      <p className="mt-3 text-muted-foreground">{order.product_summary}</p>
      <dl className="mt-6 grid grid-cols-2 gap-6 border-y border-border py-5 sm:grid-cols-4">
        <Fact label="Origin" value={order.origin_farm ?? "Kenya"} />
        <Fact label="Destination" value={order.destination} />
        <Fact label="Incoterm" value={order.incoterm} />
        <Fact label="Cartons" value={String(order.quantity_cartons)} />
      </dl>
      <p className="mt-4 text-xs text-muted-foreground">
        You can log the transit segment only. Buyer pricing and other shipments are not accessible
        from this link.
      </p>

      <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_1fr]">
        <section>
          <h2 className="eyebrow mb-4">Log a transit checkpoint</h2>
          <CheckpointForm
            token={token}
            onDone={() => queryClient.invalidateQueries({ queryKey: ["forwarder", token] })}
          />
        </section>
        <section>
          <h2 className="eyebrow mb-6">Current timeline</h2>
          <Timeline events={events} />
        </section>
      </div>
    </div>
  );
}

function CheckpointForm({ token, onDone }: { token: string; onDone: () => void }) {
  const [busy, setBusy] = useState(false);
  const [f, setF] = useState({
    checkpoint: FORWARDER_STAGE_KEYS[0]!,
    occurred_at: new Date().toISOString().slice(0, 16),
    location: "",
    reference: "",
    notes: "",
    document_label: "",
    document_url: "",
  });

  const stage = stageByKey(f.checkpoint);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      await logForwarderCheckpoint({ data: { ...f, token } });
      toast.success("Checkpoint logged — the buyer timeline updated instantly");
      setF({ ...f, reference: "", notes: "", document_label: "", document_url: "" });
      onDone();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not log the checkpoint");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="space-y-4 border border-border bg-card p-5" onSubmit={submit}>
      <Row label="Checkpoint">
        <select
          value={f.checkpoint}
          onChange={(e) => setF({ ...f, checkpoint: e.target.value })}
          className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm"
        >
          {STAGES.filter((s) => s.owner === "forwarder").map((s) => (
            <option key={s.key} value={s.key}>
              {s.label}
            </option>
          ))}
        </select>
      </Row>
      {stage?.fields && (
        <p className="text-xs text-muted-foreground">Expected: {stage.fields.join(" · ")}</p>
      )}
      <Row label="Date & time">
        <Input
          type="datetime-local"
          value={f.occurred_at}
          onChange={(e) => setF({ ...f, occurred_at: e.target.value })}
        />
      </Row>
      <Row label="Location">
        <Input
          maxLength={120}
          placeholder="JKIA Nairobi"
          value={f.location}
          onChange={(e) => setF({ ...f, location: e.target.value })}
        />
      </Row>
      <Row label="Reference (customs ref / AWB / vessel)">
        <Input
          maxLength={120}
          value={f.reference}
          onChange={(e) => setF({ ...f, reference: e.target.value })}
        />
      </Row>
      <div className="grid grid-cols-2 gap-3">
        <Row label="Document label">
          <Input
            maxLength={120}
            value={f.document_label}
            onChange={(e) => setF({ ...f, document_label: e.target.value })}
          />
        </Row>
        <Row label="Document URL">
          <Input
            type="url"
            maxLength={600}
            value={f.document_url}
            onChange={(e) => setF({ ...f, document_url: e.target.value })}
          />
        </Row>
      </div>
      <Row label="Notes / ETA">
        <Textarea
          rows={2}
          maxLength={600}
          value={f.notes}
          onChange={(e) => setF({ ...f, notes: e.target.value })}
        />
      </Row>
      <Button type="submit" variant="clay" disabled={busy}>
        {busy ? "Logging…" : "Log checkpoint"}
      </Button>
    </form>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="eyebrow">{label}</Label>
      {children}
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="eyebrow">{label}</dt>
      <dd className="mt-1 text-sm text-foreground">{value}</dd>
    </div>
  );
}

function Note({ children }: { children: React.ReactNode }) {
  return <p className="mx-auto max-w-2xl px-5 py-28 text-center text-muted-foreground">{children}</p>;
}
