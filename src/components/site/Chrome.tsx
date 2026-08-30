import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowUpRight, LayoutDashboard, LogOut, Menu, ShieldCheck, User, X } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useRfq, useSession } from "@/lib/app-context";
import { useLanguage, useT, type Lang } from "@/lib/language";
import { Wordmark } from "@/components/site/Brand";
import avocadoHandfulImg from "@/assets/avocado-handful.jpg";
import avocadoCrateImg from "@/assets/avocado-crate-closeup.jpg";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const HELVETICA = '"Helvetica Neue", Helvetica, Arial, sans-serif';

const NAV: { to: string; label: Record<Lang, string> }[] = [
  { to: "/catalog", label: { fr: "Catalogue", en: "Catalog" } },
  { to: "/track", label: { fr: "Suivi", en: "Track" } },
  { to: "/farms", label: { fr: "Fermes & qualité", en: "Farms & Quality" } },
  { to: "/logistics", label: { fr: "Logistique", en: "Logistics" } },
  { to: "/contact", label: { fr: "Contact", en: "Contact" } },
];

const COPY = {
  fr: {
    contact: "Nous contacter",
    rfq: "Devis",
    backOffice: "Back-office",
    myOrders: "Mes commandes",
    signOut: "Se déconnecter",
    signIn: "Se connecter",
    myAccount: "Mon compte",
    accountMenu: "Menu du compte",
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
    myAccount: "My account",
    accountMenu: "Account menu",
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

/**
 * Signed-in identity — collapses "Mes commandes" / "Back-office" /
 * "Se déconnecter" into a single account menu instead of stacking them as
 * separate items in the main nav, the way any SaaS app header keeps
 * account actions out of primary navigation.
 */
function AccountMenu({
  user,
  isAdmin,
  onSignOut,
  t,
}: {
  user: { email?: string | null };
  isAdmin: boolean;
  onSignOut: () => void;
  t: (typeof COPY)["fr"];
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={t.accountMenu}
          className="flex size-8 items-center justify-center rounded-full bg-[#f6f8f7] text-[#44554a] transition-colors hover:text-[#0a4934]"
        >
          <User className="size-4" strokeWidth={2} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {user.email && (
          <>
            <DropdownMenuLabel className="truncate font-normal text-muted-foreground">
              {user.email}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem asChild>
          <Link to="/dashboard" className="cursor-pointer">
            <LayoutDashboard className="size-4" />
            {t.myOrders}
          </Link>
        </DropdownMenuItem>
        {isAdmin && (
          <DropdownMenuItem asChild>
            <Link to="/admin" className="cursor-pointer">
              <ShieldCheck className="size-4" />
              {t.backOffice}
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onSignOut} className="cursor-pointer text-clay">
          <LogOut className="size-4" />
          {t.signOut}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function LanguageSwitch({ className }: { className?: string }) {
  const { lang, setLang } = useLanguage();
  return (
    <div
      className={cn(
        "flex items-center overflow-hidden rounded-full border border-[#d5d5cf] text-xs font-medium",
        className,
      )}
      style={{ fontFamily: HELVETICA }}
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
            lang === l ? "bg-[#0a4934] text-white" : "text-[#526158] hover:text-[#142b21]",
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
    <header
      className="sticky top-0 z-50 bg-white/95 backdrop-blur"
      style={{ fontFamily: HELVETICA }}
    >
      <div className="mx-auto grid h-20 max-w-6xl grid-cols-[auto_1fr_auto] items-center gap-4 px-5">
        <Link
          to="/"
          aria-label="Sokoni Export home"
          className="transition-opacity hover:opacity-70"
        >
          <Wordmark />
        </Link>

        <nav className="hidden items-center justify-center gap-2 xl:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="whitespace-nowrap rounded-full bg-[#f6f8f7] px-3.5 py-2 text-sm text-[#44554a] transition-colors hover:text-[#0a4934]"
              activeProps={{ className: "text-[#0a4934] font-semibold" }}
            >
              {item.label[lang]}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center justify-end gap-4 whitespace-nowrap xl:flex">
          <LanguageSwitch />
          <Link
            to="/rfq"
            className="flex items-center gap-1 text-sm text-[#44554a] transition-colors hover:text-[#0a4934]"
          >
            {t.rfq}
            <span
              className={cn(
                "flex size-4 items-center justify-center rounded-full text-[0.6rem] font-semibold",
                count > 0 ? "bg-[#c9654a] text-white" : "bg-[#e5e5e0] text-[#526158]",
              )}
            >
              {count}
            </span>
          </Link>

          {user ? (
            <AccountMenu user={user} isAdmin={isAdmin} onSignOut={signOut} t={t} />
          ) : (
            <Link
              to="/auth"
              className="text-sm text-[#44554a] transition-colors hover:text-[#0a4934]"
            >
              {t.signIn}
            </Link>
          )}

          <Link to="/rfq">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#0a4934] px-5 py-2.5 text-xs font-bold text-white transition-colors hover:bg-[#0a4934]/90">
              {t.requestQuote}
              <ArrowUpRight className="size-3.5" />
            </span>
          </Link>
        </div>

        <div className="col-start-3 flex items-center gap-3 xl:hidden">
          <LanguageSwitch />
          <button className="shrink-0" onClick={() => setOpen((v) => !v)} aria-label={t.toggleNav}>
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-[#e5e5e0] bg-white px-5 py-4 xl:hidden">
          <div className="flex flex-col gap-3">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="text-sm text-[#142b21]"
              >
                {item.label[lang]}
              </Link>
            ))}
            <Link to="/contact" onClick={() => setOpen(false)} className="text-sm text-[#c9654a]">
              {t.contact}
            </Link>
            <Link to="/rfq" onClick={() => setOpen(false)} className="text-sm text-[#142b21]">
              {t.rfqCart} ({count})
            </Link>

            {/* Account actions — visually separated from marketing nav so
                the drawer doesn't read as one flat, undifferentiated list. */}
            <div className="mt-1 flex flex-col gap-3 border-t border-[#e5e5e0] pt-3">
              {user ? (
                <>
                  {user.email && <p className="truncate text-xs text-[#8a9690]">{user.email}</p>}
                  <Link
                    to="/dashboard"
                    onClick={() => setOpen(false)}
                    className="text-sm text-[#142b21]"
                  >
                    {t.myOrders}
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setOpen(false)}
                      className="text-sm text-[#142b21]"
                    >
                      {t.backOffice}
                    </Link>
                  )}
                  <button className="text-left text-sm text-[#526158]" onClick={signOut}>
                    {t.signOut}
                  </button>
                </>
              ) : (
                <Link to="/auth" onClick={() => setOpen(false)} className="text-sm text-[#142b21]">
                  {t.signIn}
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export function Footer() {
  const t = useT(COPY);
  return (
    <footer className="mt-3 bg-white">
      <div className="mx-auto max-w-[1800px] px-3 sm:px-5 lg:px-8">
        <div
          className="rounded-xl bg-[#f4f4f2] px-[7%] py-16 sm:py-20"
          style={{ fontFamily: HELVETICA }}
        >
          <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-8">
            <div className="text-center lg:text-left">
              <span className="inline-block">
                <Wordmark />
              </span>
              <h2 className="mt-6 text-4xl font-normal tracking-[-0.03em] text-[#142b21] sm:text-5xl">
                {t.footerHeadline}
              </h2>
              <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-[#44554a] lg:mx-0">
                {t.footerTagline}
              </p>
              <Link to="/rfq" className="mt-6 inline-block">
                <span className="inline-flex items-center gap-2 rounded-full bg-[#0a4934] px-6 py-3 text-sm font-bold text-white">
                  {t.requestQuote}
                  <ArrowUpRight className="size-3.5" />
                </span>
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-8 sm:grid-cols-2">
              <div className="text-sm">
                <div className="text-xs font-bold uppercase tracking-[0.08em] text-[#142b21]">
                  {t.trade}
                </div>
                <ul className="mt-4 space-y-2.5 text-[#44554a]">
                  <li>
                    <Link to="/catalog" className="hover:text-[#0a4934]">
                      {t.catalog}
                    </Link>
                  </li>
                  <li>
                    <Link to="/rfq" className="hover:text-[#0a4934]">
                      {t.requestQuote}
                    </Link>
                  </li>
                  <li>
                    <Link to="/sample-request" className="hover:text-[#0a4934]">
                      {t.requestSample}
                    </Link>
                  </li>
                  <li>
                    <Link to="/logistics" className="hover:text-[#0a4934]">
                      {t.incoterms}
                    </Link>
                  </li>
                  <li>
                    <Link to="/contact" className="hover:text-[#0a4934]">
                      {t.contact}
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="text-sm">
                <div className="text-xs font-bold uppercase tracking-[0.08em] text-[#142b21]">
                  {t.origin}
                </div>
                <ul className="mt-4 space-y-2.5 text-[#44554a]">
                  <li>
                    <Link to="/farms" className="hover:text-[#0a4934]">
                      {t.farmsQuality}
                    </Link>
                  </li>
                  <li>
                    <Link to="/track" className="hover:text-[#0a4934]">
                      {t.trackShipment}
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Decorative bookend photos, framing the divider before the copyright line */}
          <div className="mt-12 flex items-center gap-4 sm:gap-6">
            <div className="mask-avocado hidden size-16 shrink-0 sm:block sm:size-20">
              <img
                src={avocadoHandfulImg}
                alt=""
                aria-hidden
                className="h-full w-full object-cover"
              />
            </div>
            <div className="h-px flex-1 bg-[#d5d5cf]" />
            <div className="mask-avocado hidden size-16 shrink-0 sm:block sm:size-20">
              <img
                src={avocadoCrateImg}
                alt=""
                aria-hidden
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-[#526158]">
            © {new Date().getFullYear()} Sokoni Export — {t.copyright}
          </div>
        </div>
      </div>
    </footer>
  );
}
