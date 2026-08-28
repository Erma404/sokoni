import { Link, useNavigate } from "@tanstack/react-router";
import { LogOut } from "lucide-react";
import type { ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/lib/app-context";
import { SokoniMark, Wordmark } from "@/components/site/Brand";
import { Button } from "@/components/ui/button";

/**
 * Shell for internal / operator tools (back office and future admin pages).
 * Deliberately does not reuse the public site's Header/Footer or its
 * editorial "stencil"/"eyebrow" type treatment — this is an operations
 * console, not a page of the marketing site, so it gets its own compact,
 * data-dense chrome instead.
 */
export function AdminShell({ children }: { children: ReactNode }) {
  const { user } = useSession();
  const navigate = useNavigate();

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/", replace: true });
  }

  return (
    <div className="min-h-screen bg-muted/40">
      <header className="border-b border-[#123323] bg-[#0a2e21]">
        <div className="mx-auto flex h-14 max-w-[1400px] items-center gap-4 px-4 sm:px-6">
          <Link to="/admin" className="flex shrink-0 items-center gap-2">
            <SokoniMark className="size-6 text-white" />
            <Wordmark tone="invert" className="scale-[0.62] origin-left" />
          </Link>
          <span className="hidden rounded-full border border-white/15 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wider text-white/70 sm:inline-block">
            Back office
          </span>

          <div className="ml-auto flex min-w-0 items-center gap-4">
            {user?.email && (
              <span className="hidden truncate text-sm text-white/70 md:inline">{user.email}</span>
            )}
            <Link
              to="/"
              className="hidden text-sm text-white/70 transition-colors hover:text-white sm:inline"
            >
              Retour au site
            </Link>
            <Button
              size="sm"
              variant="ghost"
              onClick={signOut}
              className="gap-1.5 text-white/80 hover:bg-white/10 hover:text-white"
            >
              <LogOut className="size-3.5" />
              <span className="hidden sm:inline">Se déconnecter</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 sm:py-8">{children}</main>
    </div>
  );
}
