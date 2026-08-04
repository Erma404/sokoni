import { createFileRoute } from "@tanstack/react-router";
import {
  Beaker,
  ClipboardCheck,
  Leaf,
  Ruler,
  ShieldCheck,
  Sprout,
  Thermometer,
} from "lucide-react";
import farmerImg from "@/assets/farmer-portrait.jpg";
import farmHeaderImg from "@/assets/sokoni-loading-hero.png";
import kirinyagaImg from "@/assets/hero-orchard.jpg";
import coldImg from "@/assets/cold-chain.jpg";

export const Route = createFileRoute("/farms")({
  head: () => ({
    meta: [
      { title: "Farms & Quality — Sokoni Export" },
      {
        name: "description",
        content:
          "Meet the certified Kenyan farms behind Sokoni Export: GlobalGAP and EU Organic blocks in Kirinyaga, Murang'a and Meru, plus the full quality control process behind every carton.",
      },
      { property: "og:title", content: "Farms & Quality — Sokoni Export" },
      {
        property: "og:description",
        content: "Certified highland farms, dry-matter testing and lab-backed quality control.",
      },
    ],
  }),
  component: Farms,
});

const FARMS = [
  {
    name: "Kirinyaga Highlands Co-op",
    region: "Kirinyaga · 1 620 m",
    hectares: "184 ha",
    volume: "≈ 1 900 t / season",
    certs: ["GlobalGAP", "EU Organic"],
    lead: "Ninety-one smallholder members, a single collection point, harvest logged per block.",
    story:
      "The co-op was formed in 2011 by eleven families who pooled their nursery stock. Today its members share one grading shed, one agronomist and one lot-numbering system — which is why a carton from Kirinyaga can be traced back to the individual block it was picked from.",
    quote: {
      text: "We stopped selling to brokers in 2019. Now we know exactly which market our fruit goes to, and we get paid on quality, not on volume.",
      by: "Grace Wanjiru, chair, Kirinyaga Highlands Co-op",
    },
    image: kirinyagaImg,
  },
  {
    name: "Murang'a Ridge Estate",
    region: "Murang'a · 1 480 m",
    hectares: "96 ha",
    volume: "≈ 1 250 t / season",
    certs: ["GlobalGAP", "GRASP"],
    lead: "Estate-managed Hass with drip irrigation and an on-site dry-matter lab.",
    story:
      "A single-owner estate planted in 2008, fully drip-irrigated from two on-farm reservoirs. Ridge blocks face east, so the fruit sizes early — Murang'a usually opens our season with calibres 16 to 20.",
    quote: {
      text: "Dry matter is measured before every pick, block by block. If a block is not ready, it does not move, whatever the order book says.",
      by: "Peter Kamau, estate manager",
    },
    image: farmerImg,
  },
  {
    name: "Meru Slopes Growers",
    region: "Meru · 1 750 m",
    hectares: "212 ha",
    volume: "≈ 2 300 t / season",
    certs: ["GlobalGAP", "EU Organic", "SMETA"],
    lead: "Late-season blocks that extend our window into November.",
    story:
      "The highest of our three sourcing areas. Cooler nights slow maturation, so Meru fruit holds oil content late in the year and gives Rungis buyers a supply window when Kirinyaga has already closed.",
    quote: {
      text: "Altitude buys us six extra weeks. Our last container leaves when most of Kenya has finished picking.",
      by: "Lydia Mwendwa, production lead",
    },
    image: coldImg,
  },
];

