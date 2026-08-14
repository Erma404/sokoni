import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowRight, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { MIN_ORDER_KG, useRfq, useSession } from "@/lib/app-context";
import { eur } from "@/lib/format";
import { useT } from "@/lib/language";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";

export const Route = createFileRoute("/rfq")({
  head: () => ({
    meta: [
      { title: "Demander un devis — Sokoni Export" },
      {
        name: "description",
        content:
          "Constituez une demande de devis pour des lots d'avocat Hass kenyan. Tarification commerciale sur devis par volume et Incoterm ; notre bureau répond sous un jour ouvré.",
      },
      { property: "og:title", content: "Demander un devis — Sokoni Export" },
      {
        property: "og:description",
        content:
          "Envoyez vos volumes et l'Incoterm — nous répondons avec une offre ferme sous un jour ouvré.",
      },
    ],
  }),
  component: RfqPage,
});

const COPY = {
  fr: {
    addOneProduct: "Ajoutez au moins un produit à votre devis",
    minRequired: (min: number) => `${min}kg minimum par commande requis pour soumettre`,
    rfqReceived: "Devis reçu",
    thankYou: "Merci",
    thankYouBody:
      "Notre bureau commercial revient vers vous sous un jour ouvré avec une offre ferme, une fenêtre d'expédition et le dossier documentaire.",
    backToCatalog: "Retour au catalogue",
    quoteRequest: "Demande de devis",
    rfqCart: "Panier de devis",
    intro:
      "Pas de commande instantanée — la production et la tarification commerciale se négocient par lot. Dites-nous ce dont vous avez besoin, nous répondons avec une offre ferme.",
    lines: "Lignes",
    emptyCart: "Votre panier de devis est vide.",
    browseCatalog: "Parcourir le catalogue",
    indicativeTotal: "Total indicatif",
    minimumReached: "Minimum atteint",
    belowMinimum: "Sous le minimum de commande",
    minLabel: "minimum",
    addMoreNote: (missing: number) => (
      <>
        {MIN_ORDER_KG}kg minimum par commande requis pour soumettre. Ajoutez{" "}
        <strong className="text-primary">{missing}kg</strong> de plus — n'importe quel mix de
        produits du catalogue compte pour ce seuil.
      </>
    ),
    yourDetails: "Vos coordonnées",
    contactName: "Nom du contact",
    company: "Entreprise",
    email: "Email",
    country: "Pays",
    incoterm: "Incoterm",
    message: "Message",
    messagePlaceholder: "Fenêtre d'expédition, exigences de conditionnement, étiquetage…",
    sending: "Envoi…",
    addProducts: "Ajoutez des produits à votre devis",
    short: (missing: number, min: number) => `${missing}kg manquants sur le minimum de ${min}kg`,
    sendQuote: "Envoyer la demande de devis",
    cartonsOf: (name: string) => `Cartons de ${name}`,
    removeItem: (name: string) => `Retirer ${name}`,
  },
  en: {
    addOneProduct: "Add at least one product to your RFQ",
    minRequired: (min: number) => `${min}kg minimum per shipment required to submit an order`,
    rfqReceived: "RFQ received",
    thankYou: "Thank you",
    thankYouBody:
      "Our trade desk will come back to you within one working day with a firm offer, shipping window and documentation pack.",
    backToCatalog: "Back to catalog",
    quoteRequest: "Quote request",
    rfqCart: "RFQ cart",
    intro:
      "No instant checkout — production and trade pricing are negotiated per lot. Tell us what you need and we answer with a firm offer.",
    lines: "Lines",
    emptyCart: "Your RFQ is empty.",
    browseCatalog: "Browse the catalog",
    indicativeTotal: "Indicative total",
    minimumReached: "Minimum reached",
    belowMinimum: "Below shipment minimum",
    minLabel: "minimum",
    addMoreNote: (missing: number) => (
      <>
        {MIN_ORDER_KG}kg minimum per shipment required to submit an order. Add{" "}
        <strong className="text-primary">{missing}kg</strong> more — any mix of products from the
        catalog counts toward the threshold.
      </>
    ),
    yourDetails: "Your details",
    contactName: "Contact name",
    company: "Company",
    email: "Email",
    country: "Country",
    incoterm: "Incoterm",
    message: "Message",
    messagePlaceholder: "Shipping window, packaging requirements, labelling…",
    sending: "Sending…",
    addProducts: "Add products to your RFQ",
    short: (missing: number, min: number) => `${missing}kg short of the ${min}kg minimum`,
    sendQuote: "Send quote request",
    cartonsOf: (name: string) => `Cartons of ${name}`,
    removeItem: (name: string) => `Remove ${name}`,
  },
};

