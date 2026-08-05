import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { getForwarderShipment, logForwarderCheckpoint } from "@/lib/forwarder.functions";
import { FORWARDER_STAGE_KEYS, STAGES, stageByKey } from "@/lib/checkpoints";
import { Timeline, type TrackingEvent } from "@/components/tracking/Timeline";
import { useLanguage, useT } from "@/lib/language";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/forwarder/$token")({
  head: () => ({
    meta: [
      { title: "Portail transitaire — Sokoni Export" },
      {
        name: "description",
        content:
          "Portail Sokoni Export restreint permettant au transitaire désigné d'enregistrer les étapes de dédouanement export, transit et arrivée à Rungis pour une commande.",
      },
      { property: "og:title", content: "Portail transitaire — Sokoni Export" },
      { property: "og:description", content: "Enregistrer les étapes de transit d'une commande." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ForwarderPortal,
});

const COPY = {
  fr: {
    loading: "Chargement de la commande…",
    invalidLink: "Ce lien d'accès n'est pas valide.",
    portalRestricted: "Portail transitaire · accès restreint",
    origin: "Origine",
    destination: "Destination",
    incoterm: "Incoterm",
    cartons: "Cartons",
    scopeNote:
      "Vous ne pouvez enregistrer que le segment transit. La tarification acheteur et les autres commandes ne sont pas accessibles depuis ce lien.",
    logCheckpoint: "Enregistrer une étape de transit",
    currentTimeline: "Timeline actuelle",
    checkpoint: "Étape",
    expected: "Attendu",
    dateTime: "Date & heure",
    location: "Lieu",
    locationPlaceholder: "JKIA Nairobi",
    reference: "Référence (réf. douane / AWB / navire)",
    documentLabel: "Libellé du document",
    documentUrl: "URL du document",
    notesEta: "Notes / ETA",
    logging: "Enregistrement…",
    logButton: "Enregistrer l'étape",
    successToast: "Étape enregistrée — la timeline de l'acheteur est mise à jour instantanément",
    errorToast: "Impossible d'enregistrer l'étape",
  },
  en: {
    loading: "Loading shipment…",
    invalidLink: "This access link is not valid.",
    portalRestricted: "Forwarder portal · restricted",
    origin: "Origin",
    destination: "Destination",
    incoterm: "Incoterm",
    cartons: "Cartons",
    scopeNote:
      "You can log the transit segment only. Buyer pricing and other shipments are not accessible from this link.",
    logCheckpoint: "Log a transit checkpoint",
    currentTimeline: "Current timeline",
    checkpoint: "Checkpoint",
    expected: "Expected",
    dateTime: "Date & time",
    location: "Location",
    locationPlaceholder: "JKIA Nairobi",
    reference: "Reference (customs ref / AWB / vessel)",
    documentLabel: "Document label",
    documentUrl: "Document URL",
    notesEta: "Notes / ETA",
    logging: "Logging…",
    logButton: "Log checkpoint",
    successToast: "Checkpoint logged — the buyer timeline updated instantly",
    errorToast: "Could not log the checkpoint",
  },
};

function ForwarderPortal() {
  const { token } = Route.useParams();
  const queryClient = useQueryClient();
  const t = useT(COPY);

  const { data, isLoading } = useQuery({
    queryKey: ["forwarder", token],
    queryFn: () => getForwarderShipment({ data: { token } }),
    retry: false,
  });

  if (isLoading) return <Note>{t.loading}</Note>;
  if (!data?.order) return <Note>{t.invalidLink}</Note>;

  const order = data.order;
  const events = (data.events ?? []) as TrackingEvent[];

  return (
    <div className="mx-auto max-w-4xl px-5 py-14">
      <p className="eyebrow">{t.portalRestricted}</p>
      <h1 className="stencil mt-3 text-3xl font-medium text-primary sm:text-4xl">
        {order.tracking_code}
      </h1>
      <p className="mt-3 text-muted-foreground">{order.product_summary}</p>
      <dl className="mt-6 grid grid-cols-2 gap-6 border-y border-border py-5 sm:grid-cols-4">
        <Fact label={t.origin} value={order.origin_farm ?? "Kenya"} />
        <Fact label={t.destination} value={order.destination} />
        <Fact label={t.incoterm} value={order.incoterm} />
        <Fact label={t.cartons} value={String(order.quantity_cartons)} />
      </dl>
      <p className="mt-4 text-xs text-muted-foreground">{t.scopeNote}</p>

      <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_1fr]">
        <section>
          <h2 className="eyebrow mb-4">{t.logCheckpoint}</h2>
          <CheckpointForm
            token={token}
            onDone={() => queryClient.invalidateQueries({ queryKey: ["forwarder", token] })}
          />
        </section>
        <section>
          <h2 className="eyebrow mb-6">{t.currentTimeline}</h2>
          <Timeline events={events} />
        </section>
      </div>
    </div>
  );
}

function CheckpointForm({ token, onDone }: { token: string; onDone: () => void }) {
  const [busy, setBusy] = useState(false);
  const { lang } = useLanguage();
  const t = useT(COPY);
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
      toast.success(t.successToast);
      setF({ ...f, reference: "", notes: "", document_label: "", document_url: "" });
      onDone();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t.errorToast);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="space-y-4 border border-border bg-card p-5" onSubmit={submit}>
      <Row label={t.checkpoint}>
        <select
          value={f.checkpoint}
          onChange={(e) => setF({ ...f, checkpoint: e.target.value })}
          className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm"
        >
          {STAGES.filter((s) => s.owner === "forwarder").map((s) => (
            <option key={s.key} value={s.key}>
              {s.label[lang]}
            </option>
          ))}
        </select>
      </Row>
      {stage?.fields && (
        <p className="text-xs text-muted-foreground">
          {t.expected}: {stage.fields[lang].join(" · ")}
        </p>
      )}
      <Row label={t.dateTime}>
        <Input
          type="datetime-local"
          value={f.occurred_at}
          onChange={(e) => setF({ ...f, occurred_at: e.target.value })}
        />
      </Row>
      <Row label={t.location}>
        <Input
          maxLength={120}
          placeholder={t.locationPlaceholder}
          value={f.location}
          onChange={(e) => setF({ ...f, location: e.target.value })}
        />
      </Row>
      <Row label={t.reference}>
        <Input
          maxLength={120}
          value={f.reference}
          onChange={(e) => setF({ ...f, reference: e.target.value })}
        />
      </Row>
      <div className="grid grid-cols-2 gap-3">
        <Row label={t.documentLabel}>
          <Input
            maxLength={120}
            value={f.document_label}
            onChange={(e) => setF({ ...f, document_label: e.target.value })}
          />
        </Row>
        <Row label={t.documentUrl}>
          <Input
            type="url"
            maxLength={600}
            value={f.document_url}
            onChange={(e) => setF({ ...f, document_url: e.target.value })}
          />
        </Row>
      </div>
      <Row label={t.notesEta}>
        <Textarea
          rows={2}
          maxLength={600}
          value={f.notes}
          onChange={(e) => setF({ ...f, notes: e.target.value })}
        />
      </Row>
      <Button type="submit" variant="clay" disabled={busy}>
        {busy ? t.logging : t.logButton}
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
  return (
    <p className="mx-auto max-w-2xl px-5 py-28 text-center text-muted-foreground">{children}</p>
  );
}
