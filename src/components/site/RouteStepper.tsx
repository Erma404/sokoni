import { useState } from "react";
import { stageByKey, type StageOwner } from "@/lib/checkpoints";
import { useLanguage, type Lang } from "@/lib/language";

type Point = {
  x: number;
  y: number;
  side: "top" | "bottom";
};

interface Milestone {
  key: string;
  label: Record<Lang, string>;
  blurb: Record<Lang, string>;
  owner: StageOwner;
  fields: Record<Lang, string[]>;
}

// Groups the 9 real tracking checkpoints (src/lib/checkpoints.ts — unchanged,
// still drives order tracking on /track and /forwarder) into 6 visual
// milestones so the homepage stepper stays readable. Owner reflects who holds
// custody once each milestone completes; fields are the union of the
// underlying checkpoints' tracked data fields.
function milestone(
  key: string,
  label: Record<Lang, string>,
  blurb: Record<Lang, string>,
  stageKeys: string[],
): Milestone {
  const stages = stageKeys
    .map((k) => stageByKey(k))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));
  return {
    key,
    label,
    blurb,
    owner: stages[stages.length - 1]?.owner ?? "sokoni",
    fields: {
      fr: stages.flatMap((s) => s.fields?.fr ?? []),
      en: stages.flatMap((s) => s.fields?.en ?? []),
    },
  };
}

const MILESTONES: Milestone[] = [
  milestone(
    "farm",
    { fr: "Ferme", en: "Farm" },
    {
      fr: "Lot attribué à un bloc de ferme certifié.",
      en: "Lot allocated to a certified farm block.",
    },
    ["farm"],
  ),
  milestone(
    "harvested",
    { fr: "Récolté", en: "Harvested" },
    { fr: "Cueilli à la matière sèche cible.", en: "Picked at target dry matter." },
    ["harvested"],
  ),
  milestone(
    "packed",
    { fr: "Conditionné & inspecté", en: "Packed & Inspected" },
    {
      fr: "Calibré, trié, emballé et validé en laboratoire pour l'export.",
      en: "Graded, sized, packed and lab-cleared for export.",
    },
    ["packhouse", "quality_control"],
  ),
  milestone(
    "cold_export",
    { fr: "Chaîne du froid & export", en: "Cold Chain & Export" },
    {
      fr: "Pré-refroidi à 5–6 °C, puis dédouané à Nairobi.",
      en: "Pre-cooled at 5–6 °C, then cleared through Nairobi customs.",
    },
    ["cold_storage", "export_clearance"],
  ),
  milestone(
    "transit",
    { fr: "Transit & arrivée", en: "In Transit & Arrival" },
    {
      fr: "Fret aérien ou navire réfrigéré, dédouané à l'arrivée à Rungis.",
      en: "Airfreight or reefer vessel, cleared on arrival at Rungis.",
    },
    ["in_transit", "arrival_rungis"],
  ),
  milestone(
    "delivered",
    { fr: "Livré", en: "Delivered" },
    { fr: "Reçu par l'acheteur.", en: "Received by the buyer." },
    ["delivered"],
  ),
];

// Same single cubic-bezier S-curve as before, now sampled at 6 evenly spaced
// points (t = i/5) instead of 9.
const STAGE_POINTS: Point[] = [
  { x: 100, y: 120, side: "top" }, // Farm
  { x: 398, y: 164, side: "top" }, // Harvested
  { x: 609, y: 268, side: "top" }, // Packed & Inspected
  { x: 791, y: 392, side: "bottom" }, // Cold Chain & Export
  { x: 1002, y: 496, side: "bottom" }, // In Transit & Arrival
  { x: 1300, y: 540, side: "bottom" }, // Delivered
];

const ROUTE_PATH = "M 100 120 C 700 120 700 540 1300 540";

