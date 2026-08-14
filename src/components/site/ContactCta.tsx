import { Link, useLocation } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useT } from "@/lib/language";
import { Button } from "@/components/ui/button";

const COPY = {
  fr: {
    eyebrow: "Une question ?",
    title: "Parlons de votre commande",
    body: "Volumes, calibres, Incoterm ou simple question — notre bureau commercial et logistique à Paris répond sous un jour ouvré.",
    cta: "Nous contacter",
  },
  en: {
    eyebrow: "Got a question?",
    title: "Let's talk about your order",
    body: "Volumes, calibers, Incoterm or a simple question — our trade and logistics desk in Paris answers within one working day.",
    cta: "Contact us",
  },
};

/** Closing contact CTA rendered on every page (see __root.tsx), just above the footer. */
export function ContactCta() {
  const t = useT(COPY);
  const { pathname } = useLocation();

  // The homepage has its own trade-desk contact CTA already — this closing
  // band would just repeat it in the old (pre-refresh) card style.
  if (pathname === "/contact" || pathname === "/") return null;

  return (
    <section className="mx-auto mt-24 max-w-6xl px-5">
      <div className="flex flex-wrap items-center justify-between gap-6 rounded-3xl border border-border bg-secondary px-8 py-10 sm:px-10">
        <div>
          <p className="eyebrow">{t.eyebrow}</p>
          <h2 className="stencil mt-2 text-xl font-medium text-primary sm:text-2xl">{t.title}</h2>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">{t.body}</p>
        </div>
        <Link to="/contact" className="shrink-0">
          <Button variant="lime">
            {t.cta}
            <ArrowRight className="size-4" />
          </Button>
        </Link>
      </div>
    </section>
  );
}
