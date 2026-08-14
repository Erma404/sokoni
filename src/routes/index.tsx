import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  FileCheck2,
  Handshake,
  ShieldCheck,
  Timer,
} from "lucide-react";
import { useState } from "react";
import heroOrchardImg from "@/assets/hero-orchard.jpg";
import packhouseImg from "@/assets/packhouse-crates.jpg";
import coldChainImg from "@/assets/cold-chain.jpg";
import farmManagerPortraitImg from "@/assets/farm-manager-portrait.jpg";
import avocadoHandfulImg from "@/assets/avocado-handful.jpg";
import avocadoCrateImg from "@/assets/avocado-crate-closeup.jpg";
import pickerOverallsImg from "@/assets/picker-blue-overalls.webp";
import pickerWomanImg from "@/assets/picker-woman-braids.jpg";
import pickerOlderManImg from "@/assets/picker-older-man.jpg";
import pickerAvocadoTreeImg from "@/assets/picker-avocado-tree.jpg";
import { Button } from "@/components/ui/button";
import { useT } from "@/lib/language";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sokoni Export — Du champ. À votre marché. Sans détour." },
      {
        name: "description",
        content:
          "Avocat Hass en commerce direct depuis des fermes kenyanes certifiées jusqu'à Rungis, Paris. Demandez un devis ou suivez votre commande en temps réel, de la ferme à la livraison.",
      },
      { property: "og:title", content: "Sokoni Export — Du champ. À votre marché. Sans détour." },
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
    heroEyebrow: "100 % traçable · Certifié GlobalG.A.P.",
    heroLine1: "Du champ.",
    heroLine2: "À votre marché.",
    heroLine3: "Sans détour.",
    requestQuote: "Demander un devis",
    heroLotName: "Avocat Hass",
    heroLotSub: "Lot KEN-24 · QC validé",
    heroFarmsBadge: "6 fermes partenaires",
    heroQualityBadge: "100 % Hass",
    heroQualitySub: "Export grade",
    heroDestination: "Destination Rungis",

    aboutKicker: "À propos de Sokoni",
    aboutTitleLead: "Chez ",
    aboutTitleBrand: "Sokoni",
    aboutTitleMid1: ", nous partons du terrain pour livrer des avocats Hass ",
    aboutTitleGreen1: "traçables, bien préparés et prêts pour votre marché.",
    aboutTitleMid2: " Chaque lot est suivi, du verger kenyan jusqu'à ",
    aboutTitleGreen2: "votre réception à Rungis.",
    aboutBody:
      "Notre équipe travaille directement avec des fermes certifiées et coordonne le tri, la documentation export et la chaîne du froid pour que vos achats restent simples et sûrs.",
    aboutCta: "Découvrir notre méthode",
    picksKicker: "Produits",
    picksTitle: "Notre sélection export",
    addToQuote: "Ajouter au devis",
    requestSample: "Demander un échantillon",
    picks: [
      {
        name: "Hass Avocado — Calibre 14/18",
        desc: "Carton 4 kg · Afrique de l'Est · Sept–Nov. Tri terrain et contrôle packhouse.",
        price: "32,00 €",
        unit: "par carton",
        moq: "40 colis minimum",
        certs: ["GLOBALG.A.P.", "EU ORGANIC"],
        img: packhouseImg,
      },
      {
        name: "Hass Avocado — Calibre 18/20",
        desc: "Carton 4 kg · Oct–Déc. Qualité régulière, prêt pour vos programmes.",
        price: "30,50 €",
        unit: "par carton",
        moq: "40 colis minimum",
        certs: ["GLOBALG.A.P."],
        img: avocadoHandfulImg,
      },
      {
        name: "Hass Avocado — Calibre 22/24",
        desc: "Carton 4 kg · Oct–Déc. Format retail pour rayons premium et food service.",
        price: "28,50 €",
        unit: "par carton",
        moq: "40 colis minimum",
        certs: ["GLOBALG.A.P.", "EU ORGANIC"],
        img: pickerOverallsImg,
      },
      {
        name: "Hass Avocado — Format 10 kg",
        desc: "Carton export grand format, disponible sur programme et volume.",
        price: "54,00 €",
        unit: "par carton",
        moq: "20 colis minimum",
        certs: ["GLOBALG.A.P."],
        img: heroOrchardImg,
      },
      {
        name: "Hass Avocado — Premium Select",
        desc: "Carton 2 kg · calibre premium, sélection manuelle, présentation soignée.",
        price: "9,20 €",
        unit: "par carton",
        moq: "200 colis minimum",
        certs: ["GLOBALG.A.P.", "EU ORGANIC"],
        img: avocadoCrateImg,
      },
      {
        name: "Hass Avocado — Pack QC",
        desc: "Contrôle calibrage, température et lot avant expédition.",
        price: "Sur devis",
        unit: "service",
        moq: "par lot",
        certs: ["PACKHOUSE QC"],
        img: coldChainImg,
      },
    ],
    whyKicker: "Pourquoi Sokoni",
    whyTitle: "Pourquoi choisir Sokoni ?",
    whyPillCount: "6",
    whyPill: "Rejoignez notre réseau de fermes partenaires",
    whyReasons: [
      {
        title: "Certifié à l'origine",
        body: "Fermes GlobalG.A.P. et EU Organic, certificat phytosanitaire sur chaque lot.",
      },
      {
        title: "Documents joints",
        body: "Analyse labo, phyto, facture et bon de livraison téléchargeables par commande.",
      },
      {
        title: "Réponse sous 24 h",
        body: "Tarification sur devis par lot et Incoterm, réponse en un jour ouvré.",
      },
      {
        title: "Commerce direct",
        body: "Pas d'intermédiaire, pas de lots mélangés — un bloc de ferme par référence.",
      },
    ],
    stats: [
      { value: "48 h", label: "Nairobi → Rungis" },
      { value: "9", label: "Points de contrôle" },
      { value: "6", label: "Fermes partenaires" },
      { value: "100 %", label: "Cartons traçables" },
    ],

    produceEyebrow: "Catalogue",
    produceTitle: "Conçu pour le commerce frais",
    products: [
      {
        name: "Carton 4 kg",
        specs: "GlobalG.A.P. · Fret aérien",
        img: packhouseImg,
        price: "Sur devis",
      },
      {
        name: "Carton 10 kg",
        specs: "GlobalG.A.P. · Fret maritime",
        img: heroOrchardImg,
        price: "Sur devis",
      },
      {
        name: "Kit échantillon",
        specs: "Hors panier RFQ",
        img: avocadoHandfulImg,
        price: "Sur demande",
      },
    ],
    browseCatalog: "Voir le catalogue",

    traceEyebrow: "L'essentiel",
    traceTitle: "Six étapes clés. Aucune zone d'ombre.",
    traceBody:
      "La traçabilité n'est pas une page de ce site — c'est le produit. Sokoni enregistre l'origine et les étapes qualité ; notre transitaire enregistre le dédouanement et le transit.",
    trackShipment: "Suivre une commande",

    sourcing: "Approvisionnement",
    fewerFarms: "Moins de fermes, mais connues par leur nom",
    fewerFarmsBody:
      "Nous travaillons avec une liste restreinte de producteurs certifiés GlobalGAP à Murang'a, Kandara et Meru. Pas d'intermédiaires, pas de lots mélangés.",
    farmsQuality: "Fermes & qualité",

    logistics: "Logistique",
    dapDdp: "DAP ou DDP Rungis",
    logisticsBody:
      "Fret aérien depuis Nairobi en 48 heures, ou fret maritime réfrigéré en 24 à 26 jours. Tarification sur devis par lot et Incoterm.",
    leadTimes: "Délais",

    testimonyKicker: "Témoignage",
    testimonyTitle: "Ce que disent nos acheteurs",
    testimonyQuote:
      "Sokoni nous donne une lecture claire de la récolte et livre une qualité conforme à notre programme.",
    testimonyAttribution: "Responsable achats · Grossiste, Rungis",

    tradeTitleLine1: "Parlons",
    tradeTitleLine2: "prix.",
    tradeTitleLine3: "Parlons",
    tradeTitleLine4: "arrivage.",
    tradeDeskTitle: "Trade desk Sokoni",
    tradeDeskBody:
      "Partagez votre format, volume et destination. Nous revenons avec une proposition nette : disponibilité, prix et conditions de livraison.",
    tradePrompt: "Un devis, une question ?",
    tradeRfq: "Demander un RFQ",
  },
  en: {
    heroEyebrow: "100% traceable · GlobalG.A.P. certified",
    heroLine1: "From the field.",
    heroLine2: "To your market.",
    heroLine3: "No detour.",
    requestQuote: "Request a Quote",
    heroLotName: "Hass Avocado",
    heroLotSub: "Lot KEN-24 · QC cleared",
    heroFarmsBadge: "6 partner farms",
    heroQualityBadge: "100% Hass",
    heroQualitySub: "Export grade",
    heroDestination: "Destination Rungis",

    aboutKicker: "About Sokoni",
    aboutTitleLead: "At ",
    aboutTitleBrand: "Sokoni",
    aboutTitleMid1: ", we start from the ground to deliver Hass avocado that is ",
    aboutTitleGreen1: "traceable, well prepared and ready for your market.",
    aboutTitleMid2: " Every lot is tracked, from the Kenyan orchard to ",
    aboutTitleGreen2: "your receiving dock at Rungis.",
    aboutBody:
      "Our team works directly with certified farms and coordinates grading, export paperwork and cold chain so your purchases stay simple and safe.",
    aboutCta: "Discover our method",
    picksKicker: "Products",
    picksTitle: "Our export selection",
    addToQuote: "Add to quote",
    requestSample: "Request a sample",
    picks: [
      {
        name: "Hass Avocado — Caliber 14/18",
        desc: "4 kg carton · East Africa · Sept–Nov. Field-graded, packhouse checked.",
        price: "€32.00",
        unit: "per carton",
        moq: "40-carton minimum",
        certs: ["GLOBALG.A.P.", "EU ORGANIC"],
        img: packhouseImg,
      },
      {
        name: "Hass Avocado — Caliber 18/20",
        desc: "4 kg carton · Oct–Dec. Consistent quality, ready for your programs.",
        price: "€30.50",
        unit: "per carton",
        moq: "40-carton minimum",
        certs: ["GLOBALG.A.P."],
        img: avocadoHandfulImg,
      },
      {
        name: "Hass Avocado — Caliber 22/24",
        desc: "4 kg carton · Oct–Dec. Retail format for premium shelves and food service.",
        price: "€28.50",
        unit: "per carton",
        moq: "40-carton minimum",
        certs: ["GLOBALG.A.P.", "EU ORGANIC"],
        img: pickerOverallsImg,
      },
      {
        name: "Hass Avocado — 10 kg Format",
        desc: "Large export carton, available on program and volume.",
        price: "€54.00",
        unit: "per carton",
        moq: "20-carton minimum",
        certs: ["GLOBALG.A.P."],
        img: heroOrchardImg,
      },
      {
        name: "Hass Avocado — Premium Select",
        desc: "2 kg carton · premium caliber, hand-selected, retail-ready presentation.",
        price: "€9.20",
        unit: "per carton",
        moq: "200-carton minimum",
        certs: ["GLOBALG.A.P.", "EU ORGANIC"],
        img: avocadoCrateImg,
      },
      {
        name: "Hass Avocado — QC Pack",
        desc: "Grading, temperature and lot check before shipment.",
        price: "Quote-based",
        unit: "service",
        moq: "per lot",
        certs: ["PACKHOUSE QC"],
        img: coldChainImg,
      },
    ],
    whyKicker: "Why Sokoni",
    whyTitle: "Why choose Sokoni?",
    whyPillCount: "6",
    whyPill: "Join our partner farm network",
    whyReasons: [
      {
        title: "Certified at source",
        body: "GlobalG.A.P. and EU Organic farms, phytosanitary certificate on every lot.",
      },
      {
        title: "Documents attached",
        body: "Lab analysis, phyto, invoice and delivery note downloadable per shipment.",
      },
      {
        title: "Answer in 24 h",
        body: "Quote-based pricing per lot and Incoterm, one working day response.",
      },
      {
        title: "Direct trade",
        body: "No aggregator, no blended lots — one farm block per order reference.",
      },
    ],
    stats: [
      { value: "48 h", label: "Nairobi → Rungis" },
      { value: "9", label: "Checkpoints" },
      { value: "6", label: "Partner farms" },
      { value: "100%", label: "Traceable cartons" },
    ],

    produceEyebrow: "Catalog",
    produceTitle: "Built for the fresh trade",
    products: [
      { name: "4 kg carton", specs: "GlobalG.A.P. · Airfreight", img: packhouseImg, price: "Quote-based" },
      { name: "10 kg carton", specs: "GlobalG.A.P. · Sea freight", img: heroOrchardImg, price: "Quote-based" },
      { name: "Sample kit", specs: "Outside RFQ cart", img: avocadoHandfulImg, price: "On request" },
    ],
    browseCatalog: "Browse catalog",

    traceEyebrow: "The whole point",
    traceTitle: "Six milestones. No black box.",
    traceBody:
      "Traceability is not a page on this site — it is the product. Sokoni logs the origin and quality stages; our freight forwarder logs clearance and transit.",
    trackShipment: "Track a shipment",

    sourcing: "Sourcing",
    fewerFarms: "Fewer farms, known by name",
    fewerFarmsBody:
      "We work with a short list of GlobalGAP-certified growers in Murang'a, Kandara and Meru. No aggregators, no blended lots.",
    farmsQuality: "Farms & quality",

    logistics: "Logistics",
    dapDdp: "DAP or DDP Rungis",
    logisticsBody:
      "Airfreight from Nairobi in 48 hours, or reefer sea freight in 24–26 days. Pricing is quote-based per lot and Incoterm.",
    leadTimes: "Lead times",

    testimonyKicker: "Testimonial",
    testimonyTitle: "What our buyers say",
    testimonyQuote:
      "Sokoni gives us a clear read on the crop and delivers quality that matches our program.",
    testimonyAttribution: "Head of purchasing · Rungis wholesaler",

    tradeTitleLine1: "Let's talk",
    tradeTitleLine2: "price.",
    tradeTitleLine3: "Let's talk",
    tradeTitleLine4: "arrival.",
    tradeDeskTitle: "Sokoni trade desk",
    tradeDeskBody:
      "Share your format, volume and destination. We'll come back with a clear proposal: availability, price and delivery terms.",
    tradePrompt: "A quote, a question?",
    tradeRfq: "Request an RFQ",
  },
};

