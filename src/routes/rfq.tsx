import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Check, Minus, Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { MIN_ORDER_KG, useRfq, useSession } from "@/lib/app-context";
import { eur } from "@/lib/format";
import { useT } from "@/lib/language";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import helpImg from "@/assets/farm-manager-portrait.jpg";

const HELVETICA = '"Helvetica Neue", Helvetica, Arial, sans-serif';

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

const INCOTERMS = [
  {
    value: "DAP",
    fr: { label: "DAP — Rendu au lieu de destination", body: "Nous livrons jusqu'à votre adresse. Vous gérez le dédouanement import." },
    en: { label: "DAP — Delivered at place", body: "We deliver to your address. You handle import customs clearance." },
    recommended: true,
  },
  {
    value: "DDP",
    fr: { label: "DDP — Rendu droits acquittés", body: "Nous gérons le dédouanement et les taxes import jusqu'à votre porte." },
    en: { label: "DDP — Delivered duty paid", body: "We handle customs clearance and import duties, door to door." },
    recommended: false,
  },
  {
    value: "FOB",
    fr: { label: "FOB — Franco à bord", body: "Vous prenez en charge le fret depuis le port d'embarquement kenyan." },
    en: { label: "FOB — Free on board", body: "You arrange freight from the Kenyan port of loading." },
    recommended: false,
  },
] as const;

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
    stepProducts: "Produits",
    stepReview: "Récapitulatif",
    stepDetails: "Coordonnées",
    stepOf: (n: number, total: number) => `Étape ${n} sur ${total}`,
    lines: "Votre sélection",
    emptyCart: "Votre panier de devis est vide.",
    browseCatalog: "Parcourir le catalogue",
    modify: "Modifier",
    deliveryTerms: "Conditions de livraison",
    recommended: "Recommandé",
    sampleOption: "Joindre une demande d'échantillon",
    sampleOptionBody:
      "Recommandé avant une première commande : notre équipe joint un kit d'échantillon à examiner avant confirmation.",
    indicativeTotal: "Total indicatif",
    perShipment: "par expédition",
    minimumReached: "Minimum atteint",
    belowMinimum: "Sous le minimum de commande",
    minLabel: "minimum",
    addMoreNote: (missing: number) => (
      <>
        Ajoutez <strong className="text-primary">{missing}kg</strong> de plus — n'importe quel mix
        de produits du catalogue compte pour ce seuil.
      </>
    ),
    noCommitment: "Demande de devis — aucun engagement, rien n'est facturé ici.",
    finalize: "Finaliser ma demande",
    addProducts: "Ajoutez des produits à votre devis",
    short: (missing: number, min: number) => `${missing}kg manquants sur le minimum de ${min}kg`,
    needHelpTitle: "Besoin d'aide ?",
    needHelpBody:
      "Volume atypique, calibre spécifique, première importation ? Notre bureau commercial vous aide à construire la bonne demande.",
    needHelpCta: "Nous contacter",
    back: "Retour",
    recapTitle: "Récapitulatif de votre demande",
    yourDetails: "Vos coordonnées",
    contactName: "Nom du contact",
    company: "Entreprise",
    email: "Email",
    country: "Pays",
    message: "Message",
    messagePlaceholder: "Fenêtre d'expédition, exigences de conditionnement, étiquetage…",
    sending: "Envoi…",
    sendQuote: "Envoyer la demande de devis",
    cartonsOf: (name: string) => `Cartons de ${name}`,
    removeItem: (name: string) => `Retirer ${name}`,
    weightOf: (kg: number) => `${kg}kg`,
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
    stepProducts: "Products",
    stepReview: "Review",
    stepDetails: "Your details",
    stepOf: (n: number, total: number) => `Step ${n} of ${total}`,
    lines: "Your selection",
    emptyCart: "Your RFQ is empty.",
    browseCatalog: "Browse the catalog",
    modify: "Edit",
    deliveryTerms: "Delivery terms",
    recommended: "Recommended",
    sampleOption: "Attach a sample request",
    sampleOptionBody:
      "Recommended before a first order: our team attaches a sample kit to review before confirmation.",
    indicativeTotal: "Indicative total",
    perShipment: "per shipment",
    minimumReached: "Minimum reached",
    belowMinimum: "Below shipment minimum",
    minLabel: "minimum",
    addMoreNote: (missing: number) => (
      <>
        Add <strong className="text-primary">{missing}kg</strong> more — any mix of products from
        the catalog counts toward the threshold.
      </>
    ),
    noCommitment: "Quote request — no commitment, nothing is charged here.",
    finalize: "Finalize my request",
    addProducts: "Add products to your RFQ",
    short: (missing: number, min: number) => `${missing}kg short of the ${min}kg minimum`,
    needHelpTitle: "Need help?",
    needHelpBody:
      "Unusual volume, a specific caliber, a first-time import? Our trade desk can help you build the right request.",
    needHelpCta: "Contact us",
    back: "Back",
    recapTitle: "Your request at a glance",
    yourDetails: "Your details",
    contactName: "Contact name",
    company: "Company",
    email: "Email",
    country: "Country",
    message: "Message",
    messagePlaceholder: "Shipping window, packaging requirements, labelling…",
    sending: "Sending…",
    sendQuote: "Send quote request",
    cartonsOf: (name: string) => `Cartons of ${name}`,
    removeItem: (name: string) => `Remove ${name}`,
    weightOf: (kg: number) => `${kg}kg`,
  },
};

