import type { Lang } from "@/lib/language";

export type StageOwner = "sokoni" | "forwarder";

export interface Stage {
  key: string;
  label: Record<Lang, string>;
  owner: StageOwner;
  blurb: Record<Lang, string>;
  fields?: Record<Lang, string[]>;
}

export const STAGES: Stage[] = [
  {
    key: "farm",
    label: { fr: "Ferme", en: "Farm" },
    owner: "sokoni",
    blurb: {
      fr: "Lot attribué à un bloc de ferme certifié.",
      en: "Lot allocated to a certified farm block.",
    },
  },
  {
    key: "harvested",
    label: { fr: "Récolté", en: "Harvested" },
    owner: "sokoni",
    blurb: { fr: "Cueilli à la matière sèche cible.", en: "Picked at target dry matter." },
  },
  {
    key: "packhouse",
    label: { fr: "Conditionnement", en: "Packhouse" },
    owner: "sokoni",
    blurb: { fr: "Calibré, trié et emballé.", en: "Graded, sized and packed." },
  },
  {
    key: "quality_control",
    label: { fr: "Contrôle qualité", en: "Quality Control" },
    owner: "sokoni",
    blurb: {
      fr: "Analyse en laboratoire et inspection phytosanitaire.",
      en: "Lab analysis and phytosanitary inspection.",
    },
  },
  {
    key: "cold_storage",
    label: { fr: "Chambre froide", en: "Cold Storage" },
    owner: "sokoni",
    blurb: { fr: "Pré-refroidi et maintenu à 5–6 °C.", en: "Pre-cooled and held at 5–6 °C." },
  },
  {
    key: "export_clearance",
    label: { fr: "Dédouanement export", en: "Export Clearance" },
    owner: "forwarder",
    blurb: { fr: "Dédouanement à Nairobi.", en: "Nairobi customs clearance." },
    fields: {
      fr: ["Référence douane", "Date de dédouanement"],
      en: ["Customs reference", "Clearance date"],
    },
  },
  {
    key: "in_transit",
    label: { fr: "En transit", en: "In Transit" },
    owner: "forwarder",
    blurb: {
      fr: "Fret aérien ou navire réfrigéré en route.",
      en: "Airfreight or reefer vessel en route.",
    },
    fields: {
      fr: ["N° AWB / réservation", "Vol ou navire", "ETA"],
      en: ["AWB / booking number", "Flight or vessel", "ETA"],
    },
  },
  {
    key: "arrival_rungis",
    label: { fr: "Arrivée à Rungis", en: "Arrival Rungis" },
    owner: "forwarder",
    blurb: {
      fr: "Dédouanement import et arrivée à Rungis.",
      en: "Import clearance and arrival at Rungis.",
    },
    fields: {
      fr: ["Dédouanement import", "Horodatage d'arrivée"],
      en: ["Import clearance", "Arrival timestamp"],
    },
  },
  {
    key: "delivered",
    label: { fr: "Livré", en: "Delivered" },
    owner: "sokoni",
    blurb: { fr: "Reçu par l'acheteur.", en: "Received by the buyer." },
  },
];

export const FORWARDER_STAGE_KEYS = STAGES.filter((s) => s.owner === "forwarder").map((s) => s.key);

export function stageByKey(key: string): Stage | undefined {
  return STAGES.find((s) => s.key === key);
}

export function stageIndex(key: string): number {
  const i = STAGES.findIndex((s) => s.key === key);
  return i === -1 ? 0 : i;
}

export const ORDER_STATUSES = ["processing", "in_transit", "delivered"] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

const STATUS_LABEL: Record<OrderStatus, Record<Lang, string>> = {
  processing: { fr: "En traitement", en: "Processing" },
  in_transit: { fr: "En transit", en: "In Transit" },
  delivered: { fr: "Livré", en: "Delivered" },
};

export function statusLabel(status: string, lang: Lang = "fr"): string {
  const key = (ORDER_STATUSES as readonly string[]).includes(status)
    ? (status as OrderStatus)
    : "processing";
  return STATUS_LABEL[key][lang];
}
