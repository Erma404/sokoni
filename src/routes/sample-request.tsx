import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/lib/app-context";
import { useT } from "@/lib/language";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import sampleImg from "@/assets/avocado-handful.jpg";

export const Route = createFileRoute("/sample-request")({
  head: () => ({
    meta: [
      { title: "Demander un échantillon — Sokoni Export" },
      {
        name: "description",
        content:
          "Demandez un kit d'échantillon d'avocat Hass pour évaluation. Pas de minimum de commande — un kit par demande, examiné par notre bureau commercial.",
      },
      { property: "og:title", content: "Demander un échantillon — Sokoni Export" },
      {
        property: "og:description",
        content:
          "Un kit d'échantillon par demande, sans MOQ. Notre équipe examine chaque demande manuellement.",
      },
    ],
  }),
  component: SampleRequestPage,
});

const COPY = {
  fr: {
    selectProduct: "Sélectionnez au moins un produit à échantillonner",
    received: "Demande reçue",
    thankYou: "Merci",
    thankYouBody:
      "Notre équipe examine chaque demande d'échantillon à la main et revient vers vous rapidement pour confirmer les détails d'expédition. Un kit par demande — aucun minimum de commande ne s'applique.",
    backToCatalog: "Retour au catalogue",
    buyerEvaluation: "Évaluation acheteur",
    title: "Demander un échantillon",
    intro:
      "Un kit d'échantillon par demande, sans minimum de commande — c'est un flux séparé du panier de devis tarifé. Dites-nous quelles lignes vous souhaitez évaluer et notre équipe examine la demande à la main.",
    productsOfInterest: "Produit(s) d'intérêt",
    contactName: "Nom du contact",
    company: "Entreprise",
    email: "Email",
    phone: "Téléphone",
    shippingAddress: "Adresse de livraison",
    streetAddress: "Adresse",
    city: "Ville",
    postalCode: "Code postal",
    country: "Pays",
    notes: "Notes",
    notesPlaceholder: "Toute information utile à notre équipe avant l'envoi du kit…",
    sending: "Envoi…",
    submit: "Envoyer la demande d'échantillon",
  },
  en: {
    selectProduct: "Select at least one product you'd like to sample",
    received: "Sample request received",
    thankYou: "Thank you",
    thankYouBody:
      "Our team reviews every sample request by hand and will come back to you shortly to confirm shipping details. One kit per request — no minimum order applies.",
    backToCatalog: "Back to catalog",
    buyerEvaluation: "Buyer evaluation",
    title: "Request a sample",
    intro:
      "One sample kit per request, no minimum order — this is a separate flow from the priced RFQ cart. Tell us which lines you'd like to evaluate and our team reviews the request by hand.",
    productsOfInterest: "Product(s) of interest",
    contactName: "Contact name",
    company: "Company",
    email: "Email",
    phone: "Phone",
    shippingAddress: "Shipping address",
    streetAddress: "Street address",
    city: "City",
    postalCode: "Postal code",
    country: "Country",
    notes: "Notes",
    notesPlaceholder: "Anything our team should know before shipping the kit…",
    sending: "Sending…",
    submit: "Submit sample request",
  },
};

interface ProductOption {
  id: string;
  name: string;
  caliber: string;
  packaging: string;
}

