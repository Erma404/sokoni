import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useRfq } from "@/lib/app-context";
import { eur } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import packhouseImg from "@/assets/packhouse-crates.jpg";

export const Route = createFileRoute("/catalog")({
  head: () => ({
    meta: [
      { title: "Hass Avocado Catalog — Sokoni Export" },
      {
        name: "description",
        content:
          "Kenyan Hass avocado by caliber and packaging format: 10 kg crates, 4 kg crates, 2 kg premium packs and sample kits. EUR pricing, MOQ and certifications per line.",
      },
      { property: "og:title", content: "Hass Avocado Catalog — Sokoni Export" },
      {
        property: "og:description",
        content: "Calibers, packaging formats, EUR pricing and MOQ for certified Kenyan Hass avocado.",
      },
    ],
  }),
  component: Catalog,
});

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

  const calibers = useMemo(
    () => Array.from(new Set(products.map((p) => p.caliber))),
    [products],
  );
  const packagings = useMemo(
    () => Array.from(new Set(products.map((p) => p.packaging))),
    [products],
  );
  const certs = useMemo(
    () => Array.from(new Set(products.flatMap((p) => p.certifications ?? []))),
    [products],
  );

  const filtered = products.filter((p) => {
    if (caliber !== "all" && p.caliber !== caliber) return false;
    if (packaging !== "all" && p.packaging !== packaging) return false;
    if (cert !== "all" && !(p.certifications ?? []).includes(cert)) return false;
    if (q && !`${p.name} ${p.caliber} ${p.packaging}`.toLowerCase().includes(q.toLowerCase()))
      return false;
    return true;
  });

  return (
    <div className="mx-auto max-w-6xl px-5 py-14">
      <p className="eyebrow">Season 2026 · Hass</p>
      <h1 className="stencil mt-3 text-3xl font-medium text-primary sm:text-4xl">Catalog</h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">
        Prices are indicative EX-packhouse references in EUR. Final pricing depends on volume,
        Incoterm and shipping window — build an RFQ and our trade desk replies within one working
        day.
      </p>

      {/* Filters */}
      <div className="mt-10 grid gap-3 border-y border-border py-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search"
            className="pl-9"
            aria-label="Search products"
          />
        </div>
        <SelectFilter label="Caliber" value={caliber} onChange={setCaliber} options={calibers} />
        <SelectFilter
          label="Packaging"
          value={packaging}
          onChange={setPackaging}
          options={packagings}
        />
        <SelectFilter label="Certification" value={cert} onChange={setCert} options={certs} />
      </div>

      {isLoading ? (
        <p className="py-16 text-sm text-muted-foreground">Loading catalog…</p>
      ) : filtered.length === 0 ? (
        <p className="py-16 text-sm text-muted-foreground">No lines match these filters.</p>
      ) : (
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
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
                    <span className="text-xs text-muted-foreground">per carton</span>
                  </div>
                  <div className="mt-0.5 flex items-baseline justify-between text-xs text-muted-foreground">
                    <span>{eur(Number(p.price_per_kg_eur))} / kg</span>
                    <span>MOQ {p.moq_cartons} cartons</span>
                  </div>
                  <Button
                    className="mt-4 w-full"
                    onClick={() => {
                      add({
                        productId: p.id,
                        name: p.name,
                        caliber: p.caliber,
                        packaging: p.packaging,
                        pricePerCarton: Number(p.price_per_carton_eur),
                        moq: p.moq_cartons,
                      });
                      toast.success(`${p.name} added to your RFQ`);
                    }}
                  >
                    Add to RFQ
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
        <p className="text-sm text-muted-foreground">
          Trade pricing is quote-based. Nothing is charged online.
        </p>
        <Link to="/rfq">
          <Button variant="clay">Review RFQ cart</Button>
        </Link>
      </div>
    </div>
  );
}

function SelectFilter({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
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
        <option value="all">All</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}