function RfqPage() {
  const { items, setQty, remove, clear, estimate, totalWeightKg, meetsMinimum } = useRfq();
  const { user } = useSession();
  const t = useT(COPY);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    contact_name: "",
    company: "",
    email: user?.email ?? "",
    country: "France",
    incoterm: "DAP",
    message: "",
  });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!items.length) {
      toast.error(t.addOneProduct);
      return;
    }
    if (!meetsMinimum) {
      toast.error(t.minRequired(MIN_ORDER_KG));
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("quote_requests").insert({
      buyer_id: user?.id ?? null,
      contact_name: form.contact_name.trim(),
      company: form.company.trim(),
      email: form.email.trim(),
      country: form.country.trim(),
      incoterm: form.incoterm,
      message: form.message.trim() || null,
      items: items.map((i) => ({
        product_id: i.productId,
        name: i.name,
        caliber: i.caliber,
        packaging: i.packaging,
        cartons: i.cartons,
        weight_kg: i.cartons * i.netWeightKg,
      })),
    });
    setSubmitting(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    clear();
    setSent(true);
  }

  if (sent) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-28 text-center">
        <p className="eyebrow">{t.rfqReceived}</p>
        <h1 className="stencil mt-3 text-3xl font-medium text-primary">{t.thankYou}</h1>
        <p className="mt-4 text-muted-foreground">{t.thankYouBody}</p>
        <Link to="/catalog" className="mt-8 inline-block">
          <Button variant="outline">{t.backToCatalog}</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-14">
      <p className="eyebrow">{t.quoteRequest}</p>
      <h1 className="stencil mt-3 text-3xl font-medium text-primary sm:text-4xl">{t.rfqCart}</h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">{t.intro}</p>

      <div className="mt-10 grid gap-12 lg:grid-cols-[1.2fr_1fr]">
        <section>
          <h2 className="eyebrow mb-4">{t.lines}</h2>
          {items.length === 0 ? (
            <div className="border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
              {t.emptyCart}{" "}
              <Link to="/catalog" className="text-clay underline underline-offset-4">
                {t.browseCatalog}
              </Link>
              .
            </div>
          ) : (
            <ul className="divide-y divide-border border-y border-border">
              {items.map((i) => (
                <li key={i.productId} className="flex flex-wrap items-center gap-4 py-4">
                  <div className="min-w-0 flex-1">
                    <div className="stencil text-sm font-medium">{i.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {i.packaging} · caliber {i.caliber} · {i.cartons * i.netWeightKg}kg
                    </div>
                  </div>
                  <Input
                    type="number"
                    min={1}
                    value={i.cartons}
                    onChange={(e) => setQty(i.productId, Number(e.target.value))}
                    className="w-24"
                    aria-label={t.cartonsOf(i.name)}
                  />
                  <div className="w-24 text-right text-sm tabular-nums">
                    {eur(i.cartons * i.pricePerCarton)}
                  </div>
                  <button
                    onClick={() => remove(i.productId)}
                    aria-label={t.removeItem(i.name)}
                    className="text-muted-foreground transition-colors hover:text-destructive"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
          {items.length > 0 && (
            <>
              <div className="mt-4 flex items-baseline justify-between">
                <span className="eyebrow">{t.indicativeTotal}</span>
                <span className="stencil text-xl font-medium text-clay">{eur(estimate)}</span>
              </div>

              <div
                className={`mt-6 border p-4 ${
                  meetsMinimum ? "border-border bg-secondary" : "border-clay/40 bg-clay/5"
                }`}
              >
                <div className="flex items-baseline justify-between text-sm">
                  <span
                    className={meetsMinimum ? "font-medium text-primary" : "font-medium text-clay"}
                  >
                    {meetsMinimum ? t.minimumReached : t.belowMinimum}
                  </span>
                  <span className="tabular-nums text-muted-foreground">
                    {totalWeightKg}kg / {MIN_ORDER_KG}kg {t.minLabel}
                  </span>
                </div>
                <Progress
                  value={Math.min(100, (totalWeightKg / MIN_ORDER_KG) * 100)}
                  className="mt-2"
                />
                {!meetsMinimum && (
                  <p className="mt-3 text-sm text-muted-foreground">
                    {t.addMoreNote(MIN_ORDER_KG - totalWeightKg)}
                  </p>
                )}
              </div>
            </>
          )}
        </section>

        <section>
          <h2 className="eyebrow mb-4">{t.yourDetails}</h2>
          <form className="space-y-4" onSubmit={submit}>
            <Field label={t.contactName} required>
              <Input
                required
                maxLength={100}
                value={form.contact_name}
                onChange={(e) => setForm({ ...form, contact_name: e.target.value })}
              />
            </Field>
            <Field label={t.company} required>
              <Input
                required
                maxLength={120}
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
              />
            </Field>
            <Field label={t.email} required>
              <Input
                required
                type="email"
                maxLength={180}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label={t.country}>
                <Input
                  maxLength={80}
                  value={form.country}
                  onChange={(e) => setForm({ ...form, country: e.target.value })}
                />
              </Field>
              <Field label={t.incoterm}>
                <select
                  value={form.incoterm}
                  onChange={(e) => setForm({ ...form, incoterm: e.target.value })}
                  className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm"
                >
                  <option>DAP</option>
                  <option>DDP</option>
                  <option>FOB</option>
                </select>
              </Field>
            </div>
            <Field label={t.message}>
              <Textarea
                maxLength={600}
                rows={4}
                placeholder={t.messagePlaceholder}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />
            </Field>
            <Button
              type="submit"
              variant="lime"
              className="w-full"
              disabled={submitting || !items.length || !meetsMinimum}
            >
              {submitting
                ? t.sending
                : !items.length
                  ? t.addProducts
                  : !meetsMinimum
                    ? t.short(MIN_ORDER_KG - totalWeightKg, MIN_ORDER_KG)
                    : t.sendQuote}
              {!submitting && items.length > 0 && meetsMinimum && <ArrowRight className="size-4" />}
            </Button>
          </form>
        </section>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
  required,
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="eyebrow">
        {label}
        {required && <span className="text-clay"> *</span>}
      </Label>
      {children}
    </div>
  );
}