type Step = "review" | "details";

function RfqPage() {
  const { items, setQty, remove, clear, estimate, totalWeightKg, meetsMinimum } = useRfq();
  const { user } = useSession();
  const t = useT(COPY);
  const [step, setStep] = useState<Step>("review");
  const [wantsSample, setWantsSample] = useState(true);
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

  // Guard: the cart can be emptied (e.g. from another tab) while the buyer
  // is on the details step — bounce back to the review step rather than
  // showing a contact form for nothing to quote.
  useEffect(() => {
    if (step === "details" && (items.length === 0 || !meetsMinimum)) {
      setStep("review");
    }
  }, [step, items.length, meetsMinimum]);

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
    const message = [
      form.message.trim(),
      wantsSample &&
        (t === COPY.fr
          ? "Merci de joindre un kit d'échantillon à cette demande avant confirmation."
          : "Please attach a sample kit to this request before confirmation."),
    ]
      .filter(Boolean)
      .join("\n\n");
    const { error } = await supabase.from("quote_requests").insert({
      buyer_id: user?.id ?? null,
      contact_name: form.contact_name.trim(),
      company: form.company.trim(),
      email: form.email.trim(),
      country: form.country.trim(),
      incoterm: form.incoterm,
      message: message || null,
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

  const stepNumber = step === "review" ? 2 : 3;

  return (
    <div className="mx-auto max-w-6xl px-5 py-14" style={{ fontFamily: HELVETICA }}>
      <p className="eyebrow">{t.quoteRequest}</p>
      <h1 className="mt-3 text-3xl font-normal tracking-[-0.02em] text-primary sm:text-4xl">
        {t.rfqCart}
      </h1>
      <p className="mt-4 max-w-2xl text-[#526158]">{t.intro}</p>

      <p className="mt-8 text-xs font-bold uppercase tracking-[0.08em] text-[#526158] lg:hidden">
        {t.stepOf(stepNumber, 3)}
      </p>

      <div className="mt-6 grid gap-10 lg:grid-cols-[220px_1.5fr_1fr] lg:gap-8">
        {/* Step rail */}
        <nav className="hidden lg:block">
          <ol className="sticky top-28 space-y-1">
            <StepRow done label={t.stepProducts} />
            <StepRow done={step === "details"} current={step === "review"} label={t.stepReview} />
            <StepRow current={step === "details"} label={t.stepDetails} />
          </ol>
        </nav>

        {/* Main content */}
        <div>
          {step === "review" ? (
            <ReviewStep
              t={t}
              items={items}
              setQty={setQty}
              remove={remove}
              form={form}
              setForm={setForm}
              wantsSample={wantsSample}
              setWantsSample={setWantsSample}
            />
          ) : (
            <DetailsStep
              t={t}
              items={items}
              estimate={estimate}
              form={form}
              setForm={setForm}
              submitting={submitting}
              onBack={() => setStep("review")}
              onSubmit={submit}
            />
          )}
        </div>

        {/* Sticky price / action sidebar */}
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-2xl bg-[#eff8f0] p-6">
            <p className="text-xs font-bold uppercase tracking-[0.08em] text-[#3c6b52]">
              {t.indicativeTotal}
            </p>
            <p className="mt-2 text-4xl font-normal tracking-[-0.02em] text-[#123323]">
              {eur(estimate)}
            </p>
            <p className="text-xs text-[#3c6b52]">{t.perShipment}</p>

            <div className="mt-5 border-t border-[#c8ddc9] pt-5">
              <div className="flex items-baseline justify-between text-sm">
                <span
                  className={cn(
                    "font-semibold",
                    meetsMinimum ? "text-[#123323]" : "text-[#a44335]",
                  )}
                >
                  {meetsMinimum ? t.minimumReached : t.belowMinimum}
                </span>
                <span className="tabular-nums text-[#3c6b52]">
                  {totalWeightKg}kg / {MIN_ORDER_KG}kg
                </span>
              </div>
              <Progress
                value={Math.min(100, (totalWeightKg / MIN_ORDER_KG) * 100)}
                className="mt-2"
              />
              {!meetsMinimum && items.length > 0 && (
                <p className="mt-3 text-xs leading-relaxed text-[#3c6b52]">
                  {t.addMoreNote(MIN_ORDER_KG - totalWeightKg)}
                </p>
              )}
            </div>

            {step === "review" && (
              <Button
                type="button"
                variant="cta"
                className="mt-6 w-full"
                disabled={!items.length || !meetsMinimum}
                onClick={() => setStep("details")}
              >
                {!items.length
                  ? t.addProducts
                  : !meetsMinimum
                    ? t.short(MIN_ORDER_KG - totalWeightKg, MIN_ORDER_KG)
                    : t.finalize}
                {items.length > 0 && meetsMinimum && <ArrowRight className="size-4" />}
              </Button>
            )}

            <p className="mt-4 text-center text-[11px] leading-relaxed text-[#3c6b52]">
              {t.noCommitment}
            </p>
          </div>

          {/* Besoin d'aide */}
          <div className="mt-4 overflow-hidden rounded-2xl bg-[#f4f4f2]">
            <div className="aspect-[2.4] overflow-hidden">
              <img src={helpImg} alt="" aria-hidden className="h-full w-full object-cover" />
            </div>
            <div className="p-6">
              <h3 className="text-lg font-normal tracking-[-0.01em] text-[#142b21]">
                {t.needHelpTitle}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#526158]">{t.needHelpBody}</p>
              <Link
                to="/contact"
                className="mt-4 inline-block rounded-full bg-[#0a4934] px-5 py-2.5 text-xs font-bold text-white"
              >
                {t.needHelpCta}
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function StepRow({
  label,
  done,
  current,
}: {
  label: string;
  done?: boolean;
  current?: boolean;
}) {
  return (
    <li className="flex items-center gap-3 py-2">
      <span
        className={cn(
          "flex size-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold",
          done
            ? "bg-[#0a4934] text-white"
            : current
              ? "border-2 border-[#0a4934] text-[#0a4934]"
              : "border border-[#d5d5cf] text-[#a2ada4]",
        )}
      >
        {done ? <Check className="size-3.5" /> : null}
      </span>
      <span
        className={cn(
          "text-sm",
          current ? "font-semibold text-[#142b21]" : done ? "text-[#526158]" : "text-[#a2ada4]",
        )}
      >
        {label}
      </span>
    </li>
  );
}

interface ReviewStepProps {
  t: (typeof COPY)["fr"];
  items: ReturnType<typeof useRfq>["items"];
  setQty: ReturnType<typeof useRfq>["setQty"];
  remove: ReturnType<typeof useRfq>["remove"];
  form: { incoterm: string };
  setForm: React.Dispatch<React.SetStateAction<any>>;
  wantsSample: boolean;
  setWantsSample: (v: boolean) => void;
}

function ReviewStep({
  t,
  items,
  setQty,
  remove,
  form,
  setForm,
  wantsSample,
  setWantsSample,
}: ReviewStepProps) {
  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-xs font-bold uppercase tracking-[0.08em] text-[#526158]">{t.lines}</h2>
        {items.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-dashed border-[#d5d5cf] p-10 text-center text-sm text-[#526158]">
            {t.emptyCart}{" "}
            <Link to="/catalog" className="text-clay underline underline-offset-4">
              {t.browseCatalog}
            </Link>
            .
          </div>
        ) : (
          <ul className="mt-4 space-y-3">
            {items.map((i) => (
              <li
                key={i.productId}
                className="flex flex-wrap items-center gap-4 rounded-2xl border border-[#d5d5cf] bg-white p-4"
              >
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-bold text-[#142b21]">{i.name}</div>
                  <div className="text-xs text-[#526158]">
                    {i.packaging} · calibre {i.caliber} · {t.weightOf(i.cartons * i.netWeightKg)}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 rounded-full border border-[#d5d5cf] px-1 py-1">
                  <button
                    type="button"
                    onClick={() => setQty(i.productId, i.cartons - 1)}
                    aria-label="-"
                    className="flex size-6 items-center justify-center rounded-full text-[#526158] hover:bg-[#f6f8f7]"
                  >
                    <Minus className="size-3.5" />
                  </button>
                  <span className="w-6 text-center text-sm tabular-nums">{i.cartons}</span>
                  <button
                    type="button"
                    onClick={() => setQty(i.productId, i.cartons + 1)}
                    aria-label="+"
                    className="flex size-6 items-center justify-center rounded-full text-[#526158] hover:bg-[#f6f8f7]"
                  >
                    <Plus className="size-3.5" />
                  </button>
                </div>
                <div className="w-24 text-right text-sm font-semibold tabular-nums text-[#a44335]">
                  {eur(i.cartons * i.pricePerCarton)}
                </div>
                <button
                  onClick={() => remove(i.productId)}
                  aria-label={t.removeItem(i.name)}
                  className="text-[#a2ada4] transition-colors hover:text-[#a44335]"
                >
                  <Trash2 className="size-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {items.length > 0 && (
        <>
          <section>
            <h2 className="text-xs font-bold uppercase tracking-[0.08em] text-[#526158]">
              {t.deliveryTerms}
            </h2>
            <RadioGroup
              value={form.incoterm}
              onValueChange={(v) => setForm((f: any) => ({ ...f, incoterm: v }))}
              className="mt-4 space-y-3"
            >
              {INCOTERMS.map((opt) => {
                const copy = t === COPY.fr ? opt.fr : opt.en;
                const active = form.incoterm === opt.value;
                return (
                  <label
                    key={opt.value}
                    className={cn(
                      "flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-colors",
                      active ? "border-[#0a4934] bg-[#eff8f0]" : "border-[#d5d5cf] bg-white",
                    )}
                  >
                    <RadioGroupItem value={opt.value} className="mt-0.5" />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-bold text-[#142b21]">{copy.label}</span>
                        {opt.recommended && (
                          <span className="rounded-full bg-[#0a4934] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                            {t.recommended}
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-xs leading-relaxed text-[#526158]">{copy.body}</p>
                    </div>
                  </label>
                );
              })}
            </RadioGroup>
          </section>

          <section>
            <label
              className={cn(
                "flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-colors",
                wantsSample ? "border-[#0a4934] bg-[#eff8f0]" : "border-[#d5d5cf] bg-white",
              )}
            >
              <Checkbox
                checked={wantsSample}
                onCheckedChange={(v) => setWantsSample(Boolean(v))}
                className="mt-0.5"
              />
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-bold text-[#142b21]">{t.sampleOption}</span>
                  <span className="rounded-full bg-[#0a4934] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                    {t.recommended}
                  </span>
                </div>
                <p className="mt-1 text-xs leading-relaxed text-[#526158]">{t.sampleOptionBody}</p>
              </div>
            </label>
          </section>
        </>
      )}
    </div>
  );
}

interface DetailsStepProps {
  t: (typeof COPY)["fr"];
  items: ReturnType<typeof useRfq>["items"];
  estimate: number;
  form: {
    contact_name: string;
    company: string;
    email: string;
    country: string;
    incoterm: string;
    message: string;
  };
  setForm: React.Dispatch<React.SetStateAction<any>>;
  submitting: boolean;
  onBack: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

function DetailsStep({
  t,
  items,
  estimate,
  form,
  setForm,
  submitting,
  onBack,
  onSubmit,
}: DetailsStepProps) {
  return (
    <div>
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.08em] text-[#526158] hover:text-[#0a4934]"
      >
        <ArrowLeft className="size-3.5" />
        {t.back}
      </button>

      <div className="mt-5 rounded-2xl border border-[#d5d5cf] bg-white p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#142b21]">{t.recapTitle}</h2>
          <button
            type="button"
            onClick={onBack}
            className="text-xs font-semibold text-clay underline underline-offset-4"
          >
            {t.modify}
          </button>
        </div>
        <ul className="mt-3 space-y-1.5">
          {items.map((i) => (
            <li key={i.productId} className="flex items-center justify-between text-sm">
              <span className="text-[#526158]">
                {i.name} <span className="text-[#a2ada4]">· {i.cartons}×</span>
              </span>
              <span className="tabular-nums text-[#142b21]">
                {eur(i.cartons * i.pricePerCarton)}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-3 flex items-center justify-between border-t border-[#d5d5cf] pt-3 text-sm font-bold">
          <span className="text-[#142b21]">{t.indicativeTotal}</span>
          <span className="text-[#a44335]">{eur(estimate)}</span>
        </div>
      </div>

      <h2 className="mt-8 text-xs font-bold uppercase tracking-[0.08em] text-[#526158]">
        {t.yourDetails}
      </h2>
      <form className="mt-4 space-y-4" onSubmit={onSubmit}>
        <Field label={t.contactName} required>
          <Input
            required
            maxLength={100}
            value={form.contact_name}
            onChange={(e) => setForm((f: any) => ({ ...f, contact_name: e.target.value }))}
          />
        </Field>
        <Field label={t.company} required>
          <Input
            required
            maxLength={120}
            value={form.company}
            onChange={(e) => setForm((f: any) => ({ ...f, company: e.target.value }))}
          />
        </Field>
        <Field label={t.email} required>
          <Input
            required
            type="email"
            maxLength={180}
            value={form.email}
            onChange={(e) => setForm((f: any) => ({ ...f, email: e.target.value }))}
          />
        </Field>
        <Field label={t.country}>
          <Input
            maxLength={80}
            value={form.country}
            onChange={(e) => setForm((f: any) => ({ ...f, country: e.target.value }))}
          />
        </Field>
        <Field label={t.message}>
          <Textarea
            maxLength={600}
            rows={4}
            placeholder={t.messagePlaceholder}
            value={form.message}
            onChange={(e) => setForm((f: any) => ({ ...f, message: e.target.value }))}
          />
        </Field>
        <Button type="submit" variant="cta" className="w-full" disabled={submitting}>
          {submitting ? t.sending : t.sendQuote}
          {!submitting && <ArrowRight className="size-4" />}
        </Button>
      </form>
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
