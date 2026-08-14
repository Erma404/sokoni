import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useSession } from "@/lib/app-context";
import { useT } from "@/lib/language";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import farmerImg from "@/assets/farmer-portrait.jpg";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Connexion acheteur — Sokoni Export" },
      {
        name: "description",
        content:
          "Connectez-vous au portail acheteur Sokoni Export pour suivre chaque commande d'avocat active et passée, télécharger les documents et gérer vos demandes de devis.",
      },
      { property: "og:title", content: "Connexion acheteur — Sokoni Export" },
      {
        property: "og:description",
        content: "Accédez à votre tableau de bord acheteur Sokoni Export.",
      },
    ],
  }),
  component: AuthPage,
});

const COPY = {
  fr: {
    buyerPortal: "Portail acheteur",
    signIn: "Se connecter",
    createAccount: "Créer un compte",
    checkEmailPre: "Vérifiez votre boîte mail — nous avons envoyé un lien de confirmation à",
    checkEmailPost: "Votre tableau de bord s'ouvre une fois l'adresse confirmée.",
    contactName: "Nom du contact",
    company: "Entreprise",
    email: "Email",
    password: "Mot de passe",
    pleaseWait: "Veuillez patienter…",
    or: "ou",
    continueGoogle: "Continuer avec Google",
    noAccount: "Pas encore de compte ? Inscrivez-vous en tant qu'acheteur",
    alreadyRegistered: "Déjà inscrit ? Se connecter",
    googleFailed: "Échec de la connexion Google",
  },
  en: {
    buyerPortal: "Buyer portal",
    signIn: "Sign in",
    createAccount: "Create account",
    checkEmailPre: "Check your inbox — we sent a confirmation link to",
    checkEmailPost: "Your dashboard opens once the address is confirmed.",
    contactName: "Contact name",
    company: "Company",
    email: "Email",
    password: "Password",
    pleaseWait: "Please wait…",
    or: "or",
    continueGoogle: "Continue with Google",
    noAccount: "No account yet? Register as a buyer",
    alreadyRegistered: "Already registered? Sign in",
    googleFailed: "Google sign-in failed",
  },
};

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
  const t = useT(COPY);

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
      toast.error(t.googleFailed);
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/dashboard" });
  }

  return (
    <div className="grid min-h-[calc(100vh-4rem)] lg:grid-cols-2">
      <div className="flex items-center justify-center px-5 py-16">
        <div className="w-full max-w-sm">
          <p className="eyebrow">{t.buyerPortal}</p>
          <h1 className="stencil mt-3 text-3xl font-medium text-primary">
            {mode === "signin" ? t.signIn : t.createAccount}
          </h1>

          {checkEmail ? (
            <p className="mt-6 border border-border bg-card p-5 text-sm text-muted-foreground">
              {t.checkEmailPre} <strong>{email}</strong>. {t.checkEmailPost}
            </p>
          ) : (
            <>
              <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
                {mode === "signup" && (
                  <>
                    <div className="space-y-1.5">
                      <Label className="eyebrow">{t.contactName}</Label>
                      <Input
                        required
                        maxLength={100}
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="eyebrow">{t.company}</Label>
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
                  <Label className="eyebrow">{t.email}</Label>
                  <Input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="eyebrow">{t.password}</Label>
                  <Input
                    required
                    type="password"
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <Button type="submit" variant="lime" className="w-full" disabled={busy}>
                  {busy ? t.pleaseWait : mode === "signin" ? t.signIn : t.createAccount}
                </Button>
              </form>

              <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
                <span className="h-px flex-1 bg-border" />
                {t.or}
                <span className="h-px flex-1 bg-border" />
              </div>

              <Button variant="outline" className="w-full" onClick={google}>
                {t.continueGoogle}
              </Button>

              <button
                className="mt-6 text-sm text-muted-foreground underline underline-offset-4"
                onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
              >
                {mode === "signin" ? t.noAccount : t.alreadyRegistered}
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