const QC_STEPS = [
  {
    icon: Sprout,
    step: "01",
    title: "Dry matter before picking",
    body: "No block is harvested below 24% dry matter. A 10-fruit composite sample is oven-tested per block and the reading is recorded against the lot number that follows the fruit to Rungis.",
  },
  {
    icon: Beaker,
    step: "02",
    title: "Lab analysis",
    body: "Each consignment is sampled for multi-residue pesticide screening (EU MRL panel) and dry-matter confirmation. The certificate of analysis is issued per lot and attached to your tracking timeline.",
  },
  {
    icon: ClipboardCheck,
    step: "03",
    title: "Phytosanitary inspection",
    body: "KEPHIS inspectors check the packed consignment for pests, disease and labelling compliance before sealing. The phytosanitary certificate travels with the airway bill and appears in your documents list.",
  },
  {
    icon: Ruler,
    step: "04",
    title: "Grading criteria",
    body: "Fruit is sized to calibre (12–30), then screened for skin defects, sunburn, stem-end rot, bruising and shape. Class I tolerates 5% defect by count; anything below spec is diverted to the local market, never blended into an export lot.",
  },
  {
    icon: Thermometer,
    step: "05",
    title: "Cold chain from hour one",
    body: "Fruit is pre-cooled within six hours of picking and held at 5–6 °C. Pulp temperature is logged at intake, at dispatch and on arrival — the readings show on the cold storage checkpoint.",
  },
];

const CERTS = [
  {
    icon: ShieldCheck,
    name: "GlobalGAP",
    tagline: "Good Agricultural Practice, audited annually",
    guarantees: [
      "Traceability from packed carton back to the field block",
      "Controlled plant-protection products with recorded application dates and pre-harvest intervals",
      "Worker health, safety and welfare requirements on every certified farm",
      "Independent third-party audit — certificate number verifiable by the buyer",
    ],
  },
  {
    icon: Leaf,
    name: "EU Organic",
    tagline: "Regulation (EU) 2018/848",
    guarantees: [
      "No synthetic pesticides or mineral nitrogen fertilisers on certified blocks",
      "A three-year conversion period completed before the first organic harvest",
      "Segregated handling and storage from conventional fruit through the packhouse",
      "Each consignment covered by a Certificate of Inspection (COI) in TRACES",
    ],
  },
];

