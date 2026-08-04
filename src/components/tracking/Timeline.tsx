import { Check, Circle, FileText, Loader2 } from "lucide-react";
import { STAGES, stageIndex } from "@/lib/checkpoints";
import { dateTime } from "@/lib/format";
import { cn } from "@/lib/utils";

export interface TrackingEvent {
  id: string;
  checkpoint: string;
  stage_index: number;
  status: string;
  location: string | null;
  occurred_at: string;
  notes: string | null;
  reference: string | null;
  temperature_c: number | null;
  document_url: string | null;
  document_label: string | null;
}

export function currentStage(events: TrackingEvent[]): number {
  if (!events.length) return -1;
  return Math.max(...events.map((e) => e.stage_index));
}

export function Timeline({ events }: { events: TrackingEvent[] }) {
  const reached = currentStage(events);

  return (
    <ol className="relative">
      {STAGES.map((stage, i) => {
        const event = events.find((e) => e.checkpoint === stage.key);
        const done = i <= reached;
        const active = i === reached;
        const last = i === STAGES.length - 1;

        return (
          <li key={stage.key} className="relative flex gap-4 pb-8 last:pb-0">
            {!last && (
              <svg
                aria-hidden
                viewBox="0 0 24 100"
                preserveAspectRatio="none"
                className="absolute left-0 top-6 h-full w-6"
                fill="none"
              >
                <path
                  d="M12 0C12 30 22 40 12 60C2 80 12 88 12 100"
                  stroke={
                    done && i < reached ? "var(--color-primary)" : "var(--color-border)"
                  }
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            )}
            <span
              className={cn(
                "relative z-10 mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border",
                done
                  ? active
                    ? "border-clay bg-clay text-clay-foreground ring-4 ring-ochre/30"
                    : "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-muted-foreground",
              )}
            >
              {done ? (
                active && !last ? (
                  <Loader2 className="size-3 animate-spin" />
                ) : (
                  <Check className="size-3" />
                )
              ) : (
                <Circle className="size-2" />
              )}
            </span>


            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                <h3
                  className={cn(
                    "stencil text-sm font-medium",
                    done ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {stage.label}
                </h3>
                <span className="text-xs tabular-nums text-muted-foreground">
                  {event ? dateTime(event.occurred_at) : "Pending"}
                </span>
              </div>

              <p className="mt-1 text-sm text-muted-foreground">{event?.notes || stage.blurb}</p>

              {event && (
                <dl className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-xs text-muted-foreground">
                  {event.location && (
                    <div>
                      <dt className="inline eyebrow">Location </dt>
                      <dd className="inline text-foreground">{event.location}</dd>
                    </div>
                  )}
                  {event.reference && (
                    <div>
                      <dt className="inline eyebrow">Ref </dt>
                      <dd className="inline font-mono text-foreground">{event.reference}</dd>
                    </div>
                  )}
                  {event.temperature_c !== null && event.temperature_c !== undefined && (
                    <div>
                      <dt className="inline eyebrow">Temp </dt>
                      <dd className="inline text-foreground">{event.temperature_c} °C</dd>
                    </div>
                  )}
                </dl>
              )}

              {event?.document_url && (
                <a
                  href={event.document_url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex items-center gap-2 rounded-sm border border-border bg-card px-3 py-1.5 text-xs text-foreground transition-colors hover:border-primary"
                >
                  <FileText className="size-3.5" />
                  {event.document_label || "Attached document"}
                </a>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export function DocumentList({ events }: { events: TrackingEvent[] }) {
  const docs = events.filter((e) => e.document_url);
  if (!docs.length) {
    return (
      <p className="text-sm text-muted-foreground">
        Documents are attached to the shipment as each checkpoint is cleared.
      </p>
    );
  }
  return (
    <ul className="divide-y divide-border">
      {docs.map((d) => (
        <li key={d.id}>
          <a
            href={d.document_url!}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between gap-3 py-3 text-sm transition-colors hover:text-clay"
          >
            <span className="flex items-center gap-2">
              <FileText className="size-4 shrink-0 text-muted-foreground" />
              {d.document_label || "Document"}
            </span>
            <span className="text-xs text-muted-foreground">{stageLabel(d.checkpoint)}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}

function stageLabel(key: string) {
  return STAGES[stageIndex(key)]?.label ?? key;
}

export function RouteMap({ progress }: { progress: number }) {
  const p = Math.max(0, Math.min(1, progress));
  // Quadratic bezier from Nairobi (right/bottom) to Rungis (left/top)
  const from = { x: 300, y: 190 };
  const ctrl = { x: 190, y: 40 };
  const to = { x: 70, y: 60 };
  const pos = {
    x: (1 - p) ** 2 * from.x + 2 * (1 - p) * p * ctrl.x + p ** 2 * to.x,
    y: (1 - p) ** 2 * from.y + 2 * (1 - p) * p * ctrl.y + p ** 2 * to.y,
  };

  return (
    <svg viewBox="0 0 360 230" className="h-auto w-full" role="img" aria-label="Shipping route from Kenya to Rungis, Paris">
      <rect x="0" y="0" width="360" height="230" fill="var(--color-secondary)" rx="16" />
      <path
        d={`M ${from.x} ${from.y} Q ${ctrl.x} ${ctrl.y} ${to.x} ${to.y}`}
        fill="none"
        stroke="var(--color-border)"
        strokeWidth="2"
        strokeDasharray="5 5"
      />
      <path
        d={`M ${from.x} ${from.y} Q ${ctrl.x} ${ctrl.y} ${to.x} ${to.y}`}
        fill="none"
        stroke="var(--color-clay)"
        strokeWidth="2.5"
        pathLength={1}
        strokeDasharray={`${p} 1`}
      />
      <circle cx={from.x} cy={from.y} r="4.5" fill="var(--color-primary)" />
      <circle cx={to.x} cy={to.y} r="4.5" fill="var(--color-primary)" />
      <circle cx={pos.x} cy={pos.y} r="7" fill="var(--color-ochre)" opacity="0.35" />
      <circle cx={pos.x} cy={pos.y} r="3.5" fill="var(--color-ochre)" />
      <text
        x={from.x - 6}
        y={from.y + 20}
        textAnchor="end"
        fontSize="10"
        fill="var(--color-muted-foreground)"
        letterSpacing="1.5"
      >
        NAIROBI, KE
      </text>
      <text
        x={to.x}
        y={to.y - 14}
        fontSize="10"
        fill="var(--color-muted-foreground)"
        letterSpacing="1.5"
      >
        RUNGIS, FR
      </text>
    </svg>
  );
}
