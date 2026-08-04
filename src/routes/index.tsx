import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  FileCheck2,
  Handshake,
  PackageSearch,
  ShieldCheck,
  Thermometer,
  Timer,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import heroImg from "@/assets/hero-crate.png";
import packhouseImg from "@/assets/packhouse-crates.jpg";
import coldChainImg from "@/assets/cold-chain.jpg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RouteStepper } from "@/components/site/RouteStepper";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sokoni Export — Origin. Trust. Delivery." },
      {
        name: "description",
        content:
          "Direct-trade Hass avocado from certified Kenyan farms to Rungis, Paris. Request a quote or track your shipment in real time, farm to delivery.",
      },
      { property: "og:title", content: "Sokoni Export — Origin. Trust. Delivery." },
      {
        property: "og:description",
        content:
          "Certified Kenyan Hass avocado for the Rungis wholesale market, with real-time farm-to-delivery traceability on every order.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const navigate = useNavigate();
  const [code, setCode] = useState("");

  const REASSURANCE = [
    {
      icon: ShieldCheck,
      title: "Certified at source",
      body: "GlobalG.A.P. and EU Organic farms, phytosanitary certificate on every lot.",
    },
    {
      icon: FileCheck2,
      title: "Documents attached",
      body: "Lab analysis, phyto, invoice and delivery note downloadable per shipment.",
    },
    {
      icon: Timer,
      title: "Answer in 24 h",
      body: "Quote-based pricing per lot and Incoterm, one working day response.",
    },
    {
      icon: Handshake,
      title: "Direct trade",
      body: "No aggregator, no blended lots — one farm block per order reference.",
    },
  ];

  const STATS = [
    { value: "48 h", label: "Nairobi → Rungis", body: "By airfreight, cold chain unbroken." },
    { value: "9", label: "Logged checkpoints", body: "From farm block to buyer signature." },
    { value: "6", label: "Partner farms", body: "Murang'a, Kandara and Meru, contracted direct." },
    { value: "100 %", label: "Traceable cartons", body: "Every carton tied to its own record." },
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <img
          src={heroImg}
          alt="Sokoni Export crate of freshly picked Hass avocados, Kenya to Paris-Rungis"
          width={1200}
          height={896}
          className="h-[78vh] min-h-[520px] w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.24_0.02_150_/_0.88)] via-[oklch(0.24_0.02_150_/_0.6)] to-transparent" />
        <div
          aria-hidden
          className="absolute -right-24 top-1/2 hidden size-[420px] -translate-y-1/2 rounded-full border border-ochre/30 lg:block"
        >
          <div className="absolute inset-10 rounded-full border border-clay/30" />
        </div>
        <div className="absolute inset-0 flex items-center">
          <div className="mx-auto w-full max-w-6xl px-5">
            <div className="max-w-xl text-primary-foreground">
              <p className="eyebrow text-ochre">Nairobi → Rungis · Direct trade</p>

              <h1 className="stencil mt-4 text-4xl font-medium leading-[1.05] sm:text-6xl">
                Origin.
                <br />
                Trust.
                <br />
                Delivery.
              </h1>
              <p className="mt-6 max-w-md text-base text-primary-foreground/80">
                We buy Hass avocado directly from certified Kenyan farms and land it on the Rungis
                market. Every carton carries its own record — farm block, harvest date, lab
                certificate, cold-chain log, flight number.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/rfq">
                  <Button variant="clay" size="lg" className="stencil tracking-[0.12em]">
                    Request a Quote
                  </Button>
                </Link>
                <Link to="/track">
                  <Button variant="outlineDark" size="lg" className="stencil tracking-[0.12em]">
                    Track My Order
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick track bar */}
      <section className="border-b border-border bg-primary text-primary-foreground">
        <form
          className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-5 sm:flex-row sm:items-center"
          onSubmit={(e) => {
            e.preventDefault();
            if (code.trim()) navigate({ to: "/track/$code", params: { code: code.trim() } });
          }}
        >
          <label htmlFor="quick-code" className="eyebrow text-primary-foreground/60">
            Tracking code
          </label>
          <Input
            id="quick-code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="SKN-2026-0148"
            className="max-w-xs border-primary-foreground/25 bg-transparent text-primary-foreground placeholder:text-primary-foreground/40"
          />
          <Button type="submit" variant="clay" size="sm">
            Follow shipment
            <ArrowRight className="size-4" />
          </Button>
        </form>
      </section>

      {/* Reassurance band */}
      <section className="border-b border-border bg-card">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-10 sm:grid-cols-2 lg:grid-cols-4">
          {REASSURANCE.map((r) => (
            <div key={r.title} className="flex items-start gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-ochre/25 text-clay">
                <r.icon className="size-5" />
              </span>
              <div>
                <div className="stencil text-xs font-medium text-primary">{r.title}</div>
                <p className="mt-1 text-sm text-muted-foreground">{r.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Who we are */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-20">
          <div>
            <p className="eyebrow">Who we are</p>
            <h2 className="stencil mt-3 text-3xl font-medium text-primary sm:text-4xl">
              A trade desk between Murang&apos;a and Rungis
            </h2>
            <p className="mt-5 text-muted-foreground">
              Sokoni Export is a direct-trade exporter of Kenyan Hass avocado. We are not a broker:
              we contract each farm block ourselves, run our own quality control at the packhouse,
              and follow every pallet until it is unloaded at Rungis. Our team sits on both ends of
              the route — an agronomy and packhouse crew in Kenya, a trade and logistics desk in
              Paris.
            </p>
            <p className="mt-4 text-muted-foreground">
              We built this platform because wholesale buyers were asked to trust a promise instead
              of a record. Here, every claim on the fruit — origin, dry matter, temperature,
              clearance, flight — is a logged event you can open, download and share with your own
              clients.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/farms">
                <Button variant="clay">
                  Our farms
                  <ArrowRight className="size-4" />
                </Button>
              </Link>
              <Link to="/logistics">
                <Button variant="outline">How we ship</Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 self-start sm:grid-cols-2">
            {STATS.map((s) => (
              <div key={s.label} className="rounded-2xl border border-border bg-card p-6">
                <div className="stencil text-3xl font-medium text-clay">{s.value}</div>
                <div className="stencil mt-2 text-xs font-medium text-primary">{s.label}</div>
                <p className="mt-1 text-sm text-muted-foreground">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Traceability — 6-milestone stepper (grouping the 9 tracked checkpoints) */}
      <section className="border-y border-border bg-secondary">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 lg:px-12">
          <div className="max-w-2xl">
            <p className="eyebrow">The whole point</p>
            <h2 className="stencil mt-3 text-3xl font-medium text-primary sm:text-4xl">
              Six milestones. No black box.
            </h2>
            <p className="mt-5 text-muted-foreground">
              Traceability is not a page on this site — it is the product. Sokoni logs the origin
              and quality stages; our freight forwarder logs clearance and transit through a
              restricted per-shipment link. Nobody else sees your order.
            </p>
          </div>

          <RouteStepper />

          <div className="mt-10 flex flex-wrap gap-3">
            <Link to="/track">
              <Button variant="clay">
                Track a shipment
                <ArrowRight className="size-4" />
              </Button>
            </Link>
            <Link to="/rfq">
              <Button variant="outline">Request a quote</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Feature strip */}
      <section className="mx-auto max-w-6xl px-5 py-14">
        <div className="grid gap-8 sm:grid-cols-3">
          <Feature icon={ShieldCheck} title="Certified" body="GlobalGAP, EU Organic, phyto." />
          <Feature icon={Thermometer} title="Cold chain" body="Logged 5–6 °C, end to end." />
          <Feature icon={PackageSearch} title="Live" body="Timeline updates without refresh." />
        </div>
      </section>

      {/* Editorial split */}
      <section className="border-y border-border bg-secondary">
        <div className="mx-auto grid max-w-6xl items-center gap-0 md:grid-cols-2">
          <div className="flex justify-center p-8 sm:p-14">
            <div className="relative">
              <div aria-hidden className="absolute -inset-5 rounded-full border border-clay/30" />
              <img
                src={packhouseImg}
                alt="Graded Hass avocados packed into export crates at the packhouse"
                width={1200}
                height={1200}
                loading="lazy"
                className="mask-circle aspect-square w-full max-w-sm object-cover"
              />
            </div>
          </div>

          <div className="flex flex-col justify-center gap-5 p-8 sm:p-14">
            <p className="eyebrow">Sourcing</p>
            <h2 className="stencil text-2xl font-medium text-primary sm:text-3xl">
              Fewer farms, known by name
            </h2>
            <p className="text-muted-foreground">
              We work with a short list of GlobalGAP-certified growers in Murang'a, Kandara and
              Meru. Fruit is picked to a dry-matter target, field-packed and pre-cooled within six
              hours. No aggregators, no blended lots, no surprises on the ripening curve.
            </p>
            <div>
              <Link to="/farms">
                <Button variant="outline">
                  Farms &amp; quality
                  <ArrowRight className="size-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl items-center gap-0 md:grid-cols-2">
        <div className="order-2 flex flex-col justify-center gap-5 p-8 sm:p-14 md:order-1">
          <p className="eyebrow">Logistics</p>
          <h2 className="stencil text-2xl font-medium text-primary sm:text-3xl">
            DAP or DDP Rungis
          </h2>
          <p className="text-muted-foreground">
            Airfreight from Nairobi in 48 hours, or reefer sea freight in 24–26 days. Pricing is
            quote-based per lot and Incoterm — add products to an RFQ and our trade desk answers
            within one working day.
          </p>
          <div className="flex gap-3">
            <Link to="/logistics">
              <Button variant="outline">Lead times</Button>
            </Link>
            <Link to="/catalog">
              <Button variant="clay">Browse catalog</Button>
            </Link>
          </div>
        </div>
        <div className="order-1 flex justify-center p-8 sm:p-14 md:order-2">
          <img
            src={coldChainImg}
            alt="Cold storage room with pallets and a temperature logger"
            width={1200}
            height={1200}
            loading="lazy"
            className="mask-organic aspect-square w-full max-w-sm object-cover"
          />
        </div>
      </section>
    </>
  );
}

function Feature({
  icon: Icon,
  title,
  body,
}: {
  icon: typeof ShieldCheck;
  title: string;
  body: string;
}) {
  return (
    <div>
      <Icon className="size-5 text-clay" />
      <div className="stencil mt-2 text-xs font-medium">{title}</div>
      <p className="mt-1 text-sm text-muted-foreground">{body}</p>
    </div>
  );
}
