import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useSession } from "@/lib/app-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import farmerImg from "@/assets/farmer-portrait.jpg";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Buyer Sign In — Sokoni Export" },
      {
        name: "description",
        content:
          "Sign in to the Sokoni Export buyer portal to follow every active and past avocado shipment, download documents and manage your quote requests.",
      },
      { property: "og:title", content: "Buyer Sign In — Sokoni Export" },
      { property: "og:description", content: "Access your Sokoni Export buyer dashboard." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [company, setCompany] = useState("");
  const [fullName, setFullName] = useState("");
  const [busy, setBusy] = useState(false);
  const [checkEmail, setCheckEmail] = useState(false);
  const { user } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate({ to: "/dashboard", replace: true });
  }, [user, navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    if (mode === "signin") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setBusy(false);
      if (error) {
        toast.error(error.message);
        return;
      }
      navigate({ to: "/dashboard" });
      return;
    }
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: { full_name: fullName, company },
      },
    });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    if (!data.session) setCheckEmail(true);
    else navigate({ to: "/dashboard" });
  }


  async function google() {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      toast.error("Google sign-in failed");
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/dashboard" });
  }

  return (
    <div className="grid min-h-[calc(100vh-4rem)] lg:grid-cols-2">
      <div className="flex items-center justify-center px-5 py-16">
        <div className="w-full max-w-sm">
          <p className="eyebrow">Buyer portal</p>
          <h1 className="stencil mt-3 text-3xl font-medium text-primary">
            {mode === "signin" ? "Sign in" : "Create account"}
          </h1>

          {checkEmail ? (
            <p className="mt-6 border border-border bg-card p-5 text-sm text-muted-foreground">
              Check your inbox — we sent a confirmation link to <strong>{email}</strong>. Your
              dashboard opens once the address is confirmed.
            </p>
          ) : (
            <>
              <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
                {mode === "signup" && (
                  <>
                    <div className="space-y-1.5">
                      <Label className="eyebrow">Contact name</Label>
                      <Input
                        required
                        maxLength={100}
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="eyebrow">Company</Label>
                      <Input
                        required
                        maxLength={120}
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                      />
                    </div>
                  </>
                )}
                <div className="space-y-1.5">
                  <Label className="eyebrow">Email</Label>
                  <Input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="eyebrow">Password</Label>
                  <Input
                    required
                    type="password"
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <Button type="submit" variant="clay" className="w-full" disabled={busy}>
                  {busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
                </Button>
              </form>

              <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
                <span className="h-px flex-1 bg-border" />
                or
                <span className="h-px flex-1 bg-border" />
              </div>

              <Button variant="outline" className="w-full" onClick={google}>
                Continue with Google
              </Button>

              <button
                className="mt-6 text-sm text-muted-foreground underline underline-offset-4"
                onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
              >
                {mode === "signin"
                  ? "No account yet? Register as a buyer"
                  : "Already registered? Sign in"}
              </button>
            </>
          )}
        </div>
      </div>

      <img
        src={farmerImg}
        alt="Kenyan avocado grower holding a harvest crate"
        width={1200}
        height={1600}
        loading="lazy"
        className="hidden h-full w-full object-cover lg:block"
      />
    </div>
  );
}
