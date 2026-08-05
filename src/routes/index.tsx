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
import { useT } from "@/lib/language";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sokoni Export — Origine. Confiance. Livraison." },
      {
        name: "description",
        content:
          "Avocat Hass en commerce direct depuis des fermes kenyanes certifiées jusqu'à Rungis, Paris. Demandez un devis ou suivez votre commande en temps réel, de la ferme à la livraison.",
      },
      { property: "og:title", content: "Sokoni Export — Origine. Confiance. Livraison." },
      {
        property: "og:description",
        content:
          "Avocat Hass kenyan certifié pour le marché de gros de Rungis, avec une traçabilité en temps réel de la ferme à la livraison sur chaque commande.",
      },
    ],
  }),
  component: Index,
});

const COPY = {
  fr: {
    heroEyebrow: "Nairobi → Rungis · Commerce direct",
    heroLine1: "Origine.",
    heroLine2: "Confiance.",
    heroLine3: "Livraison.",
    heroBody:
      "Nous achetons l'avocat Hass directement à des fermes kenyanes certifiées et le livrons sur le marché de Rungis. Chaque carton porte son propre historique — bloc de ferme, date de récolte, certificat de laboratoire, journal de la chaîne du froid, numéro de vol.",
    requestQuote: "Demander un devis",
    trackOrder: "Suivre ma commande",
    trackingCode: "Code de suivi",
    followShipment: "Suivre la commande",
    reassuranceCertified: {
      title: "Certifié à l'origine",
      body: "Fermes GlobalG.A.P. et EU Organic, certificat phytosanitaire sur chaque lot.",
    },
    reassuranceDocuments: {
      title: "Documents joints",
      body: "Analyse labo, phyto, facture et bon de livraison téléchargeables par commande.",
    },
    reassuranceAnswer: {
      title: "Réponse sous 24 h",
      body: "Tarification sur devis par lot et Incoterm, réponse en un jour ouvré.",
    },
    reassuranceDirect: {
      title: "Commerce direct",
      body: "Pas d'intermédiaire, pas de lots mélangés — un bloc de ferme par référence de commande.",
    },
    whoWeAre: "Qui sommes-nous",
    whoWeAreTitle: "Un bureau commercial entre Murang'a et Rungis",
    whoWeAreP1:
      "Sokoni Export est un exportateur en commerce direct d'avocat Hass kenyan. Nous ne sommes pas un intermédiaire : nous contractons chaque bloc de ferme nous-mêmes, assurons notre propre contrôle qualité au conditionnement, et suivons chaque palette jusqu'à son déchargement à Rungis. Notre équipe est présente aux deux bouts de la route — une équipe agronomie et conditionnement au Kenya, un bureau commercial et logistique à Paris.",
    whoWeAreP2:
      "Nous avons construit cette plateforme parce que les acheteurs en gros devaient auparavant se contenter d'une promesse plutôt que d'un historique. Ici, chaque affirmation sur le fruit — origine, matière sèche, température, dédouanement, vol — est un événement enregistré que vous pouvez ouvrir, télécharger et partager avec vos propres clients.",
    ourFarms: "Nos fermes",
    howWeShip: "Comment nous expédions",
    stats: [
      {
        value: "48 h",
        label: "Nairobi → Rungis",
        body: "Par fret aérien, chaîne du froid ininterrompue.",
      },
      {
        value: "9",
        label: "Points de contrôle enregistrés",
        body: "Du bloc de ferme à la signature de l'acheteur.",
      },
      {
        value: "6",
        label: "Fermes partenaires",
        body: "Murang'a, Kandara et Meru, sous contrat direct.",
      },
      {
        value: "100 %",
        label: "Cartons traçables",
        body: "Chaque carton lié à son propre historique.",
      },
    ],
    wholePoint: "L'essentiel",
    sixMilestones: "Six étapes clés. Aucune zone d'ombre.",
    traceabilityBody:
      "La traçabilité n'est pas une page de ce site — c'est le produit. Sokoni enregistre l'origine et les étapes qualité ; notre transitaire enregistre le dédouanement et le transit via un lien restreint par commande. Personne d'autre ne voit votre commande.",
    trackShipment: "Suivre une commande",
    featureCertified: { title: "Certifié", body: "GlobalGAP, EU Organic, phyto." },
    featureColdChain: { title: "Chaîne du froid", body: "Enregistrée à 5–6 °C, de bout en bout." },
    featureLive: { title: "En direct", body: "Mise à jour de la timeline sans rafraîchissement." },
    sourcing: "Approvisionnement",
    fewerFarms: "Moins de fermes, mais connues par leur nom",
    fewerFarmsBody:
      "Nous travaillons avec une liste restreinte de producteurs certifiés GlobalGAP à Murang'a, Kandara et Meru. Le fruit est cueilli à la matière sèche cible, conditionné au champ et pré-refroidi en six heures. Pas d'intermédiaires, pas de lots mélangés, pas de surprise sur la courbe de maturation.",
    farmsQuality: "Fermes & qualité",
    logistics: "Logistique",
    dapDdp: "DAP ou DDP Rungis",
    logisticsBody:
      "Fret aérien depuis Nairobi en 48 heures, ou fret maritime réfrigéré en 24 à 26 jours. Tarification sur devis par lot et Incoterm — ajoutez des produits à un devis et notre bureau commercial répond sous un jour ouvré.",
    leadTimes: "Délais",
    browseCatalog: "Voir le catalogue",
  },
  en: {
    heroEyebrow: "Nairobi → Rungis · Direct trade",
    heroLine1: "Origin.",
    heroLine2: "Trust.",
    heroLine3: "Delivery.",
    heroBody:
      "We buy Hass avocado directly from certified Kenyan farms and land it on the Rungis market. Every carton carries its own record — farm block, harvest date, lab certificate, cold-chain log, flight number.",
    requestQuote: "Request a Quote",
    trackOrder: "Track My Order",
    trackingCode: "Tracking code",
    followShipment: "Follow shipment",
    reassuranceCertified: {
      title: "Certified at source",
      body: "GlobalG.A.P. and EU Organic farms, phytosanitary certificate on every lot.",
    },
    reassuranceDocuments: {
      title: "Documents attached",
      body: "Lab analysis, phyto, invoice and delivery note downloadable per shipment.",
    },
    reassuranceAnswer: {
      title: "Answer in 24 h",
      body: "Quote-based pricing per lot and Incoterm, one working day response.",
    },
    reassuranceDirect: {
      title: "Direct trade",
      body: "No aggregator, no blended lots — one farm block per order reference.",
    },
    whoWeAre: "Who we are",
    whoWeAreTitle: "A trade desk between Murang'a and Rungis",
    whoWeAreP1:
      "Sokoni Export is a direct-trade exporter of Kenyan Hass avocado. We are not a broker: we contract each farm block ourselves, run our own quality control at the packhouse, and follow every pallet until it is unloaded at Rungis. Our team sits on both ends of the route — an agronomy and packhouse crew in Kenya, a trade and logistics desk in Paris.",
    whoWeAreP2:
      "We built this platform because wholesale buyers were asked to trust a promise instead of a record. Here, every claim on the fruit — origin, dry matter, temperature, clearance, flight — is a logged event you can open, download and share with your own clients.",
    ourFarms: "Our farms",
    howWeShip: "How we ship",
    stats: [
      { value: "48 h", label: "Nairobi → Rungis", body: "By airfreight, cold chain unbroken." },
      { value: "9", label: "Logged checkpoints", body: "From farm block to buyer signature." },
      {
        value: "6",
        label: "Partner farms",
        body: "Murang'a, Kandara and Meru, contracted direct.",
      },
      { value: "100 %", label: "Traceable cartons", body: "Every carton tied to its own record." },
    ],
    wholePoint: "The whole point",
    sixMilestones: "Six milestones. No black box.",
    traceabilityBody:
      "Traceability is not a page on this site — it is the product. Sokoni logs the origin and quality stages; our freight forwarder logs clearance and transit through a restricted per-shipment link. Nobody else sees your order.",
    trackShipment: "Track a shipment",
    featureCertified: { title: "Certified", body: "GlobalGAP, EU Organic, phyto." },
    featureColdChain: { title: "Cold chain", body: "Logged 5–6 °C, end to end." },
    featureLive: { title: "Live", body: "Timeline updates without refresh." },
    sourcing: "Sourcing",
    fewerFarms: "Fewer farms, known by name",
    fewerFarmsBody:
      "We work with a short list of GlobalGAP-certified growers in Murang'a, Kandara and Meru. Fruit is picked to a dry-matter target, field-packed and pre-cooled within six hours. No aggregators, no blended lots, no surprises on the ripening curve.",
    farmsQuality: "Farms & quality",
    logistics: "Logistics",
    dapDdp: "DAP or DDP Rungis",
    logisticsBody:
      "Airfreight from Nairobi in 48 hours, or reefer sea freight in 24–26 days. Pricing is quote-based per lot and Incoterm — add products to an RFQ and our trade desk answers within one working day.",
    leadTimes: "Lead times",
    browseCatalog: "Browse catalog",
  },
};

