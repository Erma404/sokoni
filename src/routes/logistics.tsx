import { createFileRoute } from "@tanstack/react-router";
import coldImg from "@/assets/cold-chain.jpg";
import { useT } from "@/lib/language";

export const Route = createFileRoute("/logistics")({
  head: () => ({
    meta: [
      { title: "Logistique & Incoterms — Sokoni Export" },
      {
        name: "description",
        content:
          "Routes d'expédition Sokoni Export de Nairobi à Rungis : Incoterms DAP et DDP, délais fret aérien et maritime réfrigéré, et spécifications de chaîne du froid ininterrompue.",
      },
      { property: "og:title", content: "Logistique & Incoterms — Sokoni Export" },
      {
        property: "og:description",
        content:
          "Routes, délais, Incoterms et spécification de chaîne du froid, de Nairobi à Rungis.",
      },
    ],
  }),
  component: Logistics,
});

const COPY = {
  fr: {
    delivery: "Livraison",
    title: "Logistique",
    intro:
      "Deux routes, une chaîne du froid, et un transitaire qui enregistre chaque étape de transit directement sur votre page de suivi.",
    routesLeadTimes: "Routes & délais",
    tableHeaders: ["Mode", "Route", "Délai", "Volume", "Notes"],
    routes: [
      {
        mode: "Fret aérien",
        lane: "NBO → CDG → Rungis",
        lead: "48–72 h porte à stand",
        volume: "500 – 4 000 kg",
        note: "Pour les packs premium 2 kg et les compléments de programme. Départs mar / jeu / dim.",
      },
      {
        mode: "Maritime réfrigéré",
        lane: "Mombasa → Rotterdam → Rungis",
        lead: "26–30 jours",
        volume: "1 × 40' RF (≈ 24 t)",
        note: "Atmosphère contrôlée à 5,5 °C. Départs hebdomadaires, tronçon routier depuis Rotterdam.",
      },
    ],
    incoterms: "Incoterms",
    incotermsList: [
      {
        code: "DAP Rungis",
        body: "Nous prenons en charge la manutention d'origine, le fret et la livraison jusqu'à votre stand ou chambre froide à Rungis. Droits d'importation et TVA sont à votre charge.",
      },
      {
        code: "DDP Rungis",
        body: "Tout ce qui précède, plus le dédouanement import, les droits et la TVA réglés par Sokoni. Un prix rendu unique par carton, sans surprise.",
      },
      {
        code: "FOB Mombasa",
        body: "Disponible pour les acheteurs avec leur propre transitaire. Vous prenez le relais au port ; nous continuons d'enregistrer les étapes export sur votre page de suivi.",
      },
    ],
    coldChain: "Chaîne du froid",
    coldChainBody:
      "Le fruit est pré-refroidi dans les six heures suivant la cueillette, maintenu à 5–6 °C et expédié sous surveillance continue. Des enregistreurs de données voyagent à l'intérieur de la palette et leurs relevés apparaissent sur votre timeline de suivi aux étapes chambre froide et transit.",
    coldChainSpecs: [
      ["Température de la pulpe", "5,5 °C ± 0,5"],
      ["Humidité relative", "90 – 95 %"],
      ["Pré-refroidissement", "< 6 h après récolte"],
      ["Intervalle d'enregistrement", "15 minutes"],
    ] as [string, string][],
  },
  en: {
    delivery: "Delivery",
    title: "Logistics",
    intro:
      "Two lanes, one cold chain, and a forwarder who logs each transit checkpoint directly into your tracking page.",
    routesLeadTimes: "Routes & lead times",
    tableHeaders: ["Mode", "Lane", "Lead time", "Volume", "Notes"],
    routes: [
      {
        mode: "Airfreight",
        lane: "NBO → CDG → Rungis",
        lead: "48–72 h door to stand",
        volume: "500 – 4 000 kg",
        note: "For premium 2 kg packs and programme top-ups. Departures Tue / Thu / Sun.",
      },
      {
        mode: "Reefer sea",
        lane: "Mombasa → Rotterdam → Rungis",
        lead: "26–30 days",
        volume: "1 × 40' RF (≈ 24 t)",
        note: "Controlled atmosphere at 5.5 °C. Weekly sailings, road leg from Rotterdam.",
      },
    ],
    incoterms: "Incoterms",
    incotermsList: [
      {
        code: "DAP Rungis",
        body: "We carry origin handling, freight and delivery to your stand or cold room at Rungis. Import duty and VAT are on your account.",
      },
      {
        code: "DDP Rungis",
        body: "Everything above plus import clearance, duty and VAT settled by Sokoni. One landed price per carton, no surprises.",
      },
      {
        code: "FOB Mombasa",
        body: "Available for buyers with their own forwarder. You take over at the port; we still log the export checkpoints on your tracking page.",
      },
    ],
    coldChain: "Cold chain",
    coldChainBody:
      "Fruit is pre-cooled within six hours of picking, held at 5–6 °C and shipped under continuous monitoring. Data loggers travel inside the pallet and their readings appear on your tracking timeline at the cold storage and transit checkpoints.",
    coldChainSpecs: [
      ["Pulp temperature", "5.5 °C ± 0.5"],
      ["Relative humidity", "90 – 95 %"],
      ["Pre-cooling", "< 6 h after harvest"],
      ["Logger interval", "15 minutes"],
    ] as [string, string][],
  },
};

function Logistics() {
  const t = useT(COPY);

  return (
    <div>
      <header className="mx-auto max-w-6xl px-5 py-14">
        <p className="eyebrow">{t.delivery}</p>
        <h1 className="stencil mt-3 max-w-3xl text-3xl font-medium text-primary sm:text-5xl">
          {t.title}
        </h1>
        <p className="mt-5 max-w-2xl text-muted-foreground">{t.intro}</p>
      </header>

      <section className="mx-auto max-w-6xl px-5 pb-16">
        <h2 className="eyebrow">{t.routesLeadTimes}</h2>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
            <thead>
              <tr className="border-y border-border">
                {t.tableHeaders.map((h) => (
                  <th key={h} className="eyebrow py-3 pr-6 font-normal">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {t.routes.map((r) => (
                <tr key={r.mode} className="border-b border-border align-top">
                  <td className="stencil py-4 pr-6 font-medium">{r.mode}</td>
                  <td className="py-4 pr-6">{r.lane}</td>
                  <td className="py-4 pr-6">{r.lead}</td>
                  <td className="py-4 pr-6">{r.volume}</td>
                  <td className="py-4 pr-6 text-muted-foreground">{r.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="border-t border-border bg-card">
        <div className="mx-auto max-w-6xl px-5 py-16">
          <h2 className="eyebrow">{t.incoterms}</h2>
          <div className="mt-8 grid gap-8 md:grid-cols-3">
            {t.incotermsList.map((i) => (
              <div key={i.code} className="border-t-2 border-clay pt-4">
                <h3 className="stencil text-sm font-medium">{i.code}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{i.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <img
            src={coldImg}
            alt="Pallets of avocado cartons in a cold store"
            width={1600}
            height={1200}
            loading="lazy"
            className="aspect-[4/3] w-full object-cover"
          />
          <div>
            <h2 className="eyebrow">{t.coldChain}</h2>
            <p className="mt-4 text-muted-foreground">{t.coldChainBody}</p>
            <dl className="mt-6 grid grid-cols-2 gap-6">
              {t.coldChainSpecs.map(([k, v]) => (
                <div key={k}>
                  <dt className="eyebrow">{k}</dt>
                  <dd className="stencil mt-1 text-sm font-medium">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>
    </div>
  );
}
