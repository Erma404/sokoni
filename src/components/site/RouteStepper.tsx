import { useState } from "react";
import { STAGES, type StageOwner } from "@/lib/checkpoints";

type Point = {
  x: number;
  y: number;
  side: "top" | "bottom";
};

// True S-curve (sigmoid): top-left → steep diagonal through the middle → bottom-right.
// Nine points are placed along the single cubic-bezier S, parameterized by t.
const STAGE_POINTS: Point[] = [
  { x: 100, y: 120, side: "top" },      // Farm
  { x: 299, y: 138, side: "top" },      // Harvested
  { x: 456, y: 186, side: "top" },      // Packhouse
  { x: 585, y: 253, side: "top" },      // Quality Control
  { x: 700, y: 330, side: "bottom" },   // Cold Storage
  { x: 815, y: 407, side: "bottom" },   // Export Clearance
  { x: 944, y: 474, side: "bottom" },   // In Transit
  { x: 1101, y: 522, side: "bottom" },  // Arrival Rungis
  { x: 1300, y: 540, side: "bottom" },  // Delivered
];

const ROUTE_PATH = "M 100 120 C 700 120 700 540 1300 540";

const OWNER_LABEL: Record<StageOwner, string> = {
  sokoni: "Sokoni",
  forwarder: "Freight forwarder",
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

  return (
    <div className="relative mt-14">
      {/* Desktop: smooth S-curve route */}
      <svg
        viewBox="0 0 1400 680"
        className="hidden w-full overflow-visible md:block"
        role="img"
        aria-label="9-step farm-to-delivery route, select a step for details"
      >
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
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

        {STAGES.map((stage, i) => {
          const p = STAGE_POINTS[i];
          if (!p) return null;
          const isActive = activeKey === stage.key;
          const labelAbove = p.side === "top";
          const blurbLines = wrap(stage.blurb, BLURB_MAX_CHARS);
          const labelHeight = TITLE_LINE + 4 + blurbLines.length * BLURB_LINE;
          const titleY = labelAbove ? p.y - GAP - labelHeight : p.y + GAP;
          const blurbY = titleY + TITLE_LINE + 4;
          const blurbBottomY = blurbY + (blurbLines.length - 1) * BLURB_LINE;

          const panelWidth = 176;
          const panelHeight = 30 + (stage.fields?.length ?? 0) * 16;
          const panelX = p.x - panelWidth / 2;
          const panelY = labelAbove
            ? titleY - 10 - panelHeight
            : blurbBottomY + 18;

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
                aria-label={`${stage.label}. ${stage.blurb}`}
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
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={CIRCLE_R + 10}
                  fill="transparent"
                />
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
                    className={isActive ? "fill-card text-[16px] font-medium" : "fill-clay text-[16px] font-medium"}
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
                {stage.label}
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
                      {OWNER_LABEL[stage.owner]}
                    </span>
                    {stage.fields && stage.fields.length > 0 && (
                      <ul className="mt-1.5 space-y-0.5 text-left text-[11px] leading-tight text-muted-foreground">
                        {stage.fields.map((f) => (
                          <li key={f} className="flex items-start gap-1">
                            <span aria-hidden className="mt-1 size-1 shrink-0 rounded-full bg-clay" />
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
        <span
          aria-hidden
          className="absolute left-5 top-2 h-[calc(100%-1rem)] w-px bg-border"
        />
        {STAGES.map((s, i) => {
          const isActive = activeKey === s.key;
          return (
            <li key={s.key} className="relative flex gap-4 pr-2">
              <div className="flex flex-col items-center">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-clay/35 bg-card text-xs font-medium text-clay">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {i < STAGES.length - 1 && (
                  <span aria-hidden className="mt-1 w-px flex-1 bg-border" />
                )}
              </div>
              <button
                type="button"
                aria-expanded={isActive}
                onClick={() => setActiveKey((k) => (k === s.key ? null : s.key))}
                className="pb-1 text-left"
              >
                <div className="stencil text-sm font-medium text-primary">{s.label}</div>
                <p className="mt-1 text-base text-muted-foreground">{s.blurb}</p>
                {isActive && (
                  <div className="mt-2 rounded-lg border border-clay/40 bg-card px-3 py-2">
                    <span className="stencil inline-block rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-primary">
                      {OWNER_LABEL[s.owner]}
                    </span>
                    {s.fields && s.fields.length > 0 && (
                      <ul className="mt-1.5 space-y-0.5 text-left text-xs leading-tight text-muted-foreground">
                        {s.fields.map((f) => (
                          <li key={f} className="flex items-start gap-1">
                            <span aria-hidden className="mt-1.5 size-1 shrink-0 rounded-full bg-clay" />
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
