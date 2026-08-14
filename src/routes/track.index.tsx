import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSession } from "@/lib/app-context";
import { useT } from "@/lib/language";
import { Link } from "@tanstack/react-router";
import trackImg from "@/assets/farmer-portrait.jpg";

export const Route = createFileRoute("/track/")({
  head: () => ({
    meta: [
      { title: "Suivre une commande — Sokoni Export" },
      {
        name: "description",
        content:
          "Entrez votre code de suivi Sokoni pour suivre en direct votre commande d'avocat depuis la ferme kenyane jusqu'à Rungis, avec les documents joints à chaque étape.",
      },
      { property: "og:title", content: "Suivre une commande — Sokoni Export" },
      {
        property: "og:description",
        content: "Suivi en direct de la ferme à Rungis pour chaque commande Sokoni Export.",
      },
    ],
  }),
  component: TrackEntry,
});

const COPY = {
  fr: {
    traceability: "Traçabilité",
    title: "Suivre ma commande",
    intro:
      "Entrez le code de suivi indiqué sur votre confirmation de commande. Le lien fonctionne sans compte — partagez-le avec votre équipe ou votre client.",
    trackingCode: "Code de suivi",
    track: "Suivre",
    signedInPre: "Connecté —",
    seeAllOrders: "voir toutes vos commandes",
    multipleShipments: "Acheteur avec plusieurs commandes ?",
    signIn: "Se connecter",
    signInSuffix:
      "pour voir toutes vos commandes actives et passées dans un tableau de bord unique.",
  },
  en: {
    traceability: "Traceability",
    title: "Track my order",
    intro:
      "Enter the tracking code on your order confirmation. The link works without an account — share it with your own team or your customer.",
    trackingCode: "Tracking code",
    track: "Track",
    signedInPre: "Signed in —",
    seeAllOrders: "see all your orders",
    multipleShipments: "Buyer with several shipments?",
    signIn: "Sign in",
    signInSuffix: "to see every active and past order in one dashboard.",
  },
};

function TrackEntry() {
  const [code, setCode] = useState("");
  const navigate = useNavigate();
  const { user } = useSession();
  const t = useT(COPY);

  return (
    <div className="mx-auto max-w-6xl px-5 py-14 sm:py-20">
      <div className="grid gap-10 md:grid-cols-[1fr_0.8fr] md:items-center">
        <div className="max-w-2xl">
          <p className="eyebrow">{t.traceability}</p>
          <h1 className="mt-3 text-4xl font-normal tracking-[-0.02em] text-primary sm:text-4xl">
            {t.title}
          </h1>
          <p className="mt-4 text-muted-foreground">{t.intro}</p>

          <form
            className="mt-8 flex flex-col gap-3 sm:flex-row"
            onSubmit={(e) => {
              e.preventDefault();
              if (code.trim()) navigate({ to: "/track/$code", params: { code: code.trim() } });
            }}
          >
            <Input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="SKN-2026-0148"
              aria-label={t.trackingCode}
              className="font-mono"
            />
            <Button type="submit" variant="cta">
              {t.track}
              <ArrowRight className="size-4" />
            </Button>
          </form>

          <div className="mt-10 rule-top pt-6 text-sm text-muted-foreground">
            {user ? (
              <>
                {t.signedInPre}{" "}
                <Link to="/dashboard" className="text-clay underline underline-offset-4">
                  {t.seeAllOrders}
                </Link>
                .
              </>
            ) : (
              <>
                {t.multipleShipments}{" "}
                <Link to="/auth" className="text-clay underline underline-offset-4">
                  {t.signIn}
                </Link>{" "}
                {t.signInSuffix}
              </>
            )}
          </div>
        </div>
        <div className="hidden overflow-hidden rounded-xl md:block">
          <img
            src={trackImg}
            alt="Producteur certifié Sokoni Export, Murang'a, Kenya"
            className="aspect-[4/3] w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