function Index() {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const t = useT(COPY);

  const REASSURANCE = [
    { icon: ShieldCheck, ...t.reassuranceCertified },
    { icon: FileCheck2, ...t.reassuranceDocuments },
    { icon: Timer, ...t.reassuranceAnswer },
    { icon: Handshake, ...t.reassuranceDirect },
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
              <p className="eyebrow text-ochre">{t.heroEyebrow}</p>

              <h1 className="stencil mt-4 text-4xl font-medium leading-[1.05] sm:text-6xl">
                {t.heroLine1}
                <br />
                {t.heroLine2}
                <br />
                {t.heroLine3}
              </h1>
              <p className="mt-6 max-w-md text-base text-primary-foreground/80">{t.heroBody}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/rfq">
                  <Button variant="clay" size="lg" className="stencil tracking-[0.12em]">
                    {t.requestQuote}
                  </Button>
                </Link>
                <Link to="/track">
                  <Button variant="outlineDark" size="lg" className="stencil tracking-[0.12em]">
                    {t.trackOrder}
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
            {t.trackingCode}
          </label>
          <Input
            id="quick-code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="SKN-2026-0148"
            className="max-w-xs border-primary-foreground/25 bg-transparent text-primary-foreground placeholder:text-primary-foreground/40"
          />
          <Button type="submit" variant="clay" size="sm">
            {t.followShipment}
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
            <p className="eyebrow">{t.whoWeAre}</p>
            <h2 className="stencil mt-3 text-3xl font-medium text-primary sm:text-4xl">
              {t.whoWeAreTitle}
            </h2>
            <p className="mt-5 text-muted-foreground">{t.whoWeAreP1}</p>
            <p className="mt-4 text-muted-foreground">{t.whoWeAreP2}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/farms">
                <Button variant="clay">
                  {t.ourFarms}
                  <ArrowRight className="size-4" />
                </Button>
              </Link>
              <Link to="/logistics">
                <Button variant="outline">{t.howWeShip}</Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 self-start sm:grid-cols-2">
            {t.stats.map((s) => (
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
            <p className="eyebrow">{t.wholePoint}</p>
            <h2 className="stencil mt-3 text-3xl font-medium text-primary sm:text-4xl">
              {t.sixMilestones}
            </h2>
            <p className="mt-5 text-muted-foreground">{t.traceabilityBody}</p>
          </div>

          <RouteStepper />

          <div className="mt-10 flex flex-wrap gap-3">
            <Link to="/track">
              <Button variant="clay">
                {t.trackShipment}
                <ArrowRight className="size-4" />
              </Button>
            </Link>
            <Link to="/rfq">
              <Button variant="outline">{t.requestQuote}</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Feature strip */}
      <section className="mx-auto max-w-6xl px-5 py-14">
        <div className="grid gap-8 sm:grid-cols-3">
          <Feature
            icon={ShieldCheck}
            title={t.featureCertified.title}
            body={t.featureCertified.body}
          />
          <Feature
            icon={Thermometer}
            title={t.featureColdChain.title}
            body={t.featureColdChain.body}
          />
          <Feature icon={PackageSearch} title={t.featureLive.title} body={t.featureLive.body} />
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
            <p className="eyebrow">{t.sourcing}</p>
            <h2 className="stencil text-2xl font-medium text-primary sm:text-3xl">
              {t.fewerFarms}
            </h2>
            <p className="text-muted-foreground">{t.fewerFarmsBody}</p>
            <div>
              <Link to="/farms">
                <Button variant="outline">
                  {t.farmsQuality}
                  <ArrowRight className="size-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl items-center gap-0 md:grid-cols-2">
        <div className="order-2 flex flex-col justify-center gap-5 p-8 sm:p-14 md:order-1">
          <p className="eyebrow">{t.logistics}</p>
          <h2 className="stencil text-2xl font-medium text-primary sm:text-3xl">{t.dapDdp}</h2>
          <p className="text-muted-foreground">{t.logisticsBody}</p>
          <div className="flex gap-3">
            <Link to="/logistics">
              <Button variant="outline">{t.leadTimes}</Button>
            </Link>
            <Link to="/catalog">
              <Button variant="clay">{t.browseCatalog}</Button>
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