const WHY_ICONS = [ShieldCheck, FileCheck2, Timer, Handshake];

function Index() {
  const t = useT(COPY);
  const [testimonyIndex, setTestimonyIndex] = useState(0);

  // Only real quotes go here — the gallery UI (arrows, page count) simply
  // reflects however many there are, instead of a fabricated "1/10".
  const TESTIMONIALS = [
    {
      quote: t.testimonyQuote,
      attribution: t.testimonyAttribution,
      img: avocadoHandfulImg,
    },
  ];

  return (
    <>
      {/* Hero — matches sokoni-hero-banner.html exactly: 49.5%/1fr columns, 61%/39% rows,
          one wide orchard photo + one small crate photo floating over the seam. */}
      <section className="bg-background">
        <div className="mx-auto min-h-[calc(100svh-4rem)] w-full max-w-[1800px] px-3 py-1 sm:px-5 lg:px-8">
          <div className="relative grid gap-[7px] lg:grid-cols-[49.5%_1fr] lg:grid-rows-[61%_39%] lg:h-[calc(100svh-4.5rem)]">
            {/* Statement card */}
            <div
              className="flex flex-col items-center justify-center rounded-xl bg-[#edf7ee] px-8 py-14 text-center sm:px-12"
              style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
            >
              <span className="mb-4 rounded-[14px] bg-[#e0f4e0] px-2.5 py-1.5 text-[9px] font-bold tracking-[0.1em] text-[#5b7761]">
                {t.heroEyebrow}
              </span>
              <h1 className="text-[38px] font-normal leading-[0.88] tracking-[-0.08em] text-[#142b21] sm:text-[56px] lg:text-[70px]">
                {t.heroLine1}
                <br />
                {t.heroLine2}
                <br />
                {t.heroLine3}
              </h1>
              <Link to="/rfq" className="mt-6">
                <span className="inline-flex items-center gap-2 rounded-[24px] bg-[#72c635] px-5 py-3 text-[11px] font-bold text-[#173d26]">
                  {t.requestQuote}
                  <ArrowRight className="size-3.5" />
                </span>
              </Link>
            </div>

            {/* Portrait — spans both rows on the right */}
            <div className="relative min-h-[420px] overflow-hidden rounded-xl lg:col-start-2 lg:row-span-2 lg:row-start-1">
              <img
                src={farmManagerPortraitImg}
                alt="Responsable de ferme partenaire Sokoni Export, verger d'avocatiers à Murang'a, Kenya"
                className="absolute inset-0 h-full w-full object-cover"
                style={{ objectPosition: "center 46%" }}
              />
            </div>

            {/* Bottom-left row: two separate cards, each fully rounded */}
            <div className="grid grid-cols-[1.7fr_1fr] gap-[7px] lg:col-start-1 lg:row-start-2">
              {/* Orchard photo */}
              <div className="relative min-h-[220px] overflow-hidden rounded-xl">
                <img
                  src={pickerOverallsImg}
                  alt="Cueillette d'avocats Hass sur un verger partenaire Sokoni Export"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-[5px] bg-white px-3 py-3 text-center text-[8px] leading-[1.5] text-[#45594a]"
                  style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
                >
                  <span className="text-[#72c635]">●</span>
                  <br />
                  {t.heroLotName}
                  <br />
                  <small>{t.heroLotSub}</small>
                </div>
              </div>

              {/* Crate — its own separate card, fully rounded */}
              <div className="relative min-h-[220px] overflow-hidden rounded-xl">
                <img
                  src={avocadoCrateImg}
                  alt="Caisse d'avocats Hass fraîchement récoltés, Sokoni Export"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <span
                  className="absolute left-2.5 top-2.5 rounded-[5px] bg-white px-1.5 py-1.5 text-[8px] font-bold text-[#45594a]"
                  style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
                >
                  {t.heroFarmsBadge}
                </span>
                <span
                  className="absolute bottom-1.5 right-1.5 rounded-[5px] bg-white px-1.5 py-1 text-right text-[7px] leading-tight text-[#45594a]"
                  style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
                >
                  {t.heroQualityBadge}
                  <br />
                  {t.heroQualitySub}
                </span>
              </div>
            </div>

            {/* Destination tab — bottom-right, poking off the grid edge */}
            <p
              className="absolute -bottom-0.5 right-[7%] z-10 hidden rounded-t-[5px] bg-white px-2.5 py-1.5 text-[10px] text-[#142b21] lg:block"
              style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
            >
              {t.heroDestination}
            </p>
          </div>
        </div>
      </section>

      {/* About Sokoni — a slight white seam above and below, same side margin as the hero,
          rounded corners like every other block. */}
      <section className="my-3 bg-background">
        <div className="mx-auto max-w-[1800px] px-3 sm:px-5 lg:px-8">
          <div className="relative overflow-hidden rounded-xl bg-[#eff8f0] px-[7%] py-16 text-center sm:py-20 lg:py-28">
        <figure className="absolute left-[2.7%] top-[42px] hidden w-[13.4%] overflow-hidden rounded-lg sm:top-[62px] md:block md:h-[145px]">
          <img
            src={pickerWomanImg}
            alt="Cueillette d'avocats Hass dans un verger kenyan"
            className="h-full w-full object-cover"
          />
        </figure>
        <figure className="absolute right-[5%] top-[42px] hidden w-[17.2%] overflow-hidden rounded-lg sm:top-[62px] md:block md:h-[175px]">
          <img
            src={pickerOlderManImg}
            alt="Producteur kenyan récoltant des avocats Hass"
            className="h-full w-full object-cover"
          />
        </figure>
        <figure className="absolute bottom-[35px] left-[7.7%] hidden w-[18%] overflow-hidden rounded-lg sm:bottom-[55px] md:block md:h-[177px]">
          <img
            src={avocadoHandfulImg}
            alt="Avocats Hass récoltés dans une cagette"
            className="h-full w-full object-cover"
          />
        </figure>
        <figure className="absolute bottom-[45px] right-[7.2%] hidden w-[14%] overflow-hidden rounded-lg sm:bottom-[66px] md:block md:h-[139px]">
          <img
            src={avocadoCrateImg}
            alt="Contrôle qualité des avocats destinés à l'export"
            className="h-full w-full object-cover"
          />
        </figure>

        <div className="relative z-[1] mx-auto max-w-[650px]">
          <span
            className="mb-4 inline-block rounded-[13px] border border-[#79a16f] px-2.5 py-1 text-[9px] tracking-[0.02em] text-[#245640]"
            style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
          >
            {t.aboutKicker}
          </span>
          <h2
            className="text-[27px] font-normal leading-[1.16] tracking-[-0.055em] text-[#142b21] sm:text-[38px] lg:text-[46px]"
            style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
          >
            {t.aboutTitleLead}
            <strong className="font-normal">{t.aboutTitleBrand}</strong>
            {t.aboutTitleMid1}
            <span className="text-[#377b2c]">{t.aboutTitleGreen1}</span>
            {t.aboutTitleMid2}
            <span className="text-[#377b2c]">{t.aboutTitleGreen2}</span>
          </h2>
          <p
            className="mx-auto mt-5 max-w-[470px] text-xs leading-[1.55] text-[#35463b]"
            style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
          >
            {t.aboutBody}
          </p>
          <Link to="/farms" className="mt-6 inline-block">
            <span className="inline-flex items-center gap-2 rounded-[24px] bg-[#72c635] px-4 py-2.5 text-[10px] font-bold text-[#173d26]">
              {t.aboutCta}
              <ArrowRight className="size-3" />
            </span>
          </Link>
          </div>
          </div>
        </div>
      </section>

      {/* Produits — matches sokoni-hero-banner.html's .picks section: bordered cards,
          rounded corners, uppercase title, certs pills, price row, quote CTA.
          Same side margin + rounded block + gap as every other section. */}
      <section className="mb-3 bg-background">
        <div className="mx-auto max-w-[1800px] px-3 sm:px-5 lg:px-8">
          <div
            className="rounded-xl bg-[#f4f4f2] px-[7%] py-16 sm:py-24"
            style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
          >
            <div className="text-center">
              <span className="inline-block rounded-[13px] border border-[#75a46e] px-2.5 py-1 text-[10px] tracking-[0.02em] text-[#174e37]">
                {t.picksKicker}
              </span>
              <h2 className="mb-8 mt-4 text-[34px] font-normal tracking-[-0.04em] text-[#142b21] sm:text-[46px] lg:text-[56px]">
                {t.picksTitle}
              </h2>
            </div>

            <div className="mx-auto grid max-w-6xl grid-cols-1 items-start gap-x-4 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
          {t.picks.map((p) => (
            <div
              key={p.name}
              className="overflow-hidden rounded-2xl border border-[#d5d5cf] bg-white pb-3.5"
            >
              <img src={p.img} alt={p.name} className="aspect-[1.32] w-full object-cover" />
              <div className="mt-3 px-3 text-[13px] font-bold uppercase leading-tight tracking-[-0.01em] text-[#142b21]">
                {p.name}
              </div>
              <p className="mb-2.5 mt-1.5 min-h-[30px] px-3 text-[12px] leading-[1.45] text-[#526158]">
                {p.desc}
              </p>
              <div className="my-2.5 flex gap-1 px-3">
                {p.certs.map((c) => (
                  <span
                    key={c}
                    className="border border-[#bdc9bf] px-1.5 py-0.5 text-[9px] text-[#536055]"
                  >
                    {c}
                  </span>
                ))}
              </div>
              <div className="flex items-end justify-between px-3 text-[#a44335]">
                <span className="text-lg font-semibold">{p.price}</span>
                <small className="text-[10px] leading-tight text-[#536055]">
                  {p.unit}
                  <br />
                  {p.moq}
                </small>
              </div>
              <Link to="/rfq" className="mx-3 mt-2 block">
                <span className="block rounded-lg bg-[#0a4934] py-2 text-center text-[13px] font-bold text-white">
                  {t.addToQuote}
                </span>
              </Link>
              <Link
                to="/sample-request"
                className="mx-3 mt-1.5 block text-center text-[11px] text-[#234331]"
              >
                {t.requestSample}
              </Link>
            </div>
          ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Sokoni — soft-green canvas, photo card with a floating pill + a 2x2 grid
          of reason cards, each with an icon roundel and a small corner arrow. */}
      <section className="mb-3 bg-background">
        <div className="mx-auto max-w-[1800px] px-3 sm:px-5 lg:px-8">
          <div className="rounded-xl bg-[#eff8f0] px-[7%] py-16 sm:py-20 lg:py-24">
            <div className="text-center">
              <span className="inline-block rounded-[13px] border border-[#79a16f] px-2.5 py-1 text-[10px] tracking-[0.02em] text-[#245640]">
                {t.whyKicker}
              </span>
              <h2 className="mb-10 mt-4 text-[32px] font-normal tracking-[-0.03em] text-[#142b21] sm:text-[42px] lg:text-[48px]">
                {t.whyTitle}
              </h2>
            </div>

            <div className="mx-auto grid max-w-6xl gap-4 lg:grid-cols-2">
              <div className="relative min-h-[320px] overflow-hidden rounded-2xl lg:min-h-0">
                <img
                  src={pickerAvocadoTreeImg}
                  alt="Producteur récoltant des avocats Hass à la main, ferme partenaire Sokoni Export"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.24_0.02_150_/_0.35)] via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 max-w-[200px] rounded-2xl bg-white/95 p-3 shadow-lg">
                  <div className="flex items-center">
                    <img
                      src={farmManagerPortraitImg}
                      alt=""
                      className="size-7 rounded-full border-2 border-white object-cover"
                    />
                    <img
                      src={pickerWomanImg}
                      alt=""
                      className="-ml-2 size-7 rounded-full border-2 border-white object-cover"
                    />
                    <img
                      src={pickerOlderManImg}
                      alt=""
                      className="-ml-2 size-7 rounded-full border-2 border-white object-cover"
                    />
                  </div>
                  <p className="mt-2 text-xs font-semibold leading-tight text-[#142b21]">
                    {t.whyPill}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {t.whyReasons.map((r, i) => {
                  const Icon = WHY_ICONS[i];
                  return (
                    <div
                      key={r.title}
                      className="relative rounded-2xl bg-white p-6 shadow-sm"
                      style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
                    >
                      <span className="flex size-11 items-center justify-center rounded-full bg-[#f2f4f1] text-[#0b5038]">
                        {Icon ? <Icon className="size-5" /> : null}
                      </span>
                      <h3 className="mt-6 text-lg font-bold leading-tight text-[#142b21]">
                        {r.title}
                      </h3>
                      <p className="mt-2 text-xs leading-relaxed text-[#516058]">{r.body}</p>
                      <span className="mt-4 flex size-7 items-center justify-center rounded-full border border-[#d5d5cf] text-[#516058]">
                        <ArrowUpRight className="size-3.5" />
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial gallery — photo with overlaid prev/next controls and an honest
          page count (only as many slides as we have real quotes for). */}
      <section className="mx-auto max-w-6xl px-5 pb-10">
        <div className="grid items-center gap-8 md:grid-cols-2 md:gap-10">
          <div className="flex flex-col gap-4">
            <p className="eyebrow">{t.testimonyKicker}</p>
            <h2 className="stencil text-2xl font-medium text-primary sm:text-3xl">
              {t.testimonyTitle}
            </h2>
            <p className="text-lg leading-snug text-foreground">
              “{TESTIMONIALS[testimonyIndex]?.quote}”
            </p>
            <p className="stencil text-xs text-muted-foreground">
              {TESTIMONIALS[testimonyIndex]?.attribution}
            </p>
          </div>

          <div className="relative">
            <img
              src={TESTIMONIALS[testimonyIndex]?.img}
              alt="Avocats Hass fraîchement récoltés, Sokoni Export"
              className="aspect-[4/3] w-full rounded-2xl object-cover"
            />
            {TESTIMONIALS.length > 1 && (
              <div className="absolute left-4 top-1/2 flex -translate-y-1/2 flex-col gap-2">
                <button
                  type="button"
                  aria-label={testimonyIndex === TESTIMONIALS.length - 1 ? undefined : "Suivant"}
                  onClick={() =>
                    setTestimonyIndex((i) => (i + 1) % TESTIMONIALS.length)
                  }
                  className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg"
                >
                  <ArrowRight className="size-4" />
                </button>
                <button
                  type="button"
                  aria-label="Précédent"
                  onClick={() =>
                    setTestimonyIndex((i) => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)
                  }
                  className="flex size-9 items-center justify-center rounded-full border border-border bg-card text-primary shadow-lg"
                >
                  <ArrowLeft className="size-4" />
                </button>
              </div>
            )}
            <div className="absolute bottom-4 left-4 rounded-full bg-card/95 px-2.5 py-1 text-[11px] font-medium text-muted-foreground shadow">
              {testimonyIndex + 1}/{TESTIMONIALS.length}
            </div>
          </div>
        </div>
      </section>

      {/* Trade desk CTA — matches sokoni-hero-banner.html's .trade-contact: giant title,
          two organically-rounded photos, contact pill. Same full-bleed green canvas as
          the hero/about/why blocks, so it closes the page on the same visual register. */}
      <section className="mb-3 bg-background">
        <div className="mx-auto max-w-[1800px] px-3 sm:px-5 lg:px-8">
          <div className="rounded-xl bg-[#eff8f0] px-[7%] py-16 sm:py-20 lg:py-24">
            <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1fr_0.6fr_0.85fr] lg:gap-8">
              <h2
                className="text-[56px] font-normal leading-[0.89] tracking-[-0.04em] text-[#123323] sm:text-[76px] lg:text-[6vw]"
                style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
              >
                {t.tradeTitleLine1}
                <br />
                {t.tradeTitleLine2}
                <br />
                {t.tradeTitleLine3}
                <br />
                {t.tradeTitleLine4}
              </h2>

              <div className="grid gap-2.5">
                <div className="aspect-[1.4] overflow-hidden rounded-[26px_26px_26px_64px]">
                  <img
                    src={avocadoHandfulImg}
                    alt="Avocats Hass Sokoni Export"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="aspect-[1.4] overflow-hidden rounded-[64px_26px_26px_26px]">
                  <img
                    src={pickerWomanImg}
                    alt="Récolte d'avocats au Kenya, ferme partenaire Sokoni Export"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>

              <div style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}>
                <h3 className="mb-3 text-2xl font-normal tracking-[-0.02em] text-[#142b21]">
                  {t.tradeDeskTitle}
                </h3>
                <p className="mb-5 text-sm leading-relaxed text-[#44554a]">{t.tradeDeskBody}</p>
                <Link
                  to="/contact"
                  className="inline-block rounded-full bg-[#0a4934] px-6 py-3 text-sm font-bold text-white"
                >
                  {t.tradeRfq}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
