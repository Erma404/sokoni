import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { ArrowRight, Search } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { MIN_ORDER_KG, useRfq } from "@/lib/app-context";
import { eur } from "@/lib/format";
import { useT } from "@/lib/language";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import packhouseImg from "@/assets/packhouse-crates.jpg";

export const Route = createFileRoute("/catalog")({
  head: () => ({
    meta: [
      { title: "Catalogue avocat Hass — Sokoni Export" },
      {
        name: "description",
        content:
          "Avocat Hass kenyan par calibre et format : caisses de 10 kg, caisses de 4 kg, packs premium de 2 kg et kits d'échantillon. Tarifs en EUR, MOQ et certifications par ligne.",
      },
      { property: "og:title", content: "Catalogue avocat Hass — Sokoni Export" },
      {
        property: "og:description",
        content:
          "Calibres, formats de conditionnement, tarifs EUR et MOQ pour l'avocat Hass kenyan certifié.",
      },
    ],
  }),
  component: Catalog,
});

const COPY = {
  fr: {
    seasonHass: "Saison 2026 · Hass",
    title: "Catalogue",
    intro: (min: number) =>
      `Les prix sont des références indicatives départ conditionnement, en EUR. Le tarif final dépend du volume, de l'Incoterm et de la fenêtre d'expédition — constituez un devis et notre bureau commercial répond sous un jour ouvré. ${min}kg minimum de poids combiné par commande, tous produits confondus.`,
    requestSample: "Demander un échantillon",
    search: "Rechercher",
    caliber: "Calibre",
    packaging: "Conditionnement",
    certification: "Certification",
    all: "Tous",
    loading: "Chargement du catalogue…",
    noMatch: "Aucune ligne ne correspond à ces filtres.",
    perCarton: "par carton",
    perKg: "/ kg",
    packs: "packs",
    crates: "caisses",
    ifOrderedAlone: "si commandé seul",
    addToRfq: "Ajouter au devis",
    sampleOfLine: "Demander un échantillon de cette ligne",
    footerNote: "La tarification commerciale se fait sur devis. Rien n'est facturé en ligne.",
    reviewCart: "Voir le panier de devis",
  },
  en: {
    seasonHass: "Season 2026 · Hass",
    title: "Catalog",
    intro: (min: number) =>
      `Prices are indicative EX-packhouse references in EUR. Final pricing depends on volume, Incoterm and shipping window — build an RFQ and our trade desk replies within one working day. ${min}kg minimum combined weight per shipment, mixed across any products.`,
    requestSample: "Request a sample",
    search: "Search",
    caliber: "Caliber",
    packaging: "Packaging",
    certification: "Certification",
    all: "All",
    loading: "Loading catalog…",
    noMatch: "No lines match these filters.",
    perCarton: "per carton",
    perKg: "/ kg",
    packs: "packs",
    crates: "crates",
    ifOrderedAlone: "if ordered alone",
    addToRfq: "Add to RFQ",
    sampleOfLine: "Request a sample of this line",
    footerNote: "Trade pricing is quote-based. Nothing is charged online.",
    reviewCart: "Review RFQ cart",
  },
};

interface Product {
  id: string;
  slug: string;
  name: string;
  caliber: string;
  packaging: string;
  net_weight_kg: number;
  price_per_kg_eur: number;
  price_per_carton_eur: number;
  moq_cartons: number;
  certifications: string[];
  description: string | null;
  season: string | null;
}

