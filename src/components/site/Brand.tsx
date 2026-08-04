import { cn } from "@/lib/utils";

/**
 * Sokoni mark — a simple avocado-inspired glyph: one solid round body with an
 * offset ochre stone. Two shapes only, legible down to 16px.
 */
export function SokoniMark({
  className,
  title = "Sokoni Export",
}: {
  className?: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={cn("size-8", className)}
      role="img"
      aria-label={title}
      fill="none"
    >
      <circle cx="24" cy="24" r="22" fill="currentColor" />
      <circle cx="29.5" cy="24" r="8.5" fill="var(--color-ochre)" />
    </svg>
  );
}


export function Wordmark({ className, tone = "default" }: { className?: string; tone?: "default" | "invert" }) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <SokoniMark className={tone === "invert" ? "size-8 text-primary-foreground" : "size-8 text-primary"} />
      <span className="leading-none">
        <span
          className={cn(
            "stencil block text-lg font-medium tracking-tight",
            tone === "invert" ? "text-primary-foreground" : "text-primary",
          )}
        >
          Sokoni
        </span>
        <span
          className={cn(
            "block text-[0.6rem] font-medium uppercase tracking-[0.3em]",
            tone === "invert" ? "text-primary-foreground/60" : "text-clay",
          )}
        >
          Export
        </span>
      </span>
    </span>
  );
}

/** Thin arc / route-line field used behind heroes and dark bands. */
export function ArcField({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 1200 400"
      preserveAspectRatio="none"
      className={cn("pointer-events-none absolute inset-0 h-full w-full", className)}
      fill="none"
    >
      <path d="M-40 340C220 340 300 120 560 120s360 180 700 180" stroke="currentColor" strokeWidth="1.5" opacity="0.35" />
      <path d="M-40 400C260 400 340 60 640 60s340 200 640 200" stroke="currentColor" strokeWidth="1" opacity="0.2" />
      <path d="M-40 260C180 260 260 200 520 200s420 120 720 120" stroke="currentColor" strokeWidth="1" opacity="0.15" />
    </svg>
  );
}

/** Section divider: a single curved route line with an ochre travelling dot. */
export function ArcDivider({ className }: { className?: string }) {
  return (
    <div className={cn("mx-auto max-w-6xl px-5", className)}>
      <svg viewBox="0 0 1000 40" className="h-10 w-full" fill="none" aria-hidden>
        <path
          d="M0 32C160 32 220 8 500 8s340 24 500 24"
          stroke="var(--color-border)"
          strokeWidth="1.5"
        />
        <path
          d="M0 32C160 32 220 8 500 8"
          stroke="var(--color-clay)"
          strokeWidth="1.5"
          opacity="0.6"
        />
        <circle cx="500" cy="8" r="4" fill="var(--color-ochre)" />
      </svg>
    </div>
  );
}