function SampleRequestPage() {
  const { user } = useSession();
  const t = useT(COPY);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [productIds, setProductIds] = useState<string[]>([]);
  const [form, setForm] = useState({
    contact_name: "",
    company: "",
    email: user?.email ?? "",
    phone: "",
    address_line: "",
    city: "",
    postal_code: "",
    country: "France",
    notes: "",
  });

  const { data: products = [] } = useQuery({
    queryKey: ["products", "sample-eligible"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id,name,caliber,packaging")
        .neq("packaging", "Sample kit")
        .order("name", { ascending: true });
      if (error) throw error;
      return data as ProductOption[];
    },
  });

  function toggleProduct(id: string) {
    setProductIds((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (productIds.length === 0) {
      toast.error(t.selectProduct);
      return;
    }
    setSubmitting(true);
    const selected = products.filter((p) => productIds.includes(p.id));
    // Sample requests reuse the quote_requests table (no cartons/pricing, no
    // 400kg floor) — incoterm "SAMPLE" flags them for manual review, distinct
    // from priced RFQs, without needing a schema change.
    const { error } = await supabase.from("quote_requests").insert({
      buyer_id: user?.id ?? null,
      contact_name: form.contact_name.trim(),
      company: form.company.trim(),
      email: form.email.trim(),
      country: form.country.trim(),
      incoterm: "SAMPLE",
      message: [
        form.phone.trim() && `Phone: ${form.phone.trim()}`,
        `Shipping address: ${form.address_line.trim()}, ${form.city.trim()} ${form.postal_code.trim()}, ${form.country.trim()}`,
        form.notes.trim() && `Notes: ${form.notes.trim()}`,
      ]
        .filter(Boolean)
        .join("\n"),
      items: [
        {
          type: "sample_request",
          kits: 1,
          products: selected.map((p) => ({
            product_id: p.id,
            name: p.name,
            caliber: p.caliber,
            packaging: p.packaging,
          })),
        },
      ],
    });
    setSubmitting(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setSent(true);
  }

  if (sent) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-28 text-center">
        <p className="eyebrow">{t.received}</p>
        <h1 className="stencil mt-3 text-3xl font-medium text-primary">{t.thankYou}</h1>
        <p className="mt-4 text-muted-foreground">{t.thankYouBody}</p>
        <Link to="/catalog" className="mt-8 inline-block">
          <Button variant="outline">{t.backToCatalog}</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-14 sm:py-20">
      <div className="grid gap-10 md:grid-cols-[1fr_0.8fr] md:items-center">
        <div className="max-w-2xl">
          <p className="eyebrow">{t.buyerEvaluation}</p>
          <h1 className="mt-3 text-4xl font-normal tracking-[-0.02em] text-primary sm:text-4xl">
            {t.title}
          </h1>
          <p className="mt-4 text-muted-foreground">{t.intro}</p>
        </div>
        <div className="hidden overflow-hidden rounded-xl md:block">
          <img
            src={sampleImg}
            alt="Avocats Hass fraîchement récoltés, Sokoni Export"
            className="aspect-[4/3] w-full object-cover"
          />
        </div>
      </div>

      <form className="mt-10 max-w-2xl space-y-6" onSubmit={submit}>
        <div>
          <Label className="eyebrow">
            {t.productsOfInterest} <span className="text-clay">*</span>
          </Label>
          <ul className="mt-3 space-y-2 border border-border p-4">
            {products.map((p) => (
              <li key={p.id} className="flex items-center gap-3">
                <Checkbox
                  id={`product-${p.id}`}
                  checked={productIds.includes(p.id)}
                  onCheckedChange={() => toggleProduct(p.id)}
                />
                <label htmlFor={`product-${p.id}`} className="cursor-pointer text-sm">
                  {p.name} <span className="text-muted-foreground">· {p.packaging}</span>
                </label>
              </li>
            ))}
          </ul>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
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
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={t.email} required>
            <Input
              required
              type="email"
              maxLength={180}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </Field>
          <Field label={t.phone}>
            <Input
              type="tel"
              maxLength={40}
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </Field>
        </div>

        <div>
          <Label className="eyebrow mb-1.5 block">
            {t.shippingAddress} <span className="text-clay">*</span>
          </Label>
          <div className="space-y-3">
            <Input
              required
              placeholder={t.streetAddress}
              maxLength={200}
              value={form.address_line}
              onChange={(e) => setForm({ ...form, address_line: e.target.value })}
              aria-label={t.streetAddress}
            />
            <div className="grid gap-3 sm:grid-cols-3">
              <Input
                required
                placeholder={t.city}
                maxLength={80}
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                aria-label={t.city}
              />
              <Input
                required
                placeholder={t.postalCode}
                maxLength={20}
                value={form.postal_code}
                onChange={(e) => setForm({ ...form, postal_code: e.target.value })}
                aria-label={t.postalCode}
              />
              <Input
                required
                placeholder={t.country}
                maxLength={80}
                value={form.country}
                onChange={(e) => setForm({ ...form, country: e.target.value })}
                aria-label={t.country}
              />
            </div>
          </div>
        </div>

        <Field label={t.notes}>
          <Textarea
            maxLength={600}
            rows={3}
            placeholder={t.notesPlaceholder}
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />
        </Field>

        <Button type="submit" variant="cta" className="w-full" disabled={submitting}>
          {submitting ? t.sending : t.submit}
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