function Farms() {
  return (
    <div>
      <header className="relative overflow-hidden border-b border-border bg-secondary">
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-5 py-16 md:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="eyebrow">Origin</p>
            <h1 className="stencil mt-3 max-w-2xl text-3xl font-medium text-primary sm:text-5xl">
              Farms &amp; quality
            </h1>
            <p className="mt-5 max-w-xl text-muted-foreground">
              We buy from a closed group of certified growers in the Kenyan highlands. Same farms,
              same agronomists, same packhouse — which is why the traceability actually holds.
            </p>
            <dl className="mt-8 grid max-w-lg grid-cols-3 gap-4">
              {[
                ["3", "sourcing areas"],
                ["492 ha", "certified"],
                ["~5 450 t", "per season"],
              ].map(([v, l]) => (
                <div key={l} className="rounded-2xl bg-card p-4">
                  <dt className="stencil text-xl font-medium text-primary">{v}</dt>
                  <dd className="mt-1 text-xs text-muted-foreground">{l}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="flex justify-center">
            <div className="relative">
              <div aria-hidden className="absolute -inset-4 rounded-full border border-ochre/40" />
              <img
                src={farmHeaderImg}
                alt="Sokoni Export worker loading Hass avocado crates onto a truck at a Kenyan farm"
                width={900}
                height={900}
                className="mask-circle aspect-square w-full max-w-xs object-cover sm:max-w-sm"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Farm profiles */}
      <section className="mx-auto max-w-6xl space-y-16 px-5 py-16">
        <div>
          <p className="eyebrow">Certified growers</p>
          <h2 className="stencil mt-2 text-2xl font-medium text-primary sm:text-3xl">
            Three farms, known by name
          </h2>
        </div>

        {FARMS.map((f, i) => (
          <article
            key={f.name}
            className={`grid items-center gap-8 md:grid-cols-[0.85fr_1.15fr] md:gap-12 ${
              i % 2 === 1 ? "md:[&>figure]:order-2" : ""
            }`}
          >
            <figure className="flex justify-center">
              <div className="relative">
                <div
                  aria-hidden
                  className="absolute -inset-4 rounded-full border border-clay/30"
                />
                <img
                  src={f.image}
                  alt={`${f.name} in ${f.region}`}
                  width={900}
                  height={900}
                  loading="lazy"
                  className="mask-circle aspect-square w-full max-w-xs object-cover"
                />
              </div>
            </figure>

            <div>
              <h3 className="stencil text-xl font-medium text-primary">{f.name}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{f.region}</p>
              <p className="mt-4 text-muted-foreground">{f.lead}</p>
              <p className="mt-3 text-sm text-muted-foreground">{f.story}</p>

              <dl className="mt-5 flex flex-wrap gap-6 text-sm">
                <div>
                  <dt className="eyebrow">Area</dt>
                  <dd className="mt-1 font-medium">{f.hectares}</dd>
                </div>
                <div>
                  <dt className="eyebrow">Volume</dt>
                  <dd className="mt-1 font-medium">{f.volume}</dd>
                </div>
                <div>
                  <dt className="eyebrow">Certification</dt>
                  <dd className="mt-1 flex flex-wrap gap-1.5">
                    {f.certs.map((c) => (
                      <span
                        key={c}
                        className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[0.65rem] font-medium uppercase tracking-wider text-primary"
                      >
                        {c}
                      </span>
                    ))}
                  </dd>
                </div>
              </dl>

              <blockquote className="mt-6 rounded-2xl border-l-4 border-ochre bg-card p-5">
                <p className="text-sm italic text-foreground">“{f.quote.text}”</p>
                <footer className="mt-2 text-xs text-muted-foreground">— {f.quote.by}</footer>
              </blockquote>
            </div>
          </article>
        ))}
      </section>

      {/* Quality control process */}
      <section className="border-y border-border bg-card">
        <div className="mx-auto max-w-6xl px-5 py-16">
          <p className="eyebrow">Quality control</p>
          <h2 className="stencil mt-2 text-2xl font-medium text-primary sm:text-3xl">
            Five checks before a carton leaves Kenya
          </h2>

          <ol className="mt-10 space-y-6">
            {QC_STEPS.map(({ icon: Icon, step, title, body }, i) => (
              <li key={title} className="relative flex gap-5">
                {i < QC_STEPS.length - 1 && (
                  <svg
                    aria-hidden
                    viewBox="0 0 24 100"
                    preserveAspectRatio="none"
                    className="absolute left-0 top-12 h-full w-12"
                    fill="none"
                  >
                    <path
                      d="M12 0C12 30 22 40 12 60C2 80 12 90 12 100"
                      stroke="var(--color-border)"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                )}
                <span className="relative z-10 flex size-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Icon className="size-5" strokeWidth={1.6} />
                </span>
                <div className="pt-1">
                  <div className="flex items-baseline gap-3">
                    <span className="text-xs font-semibold text-clay">{step}</span>
                    <h3 className="stencil text-base font-medium">{title}</h3>
                  </div>
                  <p className="mt-2 max-w-3xl text-sm text-muted-foreground">{body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Certifications */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <p className="eyebrow">Certification</p>
        <h2 className="stencil mt-2 text-2xl font-medium text-primary sm:text-3xl">
          What the badges actually guarantee you
        </h2>

        <div className="mt-10 grid gap-8 md:grid-cols-2">
          {CERTS.map(({ icon: Icon, name, tagline, guarantees }) => (
            <div key={name} className="rounded-3xl border border-border bg-card p-8">
              <div className="flex items-center gap-5">
                <span className="flex size-20 shrink-0 items-center justify-center rounded-full bg-ochre/25 text-primary">
                  <Icon className="size-9" strokeWidth={1.4} />
                </span>
                <div>
                  <h3 className="stencil text-lg font-medium text-primary">{name}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{tagline}</p>
                </div>
              </div>
              <ul className="mt-6 space-y-3">
                {guarantees.map((g) => (
                  <li key={g} className="flex gap-3 text-sm text-muted-foreground">
                    <span
                      aria-hidden
                      className="mt-2 size-1.5 shrink-0 rounded-full bg-clay"
                    />
                    {g}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
