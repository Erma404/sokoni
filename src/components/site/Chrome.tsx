import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowUpRight, Menu, X } from "lucide-react";
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
    footerHeadline: "Restons en contact",
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
    footerHeadline: "Let's stay in touch",
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
      <div className="mx-auto grid h-20 max-w-6xl grid-cols-[auto_1fr_auto] items-center gap-4 px-5">
        <Link
          to="/"
          aria-label="Sokoni Export home"
          className="transition-opacity hover:opacity-70"
        >
          <Wordmark />
        </Link>

        <nav className="hidden items-center justify-center gap-8 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="text-sm text-foreground/70 transition-colors hover:text-primary"
              activeProps={{ className: "text-primary font-medium" }}
            >
              {item.label[lang]}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center justify-end gap-4 md:flex">
          <LanguageSwitch />
          <Link
            to="/rfq"
            className="flex items-center gap-1 text-sm text-foreground/70 transition-colors hover:text-primary"
          >
            {t.rfq}
            <span
              className={cn(
                "flex size-4 items-center justify-center rounded-full text-[0.6rem] font-semibold",
                count > 0 ? "bg-clay text-clay-foreground" : "bg-muted text-muted-foreground",
              )}
            >
              {count}
            </span>
          </Link>
          {isAdmin && (
            <Link
              to="/admin"
              className="text-sm text-foreground/70 transition-colors hover:text-primary"
            >
              {t.backOffice}
            </Link>
          )}
          {user ? (
            <>
              <Link
                to="/dashboard"
                className="text-sm text-foreground/70 transition-colors hover:text-primary"
              >
                {t.myOrders}
              </Link>
              <button
                onClick={signOut}
                className="text-sm text-foreground/70 transition-colors hover:text-primary"
              >
                {t.signOut}
              </button>
            </>
          ) : (
            <Link
              to="/auth"
              className="text-sm text-foreground/70 transition-colors hover:text-primary"
            >
              {t.signIn}
            </Link>
          )}
          <Link to="/rfq">
            <span className="stencil inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground transition-colors hover:bg-primary/90">
              {t.requestQuote}
              <ArrowUpRight className="size-3.5" />
            </span>
          </Link>
        </div>

        <div className="col-start-3 flex items-center gap-3 md:hidden">
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
    <footer className="mt-3 bg-background">
      <div className="mx-auto max-w-[1800px] px-3 sm:px-5 lg:px-8">
        <div className="rounded-xl bg-[#f4f4f2] px-[7%] py-16 sm:py-20">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-8">
            <div className="text-center lg:text-left">
              <span className="inline-block">
                <Wordmark />
              </span>
              <h2
                className="mt-6 text-4xl font-normal tracking-[-0.03em] text-[#142b21] sm:text-5xl"
                style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
              >
                {t.footerHeadline}
              </h2>
              <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-[#44554a] lg:mx-0">
                {t.footerTagline}
              </p>
              <Link to="/rfq" className="mt-6 inline-block">
                <span className="inline-flex items-center gap-2 rounded-full bg-[#72c635] px-6 py-3 text-sm font-bold text-[#173d26]">
                  {t.requestQuote}
                  <ArrowUpRight className="size-3.5" />
                </span>
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-8 sm:grid-cols-2">
              <div className="text-sm">
                <div className="stencil text-xs text-[#142b21]">{t.trade}</div>
                <ul className="mt-4 space-y-2.5 text-[#44554a]">
                  <li>
                    <Link to="/catalog" className="hover:text-primary">
                      {t.catalog}
                    </Link>
                  </li>
                  <li>
                    <Link to="/rfq" className="hover:text-primary">
                      {t.requestQuote}
                    </Link>
                  </li>
                  <li>
                    <Link to="/sample-request" className="hover:text-primary">
                      {t.requestSample}
                    </Link>
                  </li>
                  <li>
                    <Link to="/logistics" className="hover:text-primary">
                      {t.incoterms}
                    </Link>
                  </li>
                  <li>
                    <Link to="/contact" className="hover:text-primary">
                      {t.contact}
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="text-sm">
                <div className="stencil text-xs text-[#142b21]">{t.origin}</div>
                <ul className="mt-4 space-y-2.5 text-[#44554a]">
                  <li>
                    <Link to="/farms" className="hover:text-primary">
                      {t.farmsQuality}
                    </Link>
                  </li>
                  <li>
                    <Link to="/track" className="hover:text-primary">
                      {t.trackShipment}
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-12 border-t border-[#d5d5cf] pt-6 text-center text-xs text-[#526158]">
            © {new Date().getFullYear()} Sokoni Export — {t.copyright}
          </div>
        </div>
      </div>
    </footer>
  );
}
