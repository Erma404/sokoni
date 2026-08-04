export type StageOwner = "sokoni" | "forwarder";

export interface Stage {
  key: string;
  label: string;
  owner: StageOwner;
  blurb: string;
  fields?: string[];
}

export const STAGES: Stage[] = [
  { key: "farm", label: "Farm", owner: "sokoni", blurb: "Lot allocated to a certified farm block." },
  { key: "harvested", label: "Harvested", owner: "sokoni", blurb: "Picked at target dry matter." },
  { key: "packhouse", label: "Packhouse", owner: "sokoni", blurb: "Graded, sized and packed." },
  {
    key: "quality_control",
    label: "Quality Control",
    owner: "sokoni",
    blurb: "Lab analysis and phytosanitary inspection.",
  },
  {
    key: "cold_storage",
    label: "Cold Storage",
    owner: "sokoni",
    blurb: "Pre-cooled and held at 5–6 °C.",
  },
  {
    key: "export_clearance",
    label: "Export Clearance",
    owner: "forwarder",
    blurb: "Nairobi customs clearance.",
    fields: ["Customs reference", "Clearance date"],
  },
  {
    key: "in_transit",
    label: "In Transit",
    owner: "forwarder",
    blurb: "Airfreight or reefer vessel en route.",
    fields: ["AWB / booking number", "Flight or vessel", "ETA"],
  },
  {
    key: "arrival_rungis",
    label: "Arrival Rungis",
    owner: "forwarder",
    blurb: "Import clearance and arrival at Rungis.",
    fields: ["Import clearance", "Arrival timestamp"],
  },
  { key: "delivered", label: "Delivered", owner: "sokoni", blurb: "Received by the buyer." },
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

export function statusLabel(status: string): string {
  if (status === "in_transit") return "In Transit";
  if (status === "delivered") return "Delivered";
  return "Processing";
}