function Catalog() {
  const { add } = useRfq();
  const t = useT(COPY);
  const [q, setQ] = useState("");
  const [caliber, setCaliber] = useState("all");
  const [packaging, setPackaging] = useState("all");
  const [cert, setCert] = useState("all");

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("price_per_carton_eur", { ascending: false });
      if (error) throw error;
      return data as Product[];
    },
  });

  // Sample kits are a separate, non-commercial flow — see /sample-request.
  // They never appear in the priced catalog grid or its filters.
  const commercialProducts = useMemo(
    () => products.filter((p) => p.packaging !== "Sample kit"),
    [products],
  );

  const calibers = useMemo(
    () => Array.from(new Set(commercialProducts.map((p) => p.caliber))),
    [commercialProducts],
  );
  const packagings = useMemo(
    () => Array.from(new Set(commercialProducts.map((p) => p.packaging))),
    [commercialProducts],
  );
  const certs = useMemo(
    () => Array.from(new Set(commercialProducts.flatMap((p) => p.certifications ?? []))),
    [commercialProducts],
  );

  const filtered = commercialProducts.filter((p) => {
    if (caliber !== "all" && p.caliber !== caliber) return false;
    if (packaging !== "all" && p.packaging !== packaging) return false;
    if (cert !== "all" && !(p.certifications ?? []).includes(cert)) return false;
    if (q && !`${p.name} ${p.caliber} ${p.packaging}`.toLowerCase().includes(q.toLowerCase()))
      return false;
    return true;
  });

  return (
    <div className="mx-auto max-w-6xl px-5 py-14">
      <div className="grid items-center gap-8 md:grid-cols-[1.2fr_0.8fr]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="eyebrow">{t.seasonHass}</p>
            <h1 className="mt-3 text-4xl font-normal tracking-[-0.02em] text-primary sm:text-4xl">
              {t.title}
            </h1>
            <p className="mt-4 max-w-2xl text-muted-foreground">{t.intro(MIN_ORDER_KG)}</p>
            <Link to="/sample-request" className="mt-5 inline-block">
              <Button variant="outline">{t.requestSample}</Button>
            </Link>
          </div>
        </div>
        <div className="hidden overflow-hidden rounded-xl md:block">
          <img
            src={packhouseImg}
            alt="Conditionnement des avocats Hass au packhouse Sokoni Export"
            className="aspect-[4/3] w-full object-cover"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="mt-10 grid gap-3 border-y border-border py-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t.search}
            className="pl-9"
            aria-label={t.search}
          />
        </div>
        <SelectFilter
          label={t.caliber}
          allLabel={t.all}
          value={caliber}
          onChange={setCaliber}
          options={calibers}
        />
        <SelectFilter
          label={t.packaging}
          allLabel={t.all}
          value={packaging}
          onChange={setPackaging}
          options={packagings}
        />
        <SelectFilter
          label={t.certification}
          allLabel={t.all}
          value={cert}
          onChange={setCert}
          options={certs}
        />
      </div>

      {isLoading ? (
        <p className="py-16 text-sm text-muted-foreground">{t.loading}</p>
      ) : filtered.length === 0 ? (
        <p className="py-16 text-sm text-muted-foreground">{t.noMatch}</p>
      ) : (
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => {
            // MOQ if this product is ordered alone: the carton count needed to
            // clear the 400kg shipment floor on its own (400kg ÷ carton weight).
            const soloMoq = Math.ceil(MIN_ORDER_KG / Number(p.net_weight_kg));
            return (
              <article key={p.id} className="flex flex-col border border-border bg-card">
                <img
                  src={packhouseImg}
                  alt={`${p.name} packed in ${p.packaging}`}
                  width={1200}
                  height={1600}
                  loading="lazy"
                  className="aspect-[4/3] w-full object-cover"
                />
                <div className="flex flex-1 flex-col gap-3 p-5">
                  <div>
                    <h2 className="stencil text-sm font-medium">{p.name}</h2>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {p.packaging} · {p.net_weight_kg} kg net · {p.season}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">{p.description}</p>
                  <ul className="flex flex-wrap gap-1.5">
                    {(p.certifications ?? []).map((c) => (
                      <li
                        key={c}
                        className="border border-primary/25 px-2 py-0.5 text-[0.65rem] uppercase tracking-wider text-primary"
                      >
                        {c}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto rule-top pt-3">
                    <div className="flex items-baseline justify-between">
                      <span className="stencil text-lg font-medium text-clay">
                        {eur(Number(p.price_per_carton_eur))}
                      </span>
                      <span className="text-xs text-muted-foreground">{t.perCarton}</span>
                    </div>
                    <div className="mt-0.5 flex items-baseline justify-between text-xs text-muted-foreground">
                      <span>
                        {eur(Number(p.price_per_kg_eur))} {t.perKg}
                      </span>
                      <span>
                        {soloMoq} {p.packaging.includes("pack") ? t.packs : t.crates}{" "}
                        {t.ifOrderedAlone}
                      </span>
                    </div>
                    <Button
                      variant="cta"
                      className="mt-4 w-full"
                      onClick={() => {
                        add({
                          productId: p.id,
                          name: p.name,
                          caliber: p.caliber,
                          packaging: p.packaging,
                          pricePerCarton: Number(p.price_per_carton_eur),
                          netWeightKg: Number(p.net_weight_kg),
                          moq: soloMoq,
                        });
                        toast.success(`${p.name} added to your RFQ`);
                      }}
                    >
                      {t.addToRfq}
                      <ArrowRight className="size-4" />
                    </Button>
                    <Link
                      to="/sample-request"
                      className="mt-2 block text-center text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground"
                    >
                      {t.sampleOfLine}
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
        <p className="text-sm text-muted-foreground">{t.footerNote}</p>
        <Link to="/rfq">
          <Button variant="cta">
            {t.reviewCart}
            <ArrowRight className="size-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}

function SelectFilter({
  label,
  allLabel,
  value,
  onChange,
  options,
}: {
  label: string;
  allLabel: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="eyebrow shrink-0">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm"
      >
        <option value="all">{allLabel}</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}