const OWNER_LABEL: Record<StageOwner, Record<Lang, string>> = {
  sokoni: { fr: "Sokoni", en: "Sokoni" },
  forwarder: { fr: "Transitaire", en: "Freight forwarder" },
};

const BLURB_MAX_CHARS = 18;
const TITLE_SIZE = 16;
const BLURB_SIZE = 13;
const TITLE_LINE = 17;
const BLURB_LINE = 15;
const GAP = 34;
const CIRCLE_R = 24;

function wrap(text: string, maxChars: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length > maxChars) {
      if (current) lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }
  if (current) lines.push(current);
  return lines.length ? lines : [text];
}

export function RouteStepper() {
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const { lang } = useLanguage();
  const srLabel =
    lang === "fr"
      ? "Parcours en 6 étapes, de la ferme à la livraison — sélectionnez une étape pour le détail"
      : "6-milestone farm-to-delivery route, select a milestone for details";

  return (
    <div className="relative mt-14">
      {/* Desktop: smooth S-curve route */}
      <svg
        viewBox="0 0 1400 680"
        className="hidden w-full overflow-visible md:block"
        role="img"
        aria-label={srLabel}
      >
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="currentColor" className="text-clay" />
          </marker>
        </defs>

        {/* Road bed */}
        <path
          d={ROUTE_PATH}
          fill="none"
          stroke="currentColor"
          strokeWidth="12"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-ochre/30"
        />
        {/* Road line */}
        <path
          d={ROUTE_PATH}
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          markerEnd="url(#arrowhead)"
          className="text-clay"
        />

        {/* Dashed center line */}
        <path
          d={ROUTE_PATH}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray="12 14"
          strokeLinecap="round"
          className="text-background/60"
        />

        {MILESTONES.map((stage, i) => {
          const p = STAGE_POINTS[i];
          if (!p) return null;
          const isActive = activeKey === stage.key;
          const labelAbove = p.side === "top";
          const label = stage.label[lang];
          const blurb = stage.blurb[lang];
          const fields = stage.fields[lang];
          const blurbLines = wrap(blurb, BLURB_MAX_CHARS);
          const labelHeight = TITLE_LINE + 4 + blurbLines.length * BLURB_LINE;
          const titleY = labelAbove ? p.y - GAP - labelHeight : p.y + GAP;
          const blurbY = titleY + TITLE_LINE + 4;
          const blurbBottomY = blurbY + (blurbLines.length - 1) * BLURB_LINE;

          const panelWidth = 176;
          const panelHeight = 30 + fields.length * 16;
          const panelX = p.x - panelWidth / 2;
          const panelY = labelAbove ? titleY - 10 - panelHeight : blurbBottomY + 18;

          const activate = () => setActiveKey(stage.key);
          const deactivate = () => setActiveKey((k) => (k === stage.key ? null : k));
          const toggle = () => setActiveKey((k) => (k === stage.key ? null : stage.key));

          return (
            <g key={stage.key}>
              {/* Interactive marker */}
              <g
                role="button"
                tabIndex={0}
                aria-pressed={isActive}
                aria-label={`${label}. ${blurb}`}
                className="cursor-pointer outline-none"
                onMouseEnter={activate}
                onMouseLeave={deactivate}
                onFocus={activate}
                onBlur={deactivate}
                onClick={toggle}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    toggle();
                  }
                }}
              >
                <circle cx={p.x} cy={p.y} r={CIRCLE_R + 10} fill="transparent" />
                <g
                  style={{
                    transformBox: "fill-box",
                    transformOrigin: "center",
                    transform: isActive ? "scale(1.2)" : "scale(1)",
                    transition: "transform 180ms ease",
                  }}
                >
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={CIRCLE_R}
                    strokeWidth="2"
                    className={isActive ? "fill-clay stroke-clay" : "fill-card stroke-clay"}
                    style={{ transition: "fill 180ms ease" }}
                  />
                  <text
                    x={p.x}
                    y={p.y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    className={
                      isActive
                        ? "fill-card text-[16px] font-medium"
                        : "fill-clay text-[16px] font-medium"
                    }
                    style={{ fontFamily: "var(--font-display)", transition: "fill 180ms ease" }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </text>
                </g>
              </g>

              {/* Title label */}
              <text
                x={p.x}
                y={titleY}
                textAnchor="middle"
                dominantBaseline="hanging"
                className="fill-primary font-medium"
                stroke="var(--color-background)"
                strokeWidth="4"
                paintOrder="stroke"
                strokeLinejoin="round"
                style={{ fontFamily: "var(--font-display)", fontSize: TITLE_SIZE }}
              >
                {label}
              </text>

              {/* Blurb label (multi-line) */}
              <text
                x={p.x}
                y={blurbY}
                textAnchor="middle"
                dominantBaseline="hanging"
                className="fill-muted-foreground"
                stroke="var(--color-background)"
                strokeWidth="3"
                paintOrder="stroke"
                strokeLinejoin="round"
                style={{ fontFamily: "var(--font-sans)", fontSize: BLURB_SIZE }}
              >
                {blurbLines.map((line, li) => (
                  <tspan key={li} x={p.x} dy={li === 0 ? 0 : BLURB_LINE}>
                    {line}
                  </tspan>
                ))}
              </text>

              {/* Detail panel, shown on hover / focus / tap */}
              {isActive && (
                <foreignObject
                  x={panelX}
                  y={panelY}
                  width={panelWidth}
                  height={panelHeight}
                  className="pointer-events-none overflow-visible"
                >
                  <div className="rounded-lg border border-clay/40 bg-card px-3 py-2 text-center shadow-lg">
                    <span className="stencil inline-block rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-primary">
                      {OWNER_LABEL[stage.owner][lang]}
                    </span>
                    {fields.length > 0 && (
                      <ul className="mt-1.5 space-y-0.5 text-left text-[11px] leading-tight text-muted-foreground">
                        {fields.map((f) => (
                          <li key={f} className="flex items-start gap-1">
                            <span
                              aria-hidden
                              className="mt-1 size-1 shrink-0 rounded-full bg-clay"
                            />
                            {f}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </foreignObject>
              )}
            </g>
          );
        })}
      </svg>

      {/* Mobile: vertical stacked stepper */}
      <ol className="relative space-y-6 md:hidden">
        <span aria-hidden className="absolute left-5 top-2 h-[calc(100%-1rem)] w-px bg-border" />
        {MILESTONES.map((stage, i) => {
          const isActive = activeKey === stage.key;
          const fields = stage.fields[lang];
          return (
            <li key={stage.key} className="relative flex gap-4 pr-2">
              <div className="flex flex-col items-center">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-clay/35 bg-card text-xs font-medium text-clay">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {i < MILESTONES.length - 1 && (
                  <span aria-hidden className="mt-1 w-px flex-1 bg-border" />
                )}
              </div>
              <button
                type="button"
                aria-expanded={isActive}
                onClick={() => setActiveKey((k) => (k === stage.key ? null : stage.key))}
                className="pb-1 text-left"
              >
                <div className="stencil text-sm font-medium text-primary">{stage.label[lang]}</div>
                <p className="mt-1 text-base text-muted-foreground">{stage.blurb[lang]}</p>
                {isActive && (
                  <div className="mt-2 rounded-lg border border-clay/40 bg-card px-3 py-2">
                    <span className="stencil inline-block rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-primary">
                      {OWNER_LABEL[stage.owner][lang]}
                    </span>
                    {fields.length > 0 && (
                      <ul className="mt-1.5 space-y-0.5 text-left text-xs leading-tight text-muted-foreground">
                        {fields.map((f) => (
                          <li key={f} className="flex items-start gap-1">
                            <span
                              aria-hidden
                              className="mt-1.5 size-1 shrink-0 rounded-full bg-clay"
                            />
                            {f}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
