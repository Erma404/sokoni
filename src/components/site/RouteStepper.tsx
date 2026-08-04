import { STAGES } from "@/lib/checkpoints";

type Point = {
  x: number;
  y: number;
  side: "top" | "bottom";
};

// True S-curve (sigmoid): top-left → steep diagonal through the middle → bottom-right.
// Nine points are placed along the single cubic-bezier S, parameterized by t.
const STAGE_POINTS: Point[] = [
  { x: 100, y: 100, side: "top" },      // Farm
  { x: 299, y: 118, side: "top" },      // Harvested
  { x: 456, y: 166, side: "top" },      // Packhouse
  { x: 585, y: 233, side: "top" },      // Quality Control
  { x: 700, y: 310, side: "bottom" },   // Cold Storage
  { x: 815, y: 387, side: "bottom" },   // Export Clearance
  { x: 944, y: 454, side: "bottom" },   // In Transit
  { x: 1101, y: 502, side: "bottom" },  // Arrival Rungis
  { x: 1300, y: 520, side: "bottom" },  // Delivered
];

const ROUTE_PATH = "M 100 100 C 700 100 700 520 1300 520";

const BLURB_MAX_CHARS = 18;
const TITLE_SIZE = 12;
const BLURB_SIZE = 10;
const TITLE_LINE = 12;
const BLURB_LINE = 11;
const GAP = 30;

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
  return (
    <div className="relative mt-14">
      {/* Desktop: smooth S-curve route */}
      <svg
        viewBox="0 0 1400 620"
        className="hidden w-full overflow-visible md:block"
        role="img"
        aria-label="9-step farm-to-delivery route"
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
          const labelAbove = p.side === "top";
          const blurbLines = wrap(stage.blurb, BLURB_MAX_CHARS);
          const labelHeight = TITLE_LINE + 4 + blurbLines.length * BLURB_LINE;
          const titleY = labelAbove
            ? p.y - GAP - labelHeight
            : p.y + GAP;
          const blurbY = titleY + TITLE_LINE + 4;

          return (
            <g key={stage.key}>
              {/* Numbered marker */}
              <circle cx={p.x} cy={p.y} r="22" className="fill-card stroke-clay" strokeWidth="2" />
              <text
                x={p.x}
                y={p.y}
                textAnchor="middle"
                dominantBaseline="central"
                className="fill-clay text-[14px] font-medium"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {String(i + 1).padStart(2, "0")}
              </text>

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
                  <tspan
                    key={li}
                    x={p.x}
                    dy={li === 0 ? 0 : BLURB_LINE}
                  >
                    {line}
                  </tspan>
                ))}
              </text>
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
        {STAGES.map((s, i) => (
          <li key={s.key} className="relative flex gap-4 pr-2">
            <div className="flex flex-col items-center">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-clay/35 bg-card text-xs font-medium text-clay">
                {String(i + 1).padStart(2, "0")}
              </span>
              {i < STAGES.length - 1 && (
                <span aria-hidden className="mt-1 w-px flex-1 bg-border" />
              )}
            </div>
            <div className="pb-1">
              <div className="stencil text-xs font-medium text-primary">{s.label}</div>
              <p className="mt-1 text-sm text-muted-foreground">{s.blurb}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
