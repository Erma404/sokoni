import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useRfq, useSession } from "@/lib/app-context";
import { useLanguage, useT, type Lang } from "@/lib/language";
import { Button } from "@/components/ui/button";
import { Wordmark } from "@/components/site/Brand";
import { cn } from "@/lib/utils";

const NAV: { to: string; label: Record<Lang, string> }[] = [
  { to: "/catalog", label: { fr: "Catalogue", en: "Catalog" } },
  { to: "/track", label: { fr: "Suivi", en: "Track" } },
  { to: "/farms", label: { fr: "Fermes & qualité", en: "Farms & Quality" } },
  { to: "/logistics", label: { fr: "Logistique", en: "Logistics" } },
];

const COPY = {
  fr: {
    contact: "Nous contacter",
    rfq: "Devis",
    backOffice: "Back-office",
    myOrders: "Mes commandes",
    signOut: "Se déconnecter",
    signIn: "Se connecter",
    toggleNav: "Ouvrir/fermer la navigation",
    rfqCart: "Panier de devis",
    footerTagline:
      "Avocat Hass en commerce direct depuis des fermes kenyanes certifiées jusqu'au marché de gros de Rungis, Paris.",
    trade: "Commerce",
    catalog: "Catalogue",
    requestQuote: "Demander un devis",
    requestSample: "Demander un échantillon",
    incoterms: "Incoterms & délais",
    origin: "Origine",
    farmsQuality: "Fermes & qualité",
    trackShipment: "Suivre une commande",
    copyright: "Nairobi · Rungis",
  },
  en: {
    contact: "Contact us",
    rfq: "RFQ",
    backOffice: "Back-office",
    myOrders: "My orders",
    signOut: "Sign out",
    signIn: "Sign in",
    toggleNav: "Toggle navigation",
    rfqCart: "RFQ cart",
    footerTagline:
      "Direct-trade Hass avocado from certified Kenyan farms to the Rungis wholesale market, Paris.",
    trade: "Trade",
    catalog: "Catalog",
    requestQuote: "Request a quote",
    requestSample: "Request a sample",
    incoterms: "Incoterms & lead times",
    origin: "Origin",
    farmsQuality: "Farms & quality",
    trackShipment: "Track a shipment",
    copyright: "Nairobi · Rungis",
  },
};

function LanguageSwitch({ className }: { className?: string }) {
  const { lang, setLang } = useLanguage();
  return (
    <div
      className={cn(
        "flex items-center overflow-hidden rounded-full border border-border text-xs font-medium",
        className,
      )}
      role="group"
      aria-label="Language"
    >
      {(["fr", "en"] as const).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          className={cn(
            "px-2.5 py-1.5 uppercase tracking-wide transition-colors",
            lang === l
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {l}
        </button>
      ))}
    </div>
  );
}

export function Header() {
  const { user, isAdmin } = useSession();
  const { count } = useRfq();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const t = useT(COPY);

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/", replace: true });
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link
          to="/"
          aria-label="Sokoni Export home"
          className="transition-opacity hover:opacity-70"
        >
          <Wordmark />
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: "text-foreground font-medium" }}
            >
              {item.label[lang]}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <LanguageSwitch className="mr-1" />
          <Link to="/contact">
            <Button variant="clay" size="sm">
              {t.contact}
            </Button>
          </Link>
          <Link to="/rfq">
            <Button variant="ghost" size="sm">
              {t.rfq}
              <span
                className={cn(
                  "ml-1 rounded-full px-1.5 py-0.5 text-[0.65rem] font-semibold",
                  count > 0 ? "bg-clay text-clay-foreground" : "bg-muted text-muted-foreground",
                )}
              >
                {count}
              </span>
            </Button>
          </Link>
          {isAdmin && (
            <Link to="/admin">
              <Button variant="ghost" size="sm">
                {t.backOffice}
              </Button>
            </Link>
          )}
          {user ? (
            <>
              <Link to="/dashboard">
                <Button variant="outline" size="sm">
                  {t.myOrders}
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={signOut}>
                {t.signOut}
              </Button>
            </>
          ) : (
            <Link to="/auth">
              <Button size="sm">{t.signIn}</Button>
            </Link>
          )}
        </div>

        <div className="flex items-center gap-3 md:hidden">
          <LanguageSwitch />
          <button className="shrink-0" onClick={() => setOpen((v) => !v)} aria-label={t.toggleNav}>
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-background px-5 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="text-sm text-foreground"
              >
                {item.label[lang]}
              </Link>
            ))}
            <Link to="/contact" onClick={() => setOpen(false)} className="text-sm text-clay">
              {t.contact}
            </Link>
            <Link to="/rfq" onClick={() => setOpen(false)} className="text-sm text-foreground">
              {t.rfqCart} ({count})
            </Link>
            {isAdmin && (
              <Link to="/admin" onClick={() => setOpen(false)} className="text-sm text-foreground">
                {t.backOffice}
              </Link>
            )}
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setOpen(false)}
                  className="text-sm text-foreground"
                >
                  {t.myOrders}
                </Link>
                <button className="text-left text-sm text-muted-foreground" onClick={signOut}>
                  {t.signOut}
                </button>
              </>
            ) : (
              <Link to="/auth" onClick={() => setOpen(false)} className="text-sm text-foreground">
                {t.signIn}
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export function Footer() {
  const t = useT(COPY);
  return (
    <footer className="relative mt-24 overflow-hidden border-t border-border bg-primary text-primary-foreground">
      <div className="relative mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:grid-cols-3">
        <div>
          <Wordmark tone="invert" />

          <p className="mt-3 max-w-xs text-sm text-primary-foreground/70">{t.footerTagline}</p>
        </div>
        <div className="text-sm">
          <div className="eyebrow text-primary-foreground/60">{t.trade}</div>
          <ul className="mt-3 space-y-2 text-primary-foreground/80">
            <li>
              <Link to="/catalog">{t.catalog}</Link>
            </li>
            <li>
              <Link to="/rfq">{t.requestQuote}</Link>
            </li>
            <li>
              <Link to="/sample-request">{t.requestSample}</Link>
            </li>
            <li>
              <Link to="/logistics">{t.incoterms}</Link>
            </li>
            <li>
              <Link to="/contact">{t.contact}</Link>
            </li>
          </ul>
        </div>
        <div className="text-sm">
          <div className="eyebrow text-primary-foreground/60">{t.origin}</div>
          <ul className="mt-3 space-y-2 text-primary-foreground/80">
            <li>
              <Link to="/farms">{t.farmsQuality}</Link>
            </li>
            <li>
              <Link to="/track">{t.trackShipment}</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="relative border-t border-primary-foreground/15">
        <div className="mx-auto max-w-6xl px-5 py-5 text-xs text-primary-foreground/50">
          © {new Date().getFullYear()} Sokoni Export — {t.copyright}
        </div>
      </div>
    </footer>
  );
}
