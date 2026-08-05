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

  if (pathname === "/contact") return null;

  return (
    <section className="border-b border-primary-foreground/15 bg-primary text-primary-foreground">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-6 px-5 py-12">
        <div>
          <p className="eyebrow text-primary-foreground/60">{t.eyebrow}</p>
          <h2 className="stencil mt-2 text-xl font-medium sm:text-2xl">{t.title}</h2>
          <p className="mt-2 max-w-xl text-sm text-primary-foreground/75">{t.body}</p>
        </div>
        <Link to="/contact" className="shrink-0">
          <Button variant="clay">
            {t.cta}
            <ArrowRight className="size-4" />
          </Button>
        </Link>
      </div>
    </section>
  );
}
