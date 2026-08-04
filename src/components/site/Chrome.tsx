import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useRfq, useSession } from "@/lib/app-context";
import { Button } from "@/components/ui/button";
import { Wordmark } from "@/components/site/Brand";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/catalog", label: "Catalog" },
  { to: "/track", label: "Track" },
  { to: "/farms", label: "Farms & Quality" },
  { to: "/logistics", label: "Logistics" },
];

export function Header() {
  const { user, isAdmin } = useSession();
  const { count } = useRfq();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

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
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Link to="/contact">
            <Button variant="clay" size="sm">
              Contact us
            </Button>
          </Link>
          <Link to="/rfq">
            <Button variant="ghost" size="sm">
              RFQ
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
                Back-office
              </Button>
            </Link>
          )}
          {user ? (
            <>
              <Link to="/dashboard">
                <Button variant="outline" size="sm">
                  My orders
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={signOut}>
                Sign out
              </Button>
            </>
          ) : (
            <Link to="/auth">
              <Button size="sm">Sign in</Button>
            </Link>
          )}
        </div>

        <button
          className="md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle navigation"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
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
                {item.label}
              </Link>
            ))}
            <Link to="/contact" onClick={() => setOpen(false)} className="text-sm text-clay">
              Contact us
            </Link>
            <Link to="/rfq" onClick={() => setOpen(false)} className="text-sm text-foreground">
              RFQ cart ({count})
            </Link>
            {isAdmin && (
              <Link to="/admin" onClick={() => setOpen(false)} className="text-sm text-foreground">
                Back-office
              </Link>
            )}
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setOpen(false)}
                  className="text-sm text-foreground"
                >
                  My orders
                </Link>
                <button className="text-left text-sm text-muted-foreground" onClick={signOut}>
                  Sign out
                </button>
              </>
            ) : (
              <Link to="/auth" onClick={() => setOpen(false)} className="text-sm text-foreground">
                Sign in
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="relative mt-24 overflow-hidden border-t border-border bg-primary text-primary-foreground">
      <div className="relative mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:grid-cols-3">
        <div>
          <Wordmark tone="invert" />

          <p className="mt-3 max-w-xs text-sm text-primary-foreground/70">
            Direct-trade Hass avocado from certified Kenyan farms to the Rungis wholesale market,
            Paris.
          </p>
        </div>
        <div className="text-sm">
          <div className="eyebrow text-primary-foreground/60">Trade</div>
          <ul className="mt-3 space-y-2 text-primary-foreground/80">
            <li>
              <Link to="/catalog">Catalog</Link>
            </li>
            <li>
              <Link to="/rfq">Request a quote</Link>
            </li>
            <li>
              <Link to="/sample-request">Request a sample</Link>
            </li>
            <li>
              <Link to="/logistics">Incoterms &amp; lead times</Link>
            </li>
            <li>
              <Link to="/contact">Contact us</Link>
            </li>
          </ul>
        </div>
        <div className="text-sm">
          <div className="eyebrow text-primary-foreground/60">Origin</div>
          <ul className="mt-3 space-y-2 text-primary-foreground/80">
            <li>
              <Link to="/farms">Farms &amp; quality</Link>
            </li>
            <li>
              <Link to="/track">Track a shipment</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="relative border-t border-primary-foreground/15">
        <div className="mx-auto max-w-6xl px-5 py-5 text-xs text-primary-foreground/50">
          © {new Date().getFullYear()} Sokoni Export — Nairobi · Rungis
        </div>
      </div>
    </footer>
  );
}
